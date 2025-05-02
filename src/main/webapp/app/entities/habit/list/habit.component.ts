import { Component, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
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
  imports: [RouterModule, FormsModule, SharedModule, SortDirective, SortByDirective],
})
export class HabitComponent implements OnInit {
  subscription: Subscription | null = null;
  habits?: IHabit[];
  isLoading = false;
  dayjs = dayjs;

  dailyCompleted = 0;
  dailyTotal = 0;
  weeklyCompleted = 0;
  weeklyTotal = 0;
  dailyProgressPercentage = 0;
  weeklyProgressPercentage = 0;

  currentWeekStart: dayjs.Dayjs = dayjs().startOf('week').add(1, 'day');
  daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  currentView: 'day' | 'week' = 'day';

  visibleDays: string[] = [];
  visibleWeekStart: dayjs.Dayjs = dayjs().startOf('week').add(1, 'day');
  todayWeekStart: dayjs.Dayjs = dayjs().startOf('week').add(1, 'day');
  selectedDay: dayjs.Dayjs = dayjs();

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

  scrollDays(direction: 'left' | 'right'): void {
    this.visibleWeekStart = direction === 'left' ? this.visibleWeekStart.subtract(1, 'day') : this.visibleWeekStart.add(1, 'day');
  }

  getVisibleDays(): string[] {
    return Array.from({ length: 7 }, (_, i) => this.visibleWeekStart.add(i, 'day').format('YYYY-MM-DD'));
  }

  selectDay(date: string): void {
    this.selectedDay = dayjs(date);
  }

  isSelectedDay(date: string): boolean {
    return this.selectedDay.isSame(dayjs(date), 'day');
  }

  isFutureDate(date: string): boolean {
    return dayjs(date).isAfter(dayjs(), 'day');
  }

  getProgressRingStyle(habit: IHabit): string {
    let percentage = 0;

    if (!habit.repeatTimes || habit.repeatTimes === '1') {
      percentage = this.isDateCompleted(habit, this.selectedDay.format('YYYY-MM-DD')) ? 100 : 0;
    } else {
      const progress = this.getHabitProgress(habit);
      const total = +habit.repeatTimes;
      percentage = Math.min((progress / total) * 100, 100);
    }

    return `conic-gradient(var(--accent-color, #4f46e5) ${percentage * 3.6}deg, var(--bg-color, #e6e6e6) 0deg)`;
  }

  getHabitProgress(habit: IHabit): number {
    const completions = this.getCompletedDates(habit);
    return completions.filter(date => date === this.selectedDay.format('YYYY-MM-DD')).length;
  }

  isHabitCompletedToday(habit: IHabit): boolean {
    if (!habit.repeatTimes || habit.repeatTimes === '1') {
      return this.isDateCompleted(habit, this.selectedDay.format('YYYY-MM-DD'));
    } else {
      return this.getHabitProgress(habit) >= +habit.repeatTimes;
    }
  }

  isHabitEmpty(habit: IHabit): boolean {
    if (!habit.repeatTimes || habit.repeatTimes === '1') {
      return !this.isDateCompleted(habit, this.selectedDay.format('YYYY-MM-DD'));
    } else {
      return this.getHabitProgress(habit) === 0;
    }
  }

  handleMultiProgress(habit: IHabit): void {
    let completions = this.getCompletedDates(habit);
    const today = this.selectedDay.format('YYYY-MM-DD');
    const progress = completions.filter(date => date === today).length;
    const target = +habit.repeatTimes!;

    if (progress >= target) {
      completions = completions.filter(date => date !== today);
    } else {
      completions.push(today);
    }

    habit.completedDates = JSON.stringify(completions);
    habit.streak = this.calculateHabitStreak(habit);

    this.habitService.update(habit).subscribe(() => {
      this.habits = [...(this.habits ?? [])];
    });
  }

  getHabitsForDay(): IHabit[] {
    const filteredHabits: IHabit[] = [];

    this.habits?.forEach(habit => {
      if (!habit.repeatType || !habit.startDate) return;

      const startDate = habit.startDate.startOf('day');
      if (this.selectedDay.isBefore(startDate)) return;

      if (habit.repeatType === 'daily') {
        filteredHabits.push(habit);
      } else if (habit.repeatType === 'weekly' && habit.repeatDays) {
        const targetWeekDay = this.selectedDay.format('ddd');
        const repeatDays = habit.repeatDays.split(',');

        if (repeatDays.includes(targetWeekDay)) {
          filteredHabits.push(habit);
        }
      } else if (habit.repeatType === 'custom' && habit.repeatInterval) {
        const diffDays = this.selectedDay.diff(startDate, 'day');
        if (diffDays % habit.repeatInterval === 0) {
          filteredHabits.push(habit);
        }
      }
    });

    return filteredHabits;
  }

  calculateHabitStreak(habit: IHabit): number {
    const completions = this.getCompletedDates(habit);
    let streak = 0;
    let currentDate = dayjs().startOf('day'); // today

    while (completions.includes(currentDate.format('YYYY-MM-DD'))) {
      streak++;
      currentDate = currentDate.subtract(1, 'day');
    }

    return streak;
  }

  isToday(date: string): boolean {
    return dayjs(date).isSame(dayjs(), 'day');
  }

  getCompletedDates(habit: IHabit): string[] {
    if (!habit.completedDates) return [];

    return JSON.parse(habit.completedDates) as string[];
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

    const progress = completions.filter(d => d === date).length;
    const target = habit.repeatTimes ? +habit.repeatTimes : 1;

    if (progress >= target) {
      completions = completions.filter(d => d !== date);
    } else {
      const needed = target - progress;
      for (let i = 0; i < needed; i++) {
        completions.push(date);
      }
    }

    habit.completedDates = JSON.stringify(completions);
    habit.streak = this.calculateHabitStreak(habit);

    this.habitService.update(habit).subscribe(() => {
      this.habits = [...(this.habits ?? [])];
      this.calculateProgress();
    });
  }

  isWeekCompleted(habit: IHabit): boolean {
    const completions = this.getCompletedDates(habit);

    const pastAndTodayDates = this.getCurrentWeekDates().filter(date => {
      return !dayjs(date).isAfter(dayjs(), 'day');
    });

    return pastAndTodayDates.every(date => completions.includes(date));
  }

  markAllForHabit(habit: IHabit): void {
    const weekDates = this.getCurrentWeekDates();
    let completions = this.getCompletedDates(habit);

    if (this.isWeekCompleted(habit)) {
      completions = completions.filter(d => !weekDates.includes(d));
    } else {
      for (const day of weekDates) {
        if (!completions.includes(day) && !this.isFutureDate(day)) {
          completions.push(day);
        }
      }
    }

    habit.completedDates = JSON.stringify(completions);
    habit.streak = this.calculateHabitStreak(habit);

    this.habitService.update(habit).subscribe(() => {
      this.habits = [...(this.habits ?? [])];
      this.calculateProgress();
    });
  }

  isDateCompleted(habit: IHabit, date: string): boolean {
    if (!habit.completedDates) {
      return false;
    }

    const completions = this.getCompletedDates(habit);

    if (!habit.repeatTimes || habit.repeatTimes === '1') {
      return completions.includes(date);
    } else {
      const completedToday = completions.filter(d => d === date).length;
      return completedToday >= +habit.repeatTimes;
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
      this.resetProgress();
      return;
    }

    const today = this.selectedDay.format('YYYY-MM-DD');
    const weekDates = this.getDatesForWeek(this.todayWeekStart);

    let dailyCompleted = 0,
      dailyTotal = 0;
    let weeklyCompleted = 0,
      weeklyTotal = 0;

    this.habits.forEach(habit => {
      let completions: string[] = [];
      if (habit.completedDates) {
        try {
          completions = JSON.parse(habit.completedDates);
        } catch (e) {
          completions = [];
        }
      }

      if (this.shouldHabitAppearToday(habit)) {
        dailyTotal++;
        const progress = this.getHabitProgress(habit);
        const target = habit.repeatTimes ? +habit.repeatTimes : 1;
        if (progress >= target) {
          dailyCompleted++;
        }
      }

      weekDates.forEach(date => {
        if (this.shouldHabitAppearOnDate(habit, date)) {
          weeklyTotal++;
          if (completions.includes(date)) {
            weeklyCompleted++;
          }
        }
      });
    });

    this.dailyCompleted = dailyCompleted;
    this.dailyTotal = dailyTotal;
    this.weeklyCompleted = weeklyCompleted;
    this.weeklyTotal = weeklyTotal;
    this.dailyProgressPercentage = dailyTotal > 0 ? Math.round((dailyCompleted / dailyTotal) * 100) : 0;
    this.weeklyProgressPercentage = weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0;
  }

  getDatesForWeek(startOfWeek: dayjs.Dayjs): string[] {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      dates.push(startOfWeek.add(i, 'day').format('YYYY-MM-DD'));
    }
    return dates;
  }

  getProgressRing(percentage: number): string {
    return `conic-gradient(var(--accent-color, #4f46e5) ${percentage * 3.6}deg, var(--bg-color, #e6e6e6) 0deg)`;
  }

  shouldHabitAppearToday(habit: IHabit): boolean {
    if (!habit.repeatType || !habit.startDate) return false;

    const startDate = habit.startDate.startOf('day');
    if (this.selectedDay.isBefore(startDate)) return false;

    if (habit.repeatType === 'daily') {
      return true;
    } else if (habit.repeatType === 'weekly' && habit.repeatDays) {
      const targetWeekDay = this.selectedDay.format('ddd');
      const repeatDays = habit.repeatDays.split(',');
      return repeatDays.includes(targetWeekDay);
    } else if (habit.repeatType === 'custom' && habit.repeatInterval) {
      const diffDays = this.selectedDay.diff(startDate, 'day');
      return diffDays % habit.repeatInterval === 0;
    }

    return false;
  }

  shouldHabitAppearOnDate(habit: IHabit, date: string): boolean {
    if (!habit.repeatType || !habit.startDate) return false;

    const startDate = habit.startDate.startOf('day');
    const targetDate = dayjs(date);

    if (targetDate.isBefore(startDate)) return false;

    if (habit.repeatType === 'daily') {
      return true;
    } else if (habit.repeatType === 'weekly' && habit.repeatDays) {
      const targetWeekDay = targetDate.format('ddd');
      const repeatDays = habit.repeatDays.split(',');
      return repeatDays.includes(targetWeekDay);
    } else if (habit.repeatType === 'custom' && habit.repeatInterval) {
      const diffDays = targetDate.diff(startDate, 'day');
      return diffDays % habit.repeatInterval === 0;
    }

    return false;
  }

  resetProgress(): void {
    this.dailyCompleted = 0;
    this.dailyTotal = 0;
    this.weeklyCompleted = 0;
    this.weeklyTotal = 0;
    this.dailyProgressPercentage = 0;
    this.weeklyProgressPercentage = 0;
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
        habit.streak = this.calculateHabitStreak(habit);
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
