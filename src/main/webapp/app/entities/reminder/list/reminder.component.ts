import { Component, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter as rxFilter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { IReminder, NewReminder } from '../reminder.model';
import { EntityArrayResponseType, ReminderService } from '../service/reminder.service';
import { ReminderDeleteDialogComponent } from '../delete/reminder-delete-dialog.component';
import dayjs from 'dayjs/esm';
import type { Dayjs } from 'dayjs/esm';

@Component({
  standalone: true,
  selector: 'jhi-reminder',
  templateUrl: './reminder.component.html',
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
export class ReminderComponent implements OnInit {
  subscription: Subscription | null = null;
  reminders: IReminder[] = [];
  filteredReminders: IReminder[] = [];
  isLoading = false;
  showAddForm = false;

  minDateTime = dayjs().format('YYYY-MM-DDTHH:mm');

  newReminder: {
    title: string;
    description: string | null;
    reminderDate: string | null;
  } = {
    title: '',
    description: null,
    reminderDate: null,
  };

  activeFilter: 'all' | 'today' = 'all';
  sortState = sortStateSignal({});

  public readonly router = inject(Router);
  protected readonly reminderService = inject(ReminderService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.queryBackend().subscribe({ next: res => this.onResponseSuccess(res) });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  onAddReminder(): void {
    if (!this.newReminder.title || !this.newReminder.reminderDate) return;

    const reminderToCreate: NewReminder = {
      id: null,
      title: this.newReminder.title,
      description: this.newReminder.description,
      reminderDate: dayjs(this.newReminder.reminderDate),
      repeatType: null,
      repeatInterval: null,
      linkedEntityType: null,
      linkedEntityId: null,
    };

    this.reminderService.create(reminderToCreate).subscribe({
      next: () => {
        this.newReminder = {
          title: '',
          description: null,
          reminderDate: null,
        };
        this.toggleAddForm();
        this.load();
      },
      error: err => console.error('❌ Failed to create reminder:', err),
    });
  }

  delete(reminder: IReminder): void {
    const modalRef = this.modalService.open(ReminderDeleteDialogComponent, {
      size: 'lg',
      backdrop: 'static',
    });
    modalRef.componentInstance.reminder = reminder;
    modalRef.closed
      .pipe(
        rxFilter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  setFilter(filter: typeof this.activeFilter): void {
    this.activeFilter = filter;
    this.filterReminders();
  }

  isToday(reminder: IReminder): boolean {
    return dayjs(reminder.reminderDate).isSame(dayjs(), 'day');
  }

  filterReminders(): void {
    const today = dayjs();
    const sorted = [...this.reminders].sort((a, b) => dayjs(a.reminderDate).diff(dayjs(b.reminderDate)));

    this.filteredReminders = this.activeFilter === 'today' ? sorted.filter(rem => dayjs(rem.reminderDate).isSame(today, 'day')) : sorted;
  }

  parseDate(value: Dayjs | null | undefined): Dayjs | null {
    return value ?? null;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const data = this.fillComponentAttributesFromResponseBody(response.body);
    this.reminders = this.refineData(data);
    this.filterReminders();
  }

  protected refineData(data: IReminder[]): IReminder[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IReminder[] | null): IReminder[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = { sort: this.sortService.buildSortParam(this.sortState()) };
    return this.reminderService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
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
