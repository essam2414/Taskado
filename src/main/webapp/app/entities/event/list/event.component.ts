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
import dayjs from 'dayjs';
import { CommonModule } from '@angular/common';

// for frontend to display events in calendar
interface CalendarEvent {
  date: string;
  title: string;
}

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
  ],
})
export class EventComponent implements OnInit, OnDestroy {
  selectedDate: Date | null = null;
  currentDate = new Date();
  daysInMonth = 0;
  firstDay = 0;
  calendarDays: (number | null)[] = [];
  subscription: Subscription | null = null;
  events?: IEvent[] = []; //
  isLoading = false;
  weekDays: { date: Date; events: CalendarEvent[] }[] = [];
  hours = Array.from({ length: 24 }, (_, i) => i);
  weekStartDate: Date = new Date();
  weekEndDate?: Date;
  sortState = sortStateSignal({});

  viewMode: 'day' | 'week' | 'month' = 'month'; // default month view

  public readonly router = inject(Router);
  protected readonly eventService = inject(EventService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (item: IEvent): number => this.eventService.getEventIdentifier(item);

  // generate the calendar for the next month
  renderCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.daysInMonth = new Date(year, month + 1, 0).getDate();
    this.firstDay = new Date(year, month, 1).getDay();

    // creates an array where the first few elements are empty (padding for first day)
    // then fills in the numbers 1 to `daysInMonth`
    this.calendarDays = [];

    // fill with empty days at the start of the month
    for (let i = 0; i < this.firstDay; i++) {
      this.calendarDays.push(null); // Empty spots before 1st day of the month
    }

    // fill with actual day numbers (1 to 31 or less)
    for (let i = 1; i <= this.daysInMonth; i++) {
      this.calendarDays.push(i);
    }
  }

  // function to change the month
  changeMonth(step: number): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + step, 1);
    this.renderCalendar();
  }

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([queryParams, data]) => {
          this.fillComponentAttributeFromRoute(queryParams, data);

          // Check for 'date' query parameter and set it as selected date if available
          if (queryParams.has('date')) {
            this.selectedDate = new Date(queryParams.get('date')!); // Set selected date from query params
          } else {
            this.selectedDate = new Date(); // Default to today's date
          }

          if (!this.events || this.events.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();

    // when switching to day view the date from selected day is used in the add event
    this.activatedRoute.queryParamMap.subscribe(params => {
      const dateParam = params.get('date');
      this.selectedDate = dateParam ? new Date(dateParam) : new Date(); // Use selected date or default to today
    });

    this.initializeWeekView();
    this.renderCalendar(); // Render the calendar after initializing
    this.loadEvents(); // events show up on calendar
    window.addEventListener('resize', this.adjustCalendarSize);
    this.adjustCalendarSize();
  }

  adjustCalendarSize = (): void => {
    const calendarContainer = document.querySelector('.calendar-container') as HTMLElement;
    const screenWidth = window.innerWidth;
    calendarContainer.style.gridTemplateColumns = screenWidth < 768 ? 'repeat(3, 1fr)' : 'repeat(7, 1fr)'; // Adjust layout based on screen size
  };

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.adjustCalendarSize);
  }

  delete(event: IEvent): void {
    const modalRef = this.modalService.open(EventDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.event = event;
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

  // add selected date functionality
  // when a user clicks on a date in the calendar a create form is opened
  selectDate(day: number): void {
    if (!day) return;

    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();
    this.selectedDate = new Date(year, month, day);

    // If in month view, switch to day view when clicking on a date
    if (this.viewMode === 'month') {
      this.viewMode = 'day';
    }
  }

  setView(mode: 'day' | 'week' | 'month'): void {
    this.viewMode = mode;
    if (mode === 'week') {
      this.renderWeekView();
    } else if (mode === 'day') {
      this.currentDate = new Date();
    }
  }

  renderWeekView(): void {
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay()); // Start on Sunday

    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      this.weekDays.push({
        date,
        events: this.getEventsForDay(date.getDate()),
      });
    }
  }

  initializeWeekView(): void {
    this.weekStartDate = this.getStartOfWeek(new Date());
    this.updateWeekDays();
  }

  getStartOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    return new Date(start.setDate(diff));
  }

  updateWeekDays(): void {
    this.weekDays = [];
    this.weekEndDate = new Date(this.weekStartDate);
    this.weekEndDate.setDate(this.weekStartDate.getDate() + 6);
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(this.weekStartDate);
      currentDate.setDate(this.weekStartDate.getDate() + i);

      this.weekDays.push({
        date: currentDate,
        events: this.getEventsForDay(currentDate.getDate()),
      });
    }
  }

  changeWeek(direction: number): void {
    this.weekStartDate.setDate(this.weekStartDate.getDate() + direction * 7);
    this.updateWeekDays();
  }

  isToday(day: number | null): boolean {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() && this.currentDate.getMonth() === today.getMonth() && this.currentDate.getFullYear() === today.getFullYear()
    );
  }

  getEventsForDay(day: number | null | undefined): CalendarEvent[] {
    if (day === null || day === undefined || !this.events) return [];
    const dateStr = dayjs(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day)).format('YYYY-MM-DD');

    return this.events
      .filter(event => dayjs(event.eventDate).format('YYYY-MM-DD') === dateStr)
      .map(event => ({
        date: dayjs(event.eventDate).format('YYYY-MM-DD'),
        title: event.title ?? 'Untitled Event',
      }));
  }

  changeDay(direction: number): void {
    if (this.selectedDate) {
      this.selectedDate = new Date(this.selectedDate);
      this.selectedDate.setDate(this.selectedDate.getDate() + direction);
    }
  }

  getEventsForHour(hour: number, date: Date): CalendarEvent[] {
    return (
      this.events
        ?.filter(event => {
          if (!event.startTime) return false;

          const eventDate = dayjs(event.startTime).toDate();

          return (
            eventDate.getFullYear() === date.getFullYear() &&
            eventDate.getMonth() === date.getMonth() &&
            eventDate.getDate() === date.getDate() &&
            eventDate.getHours() === hour
          );
        })
        .map(event => ({
          date: dayjs(event.startTime).format('YYYY-MM-DD'),
          title: event.title ?? 'Untitled Event',
        })) ?? []
    );
  }

  loadEvents(): void {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      this.events = JSON.parse(savedEvents);
    }
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
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.eventService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
