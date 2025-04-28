import { Component, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { IReminder } from '../reminder.model';
import { EntityArrayResponseType, ReminderService } from '../service/reminder.service';
import { ReminderDeleteDialogComponent } from '../delete/reminder-delete-dialog.component';
import dayjs, { Dayjs } from 'dayjs';

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
  newReminder: Partial<IReminder> = {
    title: '',
    description: '',
    reminderDate: null,
    repeatType: '',
    repeatInterval: undefined,
    linkedEntityType: '',
    linkedEntityId: undefined,
  };

  activeFilter: 'search' | 'today' | 'scheduled' | 'all' | 'completed' | 'flagged' = 'all';

  sortState = sortStateSignal({});

  public readonly router = inject(Router);
  protected readonly reminderService = inject(ReminderService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId(index: number, item: IReminder): number {
    return this.reminderService.getReminderIdentifier(item);
  }

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          this.load();
        }),
      )
      .subscribe();
  }

  delete(reminder: IReminder): void {
    const modalRef = this.modalService.open(ReminderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.reminder = reminder;
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

  parseDate(dateValue: Dayjs | null | undefined): Dayjs | null {
    return dateValue ?? null;
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  onAddReminder(): void {
    if (!this.newReminder.title || !this.newReminder.reminderDate) return;

    const newItem: IReminder = {
      id: Math.floor(Math.random() * 100000),
      title: this.newReminder.title,
      description: this.newReminder.description ?? '',
      repeatType: this.newReminder.repeatType ?? '',
      repeatInterval: this.newReminder.repeatInterval,
      linkedEntityType: this.newReminder.linkedEntityType ?? '',
      linkedEntityId: this.newReminder.linkedEntityId,
    };

    this.reminders.push(newItem);
    this.filterReminders();
    this.newReminder = {
      title: '',
      description: '',
      reminderDate: null,
      repeatType: '',
      repeatInterval: undefined,
      linkedEntityType: '',
      linkedEntityId: undefined,
    };
    this.toggleAddForm();
  }

  setFilter(selectedFilter: typeof this.activeFilter): void {
    this.activeFilter = selectedFilter;
    this.filterReminders();
  }

  filterReminders(): void {
    const today = dayjs();
    this.filteredReminders = this.reminders.filter(r => {
      const date = dayjs(r.reminderDate);

      if (this.activeFilter === 'all') return true;
      if (this.activeFilter === 'search') return `${r.title} ${r.description ?? ''}`.toLowerCase().includes('test');
      if (this.activeFilter === 'today') return date.isSame(today, 'day');
      if (this.activeFilter === 'scheduled') return date.isAfter(today);
      return true;
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
    this.reminders = this.refineData(dataFromBody);
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
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.reminderService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
