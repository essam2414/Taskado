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

// Plugin to draw efficiency score text inside the gauge
const gaugeCenterTextPlugin = {
  id: 'centerText',
  beforeDraw(chart: any) {
    const { width, height } = chart;
    const ctx = chart.ctx;

    const raw = chart?.data?.datasets?.[0]?.data?.[0];
    const rawValue: number = typeof raw === 'number' ? raw : parseFloat(String(raw)) || 0;
    const text = `${Math.round(rawValue)}%`;

    ctx.restore();
    ctx.font = `${(height / 114).toFixed(2)}em sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#333';

    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 1.5;

    ctx.fillText(text, textX, textY);
    ctx.save();
  },
};

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
  public taskChart: Chart | null = null;
  public habitChart: Chart | null = null;
  public focusChart: Chart | null = null;
  public efficiencyGauge: Chart | null = null;

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
  completedTaskTitles: (string | null | undefined)[] = [];
  completedHabitNames: (string | null | undefined)[] = [];
  habitStreak: number | string = 'N/A';
  suggestion = '';

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
      .subscribe();
  }

  renderTasksChart(): void {
    const canvas = document.getElementById('tasksChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.taskChart) {
      this.taskChart.destroy();
    }

    const tasksPlanned = typeof this.tasksPlanned === 'number' ? this.tasksPlanned : 0;
    const tasksCompleted = typeof this.tasksCompleted === 'number' ? this.tasksCompleted : 0;
    const tasksRemaining = Math.max(tasksPlanned - tasksCompleted, 0);

    this.taskChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Remaining'],
        datasets: [
          {
            data: [tasksCompleted, tasksRemaining],
            backgroundColor: ['#28a745', '#dc3545'],
            hoverBackgroundColor: ['#218838', '#c82333'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });
  }

  renderHabitsChart(): void {
    const canvas = document.getElementById('habitsChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.habitChart) {
      this.habitChart.destroy();
    }

    const habitsCompleted = this.completedHabitNames.length;
    const streakLength = typeof this.habitStreak === 'string' ? parseInt(this.habitStreak, 10) || 0 : this.habitStreak;

    this.habitChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Habits Completed', 'Habit Streak (days)'],
        datasets: [
          {
            label: 'Habits Data',
            data: [habitsCompleted, streakLength],
            backgroundColor: ['#007bff', '#ffc107'],
            borderRadius: 8,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
    });
  }

  renderFocusChart(): void {
    const canvas = document.getElementById('focusChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.focusChart) {
      this.focusChart.destroy();
    }

    const focusTime = typeof this.totalFocusTime === 'number' ? this.totalFocusTime : parseFloat(this.totalFocusTime) || 0;

    this.focusChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Focus Time'],
        datasets: [
          {
            label: 'Hours Focused',
            data: [focusTime],
            backgroundColor: ['#17a2b8'],
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 6, // You can adjust based on your daily goal
            ticks: { precision: 0 },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: context => `${context.dataset.label}: ${context.raw as number} hours`,
            },
          },
        },
      },
    });
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

  renderEfficiencyGauge(): void {
    const canvas = document.getElementById('efficiencyGauge') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.efficiencyGauge) {
      this.efficiencyGauge.destroy();
    }

    const score = typeof this.efficiencyScore === 'number' ? this.efficiencyScore : parseFloat(this.efficiencyScore) || 0;

    const remainder = 100 - score;

    // 🎨 Determine color
    let fillColor = '#28a745'; // green
    if (score < 50) {
      fillColor = '#dc3545'; // red
    } else if (score < 75) {
      fillColor = '#ffc107'; // yellow
    }

    this.efficiencyGauge = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Efficiency', 'Remaining'],
        datasets: [
          {
            data: [score, remainder],
            backgroundColor: [fillColor, '#e0e0e0'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        rotation: -90,
        circumference: 180,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: context => `${String(context.label)}: ${Number(context.raw)}%`,
            },
          },
        },
      },
      plugins: [gaugeCenterTextPlugin],
    });
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

    this.completedTaskTitles = this.currentReport.completedTasks?.map(task => task.title) ?? [];

    this.completedHabitNames = this.currentReport.completedHabits?.map(habit => habit.name) ?? [];
    this.habitStreak = this.calculateHabitStreak();

    this.suggestion = this.getSuggestionForScore(this.efficiencyScore);

    this.renderTasksChart();
    this.renderHabitsChart();
    this.renderFocusChart();
    this.renderEfficiencyGauge();
  }

  async generateReport(): Promise<void> {
    const now = dayjs();

    try {
      const tasks = (await firstValueFrom(this.taskService.query())).body ?? [];
      const completedTasksToday = tasks.filter(t => t.completed && t.updatedAt && dayjs(t.updatedAt).isSame(now, 'day'));

      const pomodoros = (await firstValueFrom(this.pomodoroSessionService.query())).body ?? [];
      const completedPomodorosToday = pomodoros.filter(p => p.completed && dayjs(p.startTime).isSame(now, 'day'));

      const habits = (await firstValueFrom(this.habitService.query())).body ?? [];
      const completedHabitsToday = habits.filter(habit => {
        if (!habit.completedDates) return false;
        try {
          const parsedDates: string[] = JSON.parse(habit.completedDates);
          return parsedDates.some(dateStr => dayjs(dateStr).isSame(now, 'day'));
        } catch (err) {
          console.warn('Failed to parse completedDates for habit:', habit.name, err);
          return false;
        }
      });

      const tasksPlanned = tasks.length;
      const tasksCompleted = completedTasksToday.length;
      const pomodoroSessionsCompleted = completedPomodorosToday.length;
      const totalFocusMinutes = completedPomodorosToday.reduce((sum, p) => sum + (p.duration ?? 0), 0);
      const totalFocusTime = totalFocusMinutes / 60;
      const distractionsCount = 0;

      const totalPlanned = tasksPlanned + habits.length + pomodoros.length;
      const totalCompleted = tasksCompleted + completedHabitsToday.length + pomodoroSessionsCompleted;
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
        completedTasks: completedTasksToday,
        completedHabits: completedHabitsToday,
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
            this.productivityReports = this.keepLatestReportPerDay(this.productivityReports);
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
    } else if (contentType === 'overview') {
      this.popupTitle = 'Overview';
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

  updateReport(): void {
    this.successMessage = '✅ Report Updated!';
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
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

    if (this.productivityReports.length === 0) {
      // 🔁 CLEAR the dashboard if no reports are left
      this.currentReport = null;
      this.currentReportIndex = -1;
      this.tasksPlanned = 'N/A';
      this.tasksCompleted = 'N/A';
      this.pomodoroSessionsCompleted = 'N/A';
      this.totalFocusTime = 'N/A';
      this.efficiencyScore = 'N/A';
      this.timestamp = 'Unselected';
      this.reportCreatedTime = 'Unselected';
      this.habitStreak = 'N/A';
      this.completedTaskTitles = [];
      this.completedHabitNames = [];
      this.suggestion = 'N/A';
      this.renderTasksChart();
      this.renderHabitsChart();
      this.renderFocusChart();
      this.renderEfficiencyGauge();
    } else {
      this.currentReportIndex = this.productivityReports.length - 1;
      this.currentReport = this.productivityReports[this.currentReportIndex];
      this.updateDashboard();
    }
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

  private calculateHabitStreak(): number {
    let streak = 0;

    // Sort reports in reverse chronological order
    const sortedReports = [...this.productivityReports]
      .filter(r => !!r.timestamp)
      .sort((a, b) => dayjs(b.timestamp).diff(dayjs(a.timestamp)));

    for (const report of sortedReports) {
      const date = dayjs(report.timestamp);
      const daysAgo = dayjs().startOf('day').diff(date.startOf('day'), 'day');

      // Only consider streaks up to today
      if (daysAgo < 0) continue;

      const isConsecutive = daysAgo === streak;
      const hasHabits = (report.completedHabits?.length ?? 0) > 0;

      if (isConsecutive && hasHabits) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  private getSuggestionForScore(score: number | string): string {
    const numericScore = typeof score === 'number' ? score : parseFloat(score);

    if (numericScore >= 90) {
      return '🚀 Fantastic! You’re on fire!';
    } else if (numericScore >= 75) {
      return '💪 Keep the momentum going!';
    } else if (numericScore >= 50) {
      return '⚖️ Consider focusing a bit more.';
    } else if (numericScore >= 25) {
      return '🔄 Try shorter sessions or fewer tasks.';
    } else {
      return '🛌 Maybe take a break and reset.';
    }
  }
}
