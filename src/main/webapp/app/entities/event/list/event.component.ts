import { Component, NgZone, OnInit, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { IEvent } from '../event.model';
import { EntityArrayResponseType, EventService } from '../service/event.service';
import { EventDeleteDialogComponent } from '../delete/event-delete-dialog.component';
import dayjs, { Dayjs } from 'dayjs/esm';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  standalone: true,
  selector: 'jhi-event',
  templateUrl: './event.component.html',
  styleUrls: ['../event.scss'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
  ],
})
export class EventComponent implements OnInit {
  selectedDate: Dayjs | null = null;
  currentDate = dayjs();
  daysInMonth = 0;
  firstDay = 0;
  calendarDays: (Dayjs | null)[] = [];
  subscription: Subscription | null = null;
  events: IEvent[] = [];
  isLoading = false;
  weekDays: { date: Dayjs; events: IEvent[] }[] = [];
  hours = Array.from({ length: 24 }, (_, i) => i);
  weekStartDate: Dayjs = dayjs();
  weekEndDate?: Dayjs;
  sortState = sortStateSignal({});
  viewsOpen = false;
  activeView = 'month';
  views = [
    { label: 'Month', value: 'month' },
    { label: 'Week', value: 'week' },
    { label: 'Day', value: 'day' },
  ];

  public readonly router = inject(Router);
  protected readonly eventService = inject(EventService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (item: IEvent): number => this.eventService.getEventIdentifier(item);

  renderCalendar(): void {
    const year = this.currentDate.year();
    const month = this.currentDate.month();

    this.daysInMonth = this.currentDate.daysInMonth();
    this.firstDay = dayjs(`${year}-${month + 1}-01`).day();

    this.calendarDays = [];
    for (let i = 0; i < this.firstDay; i++) this.calendarDays.push(null);
    for (let i = 1; i <= this.daysInMonth; i++) this.calendarDays.push(dayjs(`${year}-${month + 1}-${i}`));
  }

  changeMonth(step: number): void {
    this.currentDate = this.currentDate.add(step, 'month');
    this.renderCalendar();
  }

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([queryParams, data]) => {
          this.fillComponentAttributeFromRoute(queryParams, data);
          const dateParam = queryParams.get('date');
          this.selectedDate = dateParam ? dayjs(dateParam) : dayjs();
          this.load();
        }),
      )
      .subscribe();

    this.initializeWeekView();
    this.renderCalendar();
    this.load();
  }

  delete(event: IEvent): void {
    const modalRef = this.modalService.open(EventDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.event = event;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.queryBackend().subscribe({
      next: res => this.onResponseSuccess(res),
    });
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  selectDate(day: Dayjs): void {
    this.selectedDate = day;
    if (this.activeView === 'month') this.activeView = 'day';
  }

  toggleViews(): void {
    this.viewsOpen = !this.viewsOpen;
  }

  setView(selectedView: string): void {
    this.activeView = selectedView;
    if (selectedView === 'week') this.renderWeekView();
    else if (selectedView === 'day') this.currentDate = dayjs();
  }

  get activeViewLabel(): string {
    return this.views.find(f => f.value === this.activeView)?.label ?? '';
  }

  renderWeekView(): void {
    const startOfWeek = this.currentDate.startOf('week');
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = startOfWeek.add(i, 'day');
      this.weekDays.push({
        date,
        events: this.getEventsForDay(date),
      });
    }
  }

  initializeWeekView(): void {
    this.weekStartDate = this.getStartOfWeek(dayjs());
    this.updateWeekDays();
  }

  getStartOfWeek(date: Dayjs): Dayjs {
    const day = date.day();
    return date.subtract(day === 0 ? 6 : day - 1, 'day');
  }

  updateWeekDays(): void {
    this.weekDays = [];
    this.weekEndDate = this.weekStartDate.add(6, 'day');
    for (let i = 0; i < 7; i++) {
      const currentDate = this.weekStartDate.add(i, 'day');
      this.weekDays.push({
        date: currentDate,
        events: this.getEventsForDay(currentDate),
      });
    }
  }

  getFormattedCurrentMonth(): string {
    return this.currentDate.format('MMMM YYYY');
  }

  changeWeek(direction: number): void {
    this.weekStartDate = this.weekStartDate.add(direction * 7, 'day');
    this.updateWeekDays();
  }

  isToday(day: Dayjs | null): boolean {
    return day ? day.isSame(dayjs(), 'day') : false;
  }

  getEventsForDay(day: Dayjs | null): IEvent[] {
    return this.events.filter(event => dayjs(event.eventDate).isSame(day, 'day'));
  }

  changeDay(direction: number): void {
    if (this.selectedDate) this.selectedDate = this.selectedDate.add(direction, 'day');
  }

  getDayNumber(day: dayjs.Dayjs | null): number | null {
    return day ? day.date() : null;
  }

  getEventsForHour(hour: number, date: dayjs.Dayjs): IEvent[] {
    return this.events.filter(event => event.startTime?.isSame(date.hour(hour), 'hour'));
  }

  editEvent(event: IEvent): void {
    this.router.navigate(['/event', event.id, 'edit']);
  }

  drop(event: CdkDragDrop<IEvent[]>, targetDay: dayjs.Dayjs | null): void {
    if (!targetDay) return;

    const draggedEvent: IEvent = event.item.data;

    // Prevent unnecessary update
    const oldDate = dayjs(draggedEvent.eventDate).format('YYYY-MM-DD');
    const newDate = dayjs(targetDay).format('YYYY-MM-DD');
    if (oldDate === newDate) return;

    // Update the event's date
    draggedEvent.eventDate = targetDay;

    this.eventService.update(draggedEvent).subscribe(() => {
      this.load(); // Refresh the events after drop
    });
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.events = this.refineData(dataFromBody);
  }

  protected refineData(data: IEvent[]): IEvent[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IEvent[] | null): IEvent[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = { sort: this.sortService.buildSortParam(this.sortState()) };
    return this.eventService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(sortState: SortState): void {
    const queryParamsObj = { sort: this.sortService.buildSortParam(sortState) };
    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
