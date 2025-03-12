import { Component, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { INotification } from '../notification.model';
import { EntityArrayResponseType, NotificationService } from '../service/notification.service';
import { NotificationDeleteDialogComponent } from '../delete/notification-delete-dialog.component';
import dayjs, { Dayjs } from 'dayjs';

@Component({
  standalone: true,
  selector: 'jhi-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['../notification.component.scss'],
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
export class NotificationComponent implements OnInit {
  subscription: Subscription | null = null;
  notifications?: INotification[];
  isLoading = false;

  sortState = sortStateSignal({});

  activeFilter = 'all';
  selectedNotification: any = null;

  notificationIcons: Record<'REMINDER' | 'DEADLINE' | 'SYSTEM_UPDATE', string> = {
    REMINDER: 'bell',
    DEADLINE: 'calendar-day',
    SYSTEM_UPDATE: 'cogs',
  };

  public readonly router = inject(Router);
  protected readonly notificationService = inject(NotificationService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (item: INotification): number => this.notificationService.getNotificationIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.notifications || this.notifications.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(notification: INotification): void {
    const modalRef = this.modalService.open(NotificationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.notification = notification;
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

  viewNotification(notification: INotification): void {
    this.router.navigate(['notification', notification.id, 'view']);
  }

  setFilter(selectedFilter: string): void {
    this.activeFilter = selectedFilter;
  }

  getFilteredNotifications(): INotification[] {
    if (!this.notifications) return [];

    if (this.activeFilter === 'unread') {
      return this.notifications.filter(notification => !notification.read);
    }
    return this.notifications;
  }

  getUnreadCount(): number {
    return this.notifications ? this.notifications.filter(notification => !notification.read).length : 0;
  }

  markAsRead(notification: INotification): void {
    if (!notification.read) {
      notification.read = true;
      this.notificationService.update(notification).subscribe();
    }
  }

  markAsUnread(notification: any): void {
    notification.read = false;
    this.selectedNotification = null;

    this.notificationService.update(notification).subscribe();
  }

  markAllAsRead(): void {
    if (!this.notifications) return;

    const unreadNotifications = this.notifications.filter(n => !n.read);
    if (unreadNotifications.length === 0) return;

    unreadNotifications.forEach(notification => (notification.read = true));

    unreadNotifications.forEach(notification => {
      this.notificationService.update(notification).subscribe(() => {
        this.load();
      });
    });
  }

  getNotificationIcon(type: 'REMINDER' | 'DEADLINE' | 'SYSTEM_UPDATE' | null | undefined): string {
    return type ? this.notificationIcons[type] : 'question-circle';
  }

  getTimeAgo(timestamp?: string | null): string {
    if (!timestamp) {
      return 'Unknown time';
    }

    const notificationDate = dayjs(timestamp);

    if (!notificationDate.isValid()) {
      return 'Invalid date';
    }

    const now = dayjs();
    const diffInSeconds = now.diff(notificationDate, 'second');

    if (diffInSeconds < 60) {
      return 'Just now';
    }
    const diffInMinutes = now.diff(notificationDate, 'minute');
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    const diffInHours = now.diff(notificationDate, 'hour');
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    const diffInDays = now.diff(notificationDate, 'day');
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
  }

  openNotification(notification: any): void {
    this.selectedNotification = notification;
  }

  closeModal(): void {
    this.selectedNotification = null;
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.notifications = this.refineData(dataFromBody);
  }

  protected refineData(data: INotification[]): INotification[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: INotification[] | null): INotification[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.notificationService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
