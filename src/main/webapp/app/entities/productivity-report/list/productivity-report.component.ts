import { Component, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap, firstValueFrom } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { IProductivityReport } from '../productivity-report.model';
import { EntityArrayResponseType, ProductivityReportService } from '../service/productivity-report.service';
import { ProductivityReportDeleteDialogComponent } from '../delete/productivity-report-delete-dialog.component';

import { TaskService } from 'app/entities/task/service/task.service';
import { HabitService } from 'app/entities/habit/service/habit.service';
import { PomodoroSessionService } from 'app/entities/pomodoro-session/service/pomodoro-session.service';
import { NewProductivityReport } from '../productivity-report.model';

import { Chart, ChartDataset } from 'chart.js/auto';
import dayjs from 'dayjs/esm';

@Component({
  standalone: true,
  selector: 'jhi-productivity-report',
  templateUrl: './productivity-report.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
  ],
})
export class ProductivityReportComponent implements OnInit {
  subscription: Subscription | null = null;
  productivityReports: IProductivityReport[] = [];
  isLoading = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  isDropdownOpen = false;
  isDeleteModalOpen = false;

  sortState = sortStateSignal({});

  public chart: Chart | null = null;

  // Default values before report generation
  tasksPlanned: number | string = 'N/A';
  tasksCompleted: number | string = 'N/A';
  pomodoroSessionsCompleted: number | string = 'N/A';
  totalFocusTime: number | string = 'N/A';
  efficiencyScore: number | string = 'N/A';
  currentDate = dayjs(); // tracks the current "viewed" date
  timestamp: string = this.currentDate.locale('en').format('D MMM YYYY');

  // Cards initialisation
  popupOpen = false;
  popupContent: string | null = null;
  popupTitle = '';
  currentReport: IProductivityReport | null = null;
  currentReportIndex = -1;
  reportCreatedTime = 'Unselected';

  public readonly router = inject(Router);
  protected readonly productivityReportService = inject(ProductivityReportService);
  protected readonly taskService = inject(TaskService);
  protected readonly habitService = inject(HabitService);
  protected readonly pomodoroSessionService = inject(PomodoroSessionService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (item: IProductivityReport): number => this.productivityReportService.getProductivityReportIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (this.productivityReports.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe({
        next: () => {
          setTimeout(() => this.loadChart(), 100); // Ensure chart loads AFTER data is available
        },
      });
  }

  loadChart(): void {
    setTimeout(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('⚠️ Failed to get chart context!');
        return;
      }

      // Destroy previous chart instance if it exists
      if (this.chart) {
        this.chart.destroy();
      }

      // Initial values set to zero
      const initialData = [0, 0, 0, 0];

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Tasks Planned', 'Tasks Completed', 'Pomodoro Sessions', 'Efficiency Score'],
          datasets: [
            {
              label: 'Productivity Metrics',
              data: initialData,
              backgroundColor: ['#007bff', '#28a745', '#ff6384', '#ffc107'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    }, 500); // Delay to ensure Angular updates the DOM
  }

  goToPreviousDay(): void {
    if (this.productivityReports.length === 0) return;

    if (this.currentReportIndex > 0) {
      this.currentReportIndex--;
      this.loadReport();
    } else {
      this.errorMessage = 'No previous report available.';
      setTimeout(() => (this.errorMessage = null), 2500);
    }
  }

  goToNextDay(): void {
    if (this.productivityReports.length === 0) return;

    if (this.currentReportIndex < this.productivityReports.length - 1) {
      this.currentReportIndex++;
      this.loadReport();
    } else {
      this.errorMessage = 'No next report available.';
      setTimeout(() => (this.errorMessage = null), 2500);
    }
  }

  updateDashboard(): void {
    if (!this.currentReport) {
      return;
    }

    this.tasksPlanned = this.currentReport.tasksPlanned ?? 'N/A';
    this.tasksCompleted = this.currentReport.tasksCompleted ?? 'N/A';
    this.pomodoroSessionsCompleted = this.currentReport.pomodoroSessionsCompleted ?? 'N/A';
    this.totalFocusTime = this.currentReport.totalFocusTime ?? 'N/A';
    this.efficiencyScore = this.currentReport.efficiencyScore ?? 'N/A';

    this.reportCreatedTime = this.currentReport.timestamp
      ? dayjs(this.currentReport.timestamp).locale('en').format('h:mm A')
      : 'Unselected';

    this.timestamp = this.currentReport.timestamp ? dayjs(this.currentReport.timestamp).locale('en').format('D MMM YYYY') : 'Unselected';
  }

  async generateReport(): Promise<void> {
    const now = dayjs();

    try {
      const tasks = (await firstValueFrom(this.taskService.query())).body ?? [];
      const completedTasksToday = tasks.filter(t => t.completed && dayjs(t.updatedAt).isSame(now, 'day'));

      const pomodoros = (await firstValueFrom(this.pomodoroSessionService.query())).body ?? [];
      const completedPomodorosToday = pomodoros.filter(p => p.completed && dayjs(p.startTime).isSame(now, 'day'));

      const habits = (await firstValueFrom(this.habitService.query())).body ?? [];

      const tasksPlanned = tasks.length;
      const tasksCompleted = completedTasksToday.length;
      const pomodoroSessionsCompleted = completedPomodorosToday.length;
      const totalFocusMinutes = completedPomodorosToday.reduce((sum, p) => sum + (p.duration ?? 0), 0);
      const totalFocusTime = totalFocusMinutes / 60;
      const distractionsCount = 0;

      const totalPlanned = tasksPlanned + habits.length + pomodoros.length;
      const totalCompleted = tasksCompleted + habits.length + pomodoroSessionsCompleted;
      const efficiencyScore = totalPlanned > 0 ? Math.min(100, (totalCompleted / totalPlanned) * 100) : 0;

      const newReport: NewProductivityReport = {
        id: null,
        tasksPlanned,
        tasksCompleted,
        pomodoroSessionsCompleted,
        totalFocusTime,
        distractionsCount,
        efficiencyScore,
        timestamp: now,
        completedTasks: [],
        completedHabits: [],
      };

      this.productivityReportService.create(newReport).subscribe({
        next: response => {
          const createdReport = response.body;
          if (createdReport) {
            this.successMessage = '✅ Report created!';
            setTimeout(() => {
              this.successMessage = null;
            }, 3000);

            this.productivityReports.push(createdReport);

            // Re-filter to keep only latest report per day
            this.productivityReports = this.keepLatestReportPerDay(this.productivityReports);

            // Update current index to latest day (the end of the list)
            this.currentReportIndex = this.productivityReports.length - 1;
            this.currentReport = this.productivityReports[this.currentReportIndex];
            this.updateDashboard();
          } else {
            this.errorMessage = '⚠️ Failed to create report (empty response)';
          }
        },
        error: err => {
          console.error('⚠️ Error creating report:', err);
          this.errorMessage = '⚠️ Failed to create report.';
        },
      });
    } catch (error) {
      console.error('⚠️ Error generating report:', error);
      this.errorMessage = '⚠️ Failed to fetch data.';
    }
  }

  openPopup(contentType: string): void {
    this.popupOpen = true;
    this.popupContent = contentType;

    if (contentType === 'tasks') {
      this.popupTitle = 'Task Details';
    } else if (contentType === 'focus') {
      this.popupTitle = 'Focus Details';
    } else if (contentType === 'habits') {
      this.popupTitle = 'Habit Details';
    }
  }

  closePopup(): void {
    this.popupOpen = false;
    this.popupContent = null;
    this.popupTitle = '';
  }

  navigateReport(): void {
    this.errorMessage = 'No Reports Available';

    // Automatically remove the error message after 3 seconds
    setTimeout(() => {
      this.errorMessage = null;
    }, 2500);
  }

  // Call this function when the delete button is clicked
  openDeleteModal(): void {
    if (!this.currentReport) {
      this.errorMessage = '⚠️ No report selected.';
      setTimeout(() => (this.errorMessage = null), 3000);
      return;
    }
    this.isDeleteModalOpen = true;
  }

  confirmDelete(): void {
    if (!this.currentReport?.id) {
      this.errorMessage = '⚠️ No report selected for deletion.';
      this.closeDeleteModal();
      return;
    }

    const modalRef = this.modalService.open(ProductivityReportDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.productivityReport = this.currentReport;

    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT), // comma here ✅
        tap(() => {
          this.successMessage = '✅ Report deleted!';
          setTimeout(() => (this.successMessage = null), 3000);
          this.load(); // reload fresh data
        }),
      )
      .subscribe(); // end with .subscribe()

    this.closeDeleteModal();
  }

  // Close the modal
  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
  }

  loadReport(): void {
    if (this.productivityReports.length === 0) {
      this.errorMessage = 'No reports available.';
      return;
    }

    const sortedReports = [...this.productivityReports].sort((a, b) => dayjs(a.timestamp).diff(dayjs(b.timestamp)));

    if (this.currentReportIndex < 0 || this.currentReportIndex >= sortedReports.length) {
      this.currentReportIndex = 0;
    }

    this.currentReport = sortedReports[this.currentReportIndex];
    this.updateDashboard();
  }

  delete(productivityReport: IProductivityReport): void {
    const modalRef = this.modalService.open(ProductivityReportDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.productivityReport = productivityReport;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
        this.loadReport();
      },
    });
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    const refinedData = this.refineData(dataFromBody);

    this.productivityReports = this.keepLatestReportPerDay(refinedData);
    this.currentReportIndex = this.productivityReports.length - 1;
  }

  protected keepLatestReportPerDay(data: IProductivityReport[]): IProductivityReport[] {
    const latestReportsMap = new Map<string, IProductivityReport>();

    data.forEach(report => {
      if (report.timestamp) {
        const day = dayjs(report.timestamp).format('YYYY-MM-DD'); // only keep date part
        const existing = latestReportsMap.get(day);

        if (!existing || dayjs(report.timestamp).isAfter(dayjs(existing.timestamp))) {
          latestReportsMap.set(day, report);
        }
      }
    });

    return Array.from(latestReportsMap.values()).sort((a, b) => dayjs(a.timestamp).diff(dayjs(b.timestamp)));
  }

  protected refineData(data: IProductivityReport[]): IProductivityReport[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IProductivityReport[] | null): IProductivityReport[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      eagerload: true,
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.productivityReportService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(sortState: SortState): void {
    const queryParamsObj = {
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
