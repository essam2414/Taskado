import { Component, HostListener, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { ITask } from '../task.model';
import { EntityArrayResponseType, TaskService } from '../service/task.service';
import { TaskDeleteDialogComponent } from '../delete/task-delete-dialog.component';
import dayjs from 'dayjs/esm';

@Component({
  standalone: true,
  selector: 'jhi-task',
  templateUrl: './task.component.html',
  styleUrls: ['../task.scss'],
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
export class TaskComponent implements OnInit {
  subscription: Subscription | null = null;
  tasks?: ITask[];
  isLoading = false;
  newTaskTitle = '';

  activeFilter = 'inbox';
  filters = [
    { label: 'Inbox', value: 'inbox', icon: 'inbox' },
    { label: 'Today', value: 'today', icon: 'calendar-day' },
    { label: 'Completed', value: 'completed', icon: 'circle-check' },
  ];

  sortState = sortStateSignal({});
  openMenuTaskId: number | null = null;

  public readonly router = inject(Router);
  protected readonly taskService = inject(TaskService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (item: ITask): number => this.taskService.getTaskIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.tasks || this.tasks.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  setFilter(selectedFilter: string): void {
    this.activeFilter = selectedFilter;
  }

  getFilteredTasks(): ITask[] {
    if (!this.tasks) return [];

    if (this.activeFilter === 'today') {
      return this.tasks.filter(task => task.dueDate && dayjs(task.dueDate).isSame(dayjs(), 'day') && !task.completed);
    }
    if (this.activeFilter === 'completed') {
      return this.tasks.filter(task => task.completed);
    }
    return this.tasks.filter(task => !task.completed);
  }

  get activeFilterLabel(): string {
    return this.filters.find(f => f.value === this.activeFilter)?.label ?? '';
  }

  delete(task: ITask): void {
    const modalRef = this.modalService.open(TaskDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.task = task;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  toggleCompleted(task: ITask): void {
    task.completed = !task.completed;
    this.taskService.update(task).subscribe(() => {
      this.tasks = this.refineData([...(this.tasks ?? [])]);
    });
  }

  toggleMenu(taskId: number): void {
    this.openMenuTaskId = this.openMenuTaskId === taskId ? null : taskId;
  }

  @HostListener('document:click', ['$event'])
  closeMenu(event: Event): void {
    const clickedInside = (event.target as HTMLElement).closest('.task-menu');
    if (!clickedInside) {
      this.openMenuTaskId = null; // Close menu
    }
  }

  formatTaskDate(dueDate: dayjs.Dayjs | string | null | undefined): string {
    if (!dueDate) return '';
    const date = dayjs(dueDate);
    const now = dayjs();
    const isNextYear = date.year() > now.year();
    return date.format(`D MMM${isNextYear ? ' YYYY' : ''} HH:mm`);
  }

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.router.navigate(['/task/new'], { queryParams: { title: this.newTaskTitle } });
    }
  }

  editTask(task: ITask): void {
    this.router.navigate(['/task', task.id, 'edit']);
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
    this.tasks = this.refineData(dataFromBody);
  }

  protected refineData(data: ITask[]): ITask[] {
    const { predicate, order } = this.sortState();
    let sortedData = predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
    sortedData = sortedData.sort((a, b) => Number(a.completed) - Number(b.completed));
    return sortedData;
  }

  protected fillComponentAttributesFromResponseBody(data: ITask[] | null): ITask[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.taskService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
