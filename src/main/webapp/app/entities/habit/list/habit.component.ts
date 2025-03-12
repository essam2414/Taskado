import { Component, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { DataUtils } from 'app/core/util/data-util.service';
import { IHabit } from '../habit.model';
import { EntityArrayResponseType, HabitService } from '../service/habit.service';
import { HabitDeleteDialogComponent } from '../delete/habit-delete-dialog.component';
import dayjs from 'dayjs';

@Component({
  standalone: true,
  selector: 'jhi-habit',
  templateUrl: './habit.component.html',
  styleUrls: ['../habit.component.scss'],
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
export class HabitComponent implements OnInit {
  subscription: Subscription | null = null;
  habits?: IHabit[];
  isLoading = false;

  progressPercentage = 0;

  // NEW: Whether to hide completed habits
  showOnlyIncomplete = false;

  currentWeekStart: dayjs.Dayjs = dayjs().startOf('week').add(1, 'day');
  daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  sortState = sortStateSignal({});

  public readonly router = inject(Router);
  protected readonly habitService = inject(HabitService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected dataUtils = inject(DataUtils);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (item: IHabit): number => this.habitService.getHabitIdentifier(item);

  trackByHabitId(index: number, habit: IHabit): number {
    return habit.id;
  }

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.habits || this.habits.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(habit: IHabit): void {
    const modalRef = this.modalService.open(HabitDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.habit = habit;
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

  toggleDayCompleted(habit: IHabit, date: string): void {
    let completions: string[] = [];
    if (habit.completedDates) {
      try {
        completions = JSON.parse(habit.completedDates);
      } catch (e) {
        completions = [];
      }
    }

    if (completions.includes(date)) {
      completions = completions.filter(d => d !== date);
    } else {
      completions.push(date);
    }

    habit.completedDates = JSON.stringify(completions);
    habit.streak = completions.length;
    this.habitService.update(habit).subscribe(() => {
      this.habits = [...(this.habits ?? [])];
      this.calculateProgress();
    });
  }

  markAllForHabit(habit: IHabit): void {
    const weekDates = this.getCurrentWeekDates();
    let completions: string[] = [];
    if (habit.completedDates) {
      try {
        completions = JSON.parse(habit.completedDates);
      } catch (e) {
        completions = [];
      }
    }

    const allComplete = weekDates.every(d => completions.includes(d));
    if (allComplete) {
      // Unmark all
      completions = completions.filter(d => !weekDates.includes(d));
    } else {
      // Mark all
      for (const day of weekDates) {
        if (!completions.includes(day)) {
          completions.push(day);
        }
      }
    }

    habit.completedDates = JSON.stringify(completions);
    habit.streak = completions.length;

    this.habitService.update(habit).subscribe(() => {
      this.habits = [...(this.habits ?? [])];
      this.calculateProgress();
    });
  }

  isDateCompleted(habit: IHabit, date: string): boolean {
    if (!habit.completedDates) {
      return false;
    }
    try {
      const completions: string[] = JSON.parse(habit.completedDates);
      return completions.includes(date);
    } catch (e) {
      return false;
    }
  }

  editHabit(habit: IHabit): void {
    this.router.navigate(['/habit', habit.id, 'edit']);
  }

  getCurrentWeekDates(): string[] {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      dates.push(this.currentWeekStart.add(i, 'day').format('YYYY-MM-DD'));
    }
    return dates;
  }

  previousWeek(): void {
    this.currentWeekStart = this.currentWeekStart.subtract(7, 'day');
    this.calculateProgress();
  }

  nextWeek(): void {
    this.currentWeekStart = this.currentWeekStart.add(7, 'day');
    this.calculateProgress();
  }

  calculateProgress(): void {
    if (!this.habits || this.habits.length === 0) {
      this.progressPercentage = 0;
      return;
    }
    const weekDates = this.getCurrentWeekDates();
    const totalDays = this.habits.length * weekDates.length;
    let completedDays = 0;

    this.habits.forEach(habit => {
      let completions: string[] = [];
      if (habit.completedDates) {
        try {
          completions = JSON.parse(habit.completedDates);
        } catch (e) {
          completions = [];
        }
      }
      weekDates.forEach(date => {
        if (completions.includes(date)) {
          completedDays++;
        }
      });
    });

    this.progressPercentage = Math.round((completedDays / totalDays) * 100);
  }

  /**
   * NEW: Return only the habits we want to show (based on showOnlyIncomplete).
   */
  filteredHabits(): IHabit[] {
    if (!this.habits) {
      return [];
    }
    if (!this.showOnlyIncomplete) {
      // If not filtering, show them all
      return this.habits;
    }

    // Show only habits that are NOT fully completed for the current week
    const weekDates = this.getCurrentWeekDates();
    return this.habits.filter(habit => {
      let completions: string[] = [];
      if (habit.completedDates) {
        try {
          completions = JSON.parse(habit.completedDates);
        } catch (e) {
          completions = [];
        }
      }
      // If every day in the current week is included, it's fully complete
      const allComplete = weekDates.every(d => completions.includes(d));
      // Return only habits that are NOT fully complete
      return !allComplete;
    });
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    dataFromBody.forEach(habit => {
      if (!habit.completedDates) {
        habit.completedDates = JSON.stringify([]);
      }
      try {
        const completions: string[] = JSON.parse(habit.completedDates);
        habit.streak = completions.length;
      } catch (e) {
        habit.streak = 0;
      }
    });
    this.habits = this.refineData(dataFromBody);
    this.calculateProgress();
  }

  protected refineData(data: IHabit[]): IHabit[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IHabit[] | null): IHabit[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.habitService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
