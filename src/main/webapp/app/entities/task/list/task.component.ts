import { Component, HostListener, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { ITask } from '../task.model';
import { EntityArrayResponseType, TaskService } from '../service/task.service';
import { TaskDeleteDialogComponent } from '../delete/task-delete-dialog.component';
import dayjs from 'dayjs/esm';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ISection, NewSection } from 'app/entities/section/section.model';
import { SectionService } from 'app/entities/section/service/section.service';
import { SectionDeleteDialogComponent } from 'app/entities/section/delete/section-delete-dialog.component';
import { TaskModalComponent } from '../modal/task-modal.component';

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
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
  ],
})
export class TaskComponent implements OnInit {
  subscription: Subscription | null = null;
  tasks: ITask[] = [];
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

  settingsOpen = false;
  filtersOpen = false;
  sections: ISection[] = [];
  collapsedSections: Record<number, boolean> = {};

  editingSectionId: number | null = null;
  originalSectionName = '';

  unsectionedTasks: ITask[] = [];
  sectionsMap: Record<number, ITask[]> = {};

  public readonly router = inject(Router);
  protected readonly taskService = inject(TaskService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected sectionService = inject(SectionService);
  protected ngZone = inject(NgZone);

  trackId = (item: ITask): number => this.taskService.getTaskIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (this.tasks.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  drop(event: CdkDragDrop<ITask[]>, targetSection: ISection | null): void {
    const draggedTask = event.item.data as ITask;

    const previousArray = draggedTask.section?.id ? this.sectionsMap[draggedTask.section.id] : this.unsectionedTasks;
    const targetArray = targetSection?.id ? this.sectionsMap[targetSection.id] : this.unsectionedTasks;

    if (event.previousContainer === event.container) {
      if (event.currentIndex === event.previousIndex) return;
      moveItemInArray(targetArray, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(previousArray, targetArray, event.previousIndex, event.currentIndex);

      draggedTask.section = targetSection ? targetSection : null;
    }

    const updatedTasks = [...previousArray, ...targetArray].map((task, idx) => ({
      ...task,
      order: idx + 1,
    }));

    updatedTasks.forEach(task => this.taskService.update(task).subscribe());
  }

  setFilter(selectedFilter: string): void {
    this.activeFilter = selectedFilter;
  }

  get activeFilterLabel(): string {
    return this.filters.find(f => f.value === this.activeFilter)?.label ?? '';
  }

  get activeFilterIcon(): string {
    return this.filters.find(f => f.value === this.activeFilter)?.icon ?? 'filter';
  }

  shouldHideTask(task: ITask): boolean {
    if (this.activeFilter === 'today') {
      const isToday = task.dueDate && dayjs(task.dueDate).isSame(dayjs(), 'day');
      return !(isToday && !task.completed);
    }
    if (this.activeFilter === 'completed') {
      return !task.completed;
    }
    if (this.activeFilter === 'inbox') {
      return !!task.completed;
    }

    return false;
  }

  toggleSection(section: ISection): void {
    this.collapsedSections[section.id] = !this.collapsedSections[section.id];
  }

  addSection(): void {
    const newSection: NewSection = { id: null, name: 'New Section' };

    this.sectionService.create(newSection).subscribe({
      next: (res: HttpResponse<ISection>) => {
        const created = res.body;
        if (created) {
          this.sections.push({
            ...created,
          });
          this.buildSectionsMap();

          setTimeout(() => {
            const sectionElements = document.querySelectorAll('.section-header');
            const lastSection = sectionElements[sectionElements.length - 1] as HTMLElement;
            lastSection.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      },
    });
    this.settingsOpen = false;
  }

  startEditing(section: ISection): void {
    this.editingSectionId = section.id;
    this.originalSectionName = section.name ?? '';
  }

  stopEditing(): void {
    if (this.editingSectionId !== null) {
      const section = this.sections.find(s => s.id === this.editingSectionId);
      if (section) {
        this.saveSection(section);
      }
    }
  }

  saveSection(section: ISection, event?: Event): void {
    if (event) {
      (event.target as HTMLInputElement).blur();
    }

    if (!section.name?.trim()) {
      section.name = this.originalSectionName;
      return;
    }

    if (section.name === this.originalSectionName) {
      this.editingSectionId = null;
      return;
    }

    this.sectionService.update(section).subscribe(() => {
      this.editingSectionId = null;
    });
  }

  cancelEdit(section: ISection): void {
    section.name = this.originalSectionName;
    this.editingSectionId = null;
  }

  loadSections(): void {
    this.sectionService.query().subscribe({
      next: (res: HttpResponse<ISection[]>) => {
        this.sections = res.body ?? [];
        this.buildSectionsMap();
      },
    });
  }

  toggleCompleted(task: ITask): void {
    task.completed = !task.completed;
    this.taskService.update(task).subscribe(() => {
      this.tasks = this.refineData([...this.tasks]);
    });
  }

  toggleMenu(taskId: number): void {
    this.openMenuTaskId = this.openMenuTaskId === taskId ? null : taskId;
  }

  toggleSettings(): void {
    this.settingsOpen = !this.settingsOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdowns(event: Event): void {
    const clickedInsideSettings = (event.target as HTMLElement).closest('.task-settings');
    const clickedInsideMenu = (event.target as HTMLElement).closest('.task-dropdown');

    if (!clickedInsideSettings) {
      this.settingsOpen = false;
    }

    if (!clickedInsideMenu) {
      this.openMenuTaskId = null; // Close task-specific dropdown
    }
  }

  formatTaskDate(dueDate: dayjs.Dayjs | string | null | undefined): string {
    if (!dueDate) return '';

    const date = dayjs(dueDate);
    const now = dayjs();

    if (date.isSame(now, 'day')) {
      return 'Today ' + date.format('HH:mm');
    } else if (date.isSame(now.add(1, 'day'), 'day')) {
      return 'Tomorrow ' + date.format('HH:mm');
    } else if (date.isAfter(now) && date.diff(now, 'days') < 6) {
      return date.format('dddd HH:mm'); // ✅ Fixed: Removed unnecessary template literal
    }

    const isNextYear = date.year() > now.year();
    return date.format(`D MMM${isNextYear ? ' YYYY' : ''} HH:mm`);
  }

  isTaskPast(dueDate: dayjs.Dayjs | string | null | undefined): boolean {
    if (!dueDate) return false;
    return dayjs(dueDate).isBefore(dayjs(), 'minute');
  }

  addTask(title?: string): void {
    const taskTitle = title?.trim() ?? ''; // Use provided title or empty string

    const modalRef = this.modalService.open(TaskModalComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.task = { title: taskTitle, completed: false } as ITask;

    modalRef.closed.subscribe(result => {
      console.warn(result);
      if (result) {
        this.tasks.push(result);
        this.newTaskTitle = ''; // Clear input field after adding from bottom input
        this.buildSectionsMap();
      }
    });
  }

  editTask(task: ITask): void {
    const modalRef = this.modalService.open(TaskModalComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.task = { ...task };

    modalRef.closed.subscribe(result => {
      if (result) {
        const index = this.tasks.findIndex(t => t.id === result.id);
        if (index !== -1) {
          this.tasks[index] = result;
        }
      }
    });
  }

  buildSectionsMap(): void {
    this.unsectionedTasks = [];
    this.sectionsMap = {};

    for (const section of this.sections) {
      this.sectionsMap[section.id] = [];
    }

    for (const task of this.tasks) {
      if (!task.section?.id) {
        this.unsectionedTasks.push(task);
      } else {
        this.sectionsMap[task.section.id].push(task);
      }
    }
  }

  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
        this.loadSections();
      },
    });
  }

  delete(task: ITask): void {
    const modalRef = this.modalService.open(TaskDeleteDialogComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.task = task;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  deleteSection(section: ISection): void {
    const taskCount = this.sectionsMap[section.id].length;

    const modalRef = this.modalService.open(SectionDeleteDialogComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.section = section;
    modalRef.componentInstance.taskCount = taskCount;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  toggleFilters(): void {
    this.filtersOpen = !this.filtersOpen;
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
    const sortedData = data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

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
