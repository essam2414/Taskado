import { Component, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { IProductivityReport } from '../productivity-report.model';
import { EntityArrayResponseType, ProductivityReportService } from '../service/productivity-report.service';
import { ProductivityReportDeleteDialogComponent } from '../delete/productivity-report-delete-dialog.component';

import { Chart, ChartDataset } from 'chart.js/auto';
import dayjs from 'dayjs';

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
  productivityReports?: IProductivityReport[];
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

  public readonly router = inject(Router);
  protected readonly productivityReportService = inject(ProductivityReportService);
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
          if (!this.productivityReports || this.productivityReports.length === 0) {
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
    this.currentDate = this.currentDate.subtract(1, 'day');
    this.timestamp = this.currentDate.locale('en').format('D MMM YYYY');
  }

  goToNextDay(): void {
    const today = dayjs();

    if (this.currentDate.isBefore(today, 'day')) {
      this.currentDate = this.currentDate.add(1, 'day');
      this.timestamp = this.currentDate.locale('en').format('D MMM YYYY');
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
    this.isDeleteModalOpen = true;
  }

  // Confirm the deletion
  confirmDelete(): void {
    this.closeDeleteModal();
  }

  // Cancel the deletion
  cancelDelete(): void {
    this.closeDeleteModal();
  }

  // Close the modal
  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
  }

  generateReport(): void {
    if (!this.productivityReports || this.productivityReports.length === 0) {
      this.errorMessage = 'Not Enough Data Available';
      setTimeout(() => (this.errorMessage = null), 2500);
      return;
    }

    // Load the first report into the UI
    const report = this.productivityReports[0];
    this.tasksPlanned = report.tasksPlanned ?? 'N/A';
    this.tasksCompleted = report.tasksCompleted ?? 'N/A';
    this.pomodoroSessionsCompleted = report.pomodoroSessionsCompleted ?? 'N/A';
    this.totalFocusTime = report.totalFocusTime ?? 'N/A';
    this.efficiencyScore = report.efficiencyScore ?? 'N/A';
    this.timestamp = report.timestamp ? dayjs(report.timestamp).locale('en').format('D MMM YYYY') : 'Unselected';

    // Update chart data dynamically if the chart exists
    if (this.chart) {
      this.chart.data.datasets[0].data = [
        report.tasksPlanned ?? 0,
        report.tasksCompleted ?? 0,
        report.pomodoroSessionsCompleted ?? 0,
        report.efficiencyScore ?? 0,
      ] as ChartDataset<'bar'>['data']; // Explicitly cast to correct type

      this.chart.update(); // Refresh the chart with new data
    } else {
      console.warn('⚠️ Chart is not initialized.');
    }

    this.successMessage = '✅ Report Generated Successfully!';
    setTimeout(() => (this.successMessage = null), 2500);
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
    this.productivityReports = this.refineData(dataFromBody);
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
