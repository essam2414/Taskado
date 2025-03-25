import { Component, HostListener, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap, combineLatest as combineLatestRx } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';

import SharedModule from 'app/shared/shared.module';
import { SortDirective, SortByDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { ITask, NewTask } from '../task.model';
import { EntityArrayResponseType, TaskService } from '../service/task.service';
import dayjs from 'dayjs/esm';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ISection, NewSection } from 'app/entities/section/section.model';
import { SectionService } from 'app/entities/section/service/section.service';
import { SectionDeleteDialogComponent } from 'app/entities/section/delete/section-delete-dialog.component';
import { TaskModalComponent } from '../modal/task-modal.component';
import { TaskDeleteDialogComponent } from '../delete/task-delete-dialog.component';
import { HttpHeaders } from '@angular/common/http';
import { AlertService } from 'app/core/util/alert.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';

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
  categories: ICategory[] = [];
  isLoading = false;
  newTaskTitle = '';

  filtersOpen = false;
  activeFilter = 'inbox';
  filters = [
    { label: 'Inbox', value: 'inbox', icon: 'inbox' },
    { label: 'Today', value: 'today', icon: 'calendar-day' },
    { label: 'Completed', value: 'completed', icon: 'circle-check' },
  ];
  filtersMap: Record<string, ITask[]> = {};

  unsectionedTasks: ITask[] = [];
  sectionsMap: Record<number, ITask[]> = {};
  sections: ISection[] = [];

  collapsedSections: Record<number, boolean> = {};
  editingSectionId: number | null = null;
  originalSectionName = '';

  sortState = sortStateSignal({});
  openMenuTaskId: number | null = null;
  settingsOpen = false;

  public readonly router = inject(Router);
  protected readonly taskService = inject(TaskService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected categoryService = inject(CategoryService);
  protected modalService = inject(NgbModal);
  protected sectionService = inject(SectionService);
  protected ngZone = inject(NgZone);
  private readonly alertService = inject(AlertService);

  trackId = (item: ITask): number => this.taskService.getTaskIdentifier(item);

  ngOnInit(): void {
    // Load tasks and sections when the component initializes.
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]))),
        tap(() => {
          if (this.tasks.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  /* ─────────────────────────────*
   *   Data Loading & Mapping    *
   *─────────────────────────────*/
  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        const dataFromBody = this.fillComponentAttributesFromResponseBody(res.body);
        this.tasks = this.refineData(dataFromBody);
        this.loadSections();
        this.loadCategories();
      },
    });
  }

  loadSections(): void {
    this.sectionService.query().subscribe({
      next: (res: HttpResponse<ISection[]>) => {
        this.sections = res.body ?? [];
        this.refreshTaskLayout();
      },
    });
  }

  loadCategories(): void {
    this.categoryService.query().subscribe({
      next: (res: HttpResponse<ICategory[]>) => {
        this.categories = res.body ?? [];

        for (const task of this.tasks) {
          if (task.category?.id) {
            const matched = this.categories.find(cat => cat.id === task.category?.id);
            if (matched) {
              task.category = matched;
            }
          }
        }

        this.refreshTaskLayout();
      },
    });
  }

  buildFiltersMap(): void {
    this.filtersMap = {};

    for (const f of this.filters) {
      this.filtersMap[f.value] = [];
    }

    for (const task of this.tasks) {
      const isToday = task.dueDate && dayjs(task.dueDate).isSame(dayjs(), 'day');
      if (task.completed) {
        this.filtersMap['completed'].push(task);
      } else {
        this.filtersMap['inbox'].push(task);

        if (isToday) {
          this.filtersMap['today'].push(task);
        }
      }
    }
  }

  buildSectionsMap(): void {
    // Reset our arrays.
    this.unsectionedTasks = [];
    this.sectionsMap = {};

    // Create an empty array for each section.
    for (const section of this.sections) {
      this.sectionsMap[section.id] = [];
    }

    // Distribute tasks: if task has a section, add it there; otherwise, add to unsectioned.
    for (const task of this.filteredTasks) {
      if (task.section?.id) {
        this.sectionsMap[task.section.id].push(task);
      } else {
        this.unsectionedTasks.push(task);
      }
    }
  }

  refreshTaskLayout(): void {
    this.buildFiltersMap();
    this.buildSectionsMap();
  }

  /* ─────────────────────────────*
   *       Drag & Drop Logic     *
   *─────────────────────────────*/
  drop(event: CdkDragDrop<ITask[]>, targetSection: ISection | null): void {
    // Retrieve the source and target arrays based on the container id.
    const sourceArray = this.getTaskArrayByContainerId(event.previousContainer.id);
    const targetArray = this.getTaskArrayByContainerId(event.container.id);

    if (event.previousContainer === event.container) {
      if (event.currentIndex === event.previousIndex) return;
      moveItemInArray(targetArray, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(sourceArray, targetArray, event.previousIndex, event.currentIndex);
      // Update the dragged task's section based on the target container.
      const draggedTask = event.item.data as ITask;
      draggedTask.section = targetSection ?? null;
    }

    // If the target container is unsectioned, ensure we update the unsectionedTasks array.
    if (event.container.id === 'unsectioned') {
      this.unsectionedTasks = targetArray;
    }

    // Update order for tasks in the target array.
    this.updateOrder(targetArray);

    const silentHeaders = new HttpHeaders({ 'X-Silent-Alert': 'true' });

    // Prepare update calls for each task in the target array.
    const updates = targetArray.map(task =>
      this.taskService['http'].put(`${this.taskService['resourceUrl']}/${task.id}`, task, {
        observe: 'response',
        headers: silentHeaders,
      }),
    );
    combineLatestRx(updates).subscribe(() => {
      this.load();
      this.alertService.addAlert({
        type: 'success',
        message: 'Tasks reordered successfully.',
        toast: true,
      });
    });
  }

  /* ─────────────────────────────*
   *        Filter Methods    *
   *─────────────────────────────*/
  get activeFilterLabel(): string {
    return this.filters.find(f => f.value === this.activeFilter)?.label ?? '';
  }

  get activeFilterIcon(): string {
    return this.filters.find(f => f.value === this.activeFilter)?.icon ?? 'filter';
  }

  get filteredTasks(): ITask[] {
    return this.filtersMap[this.activeFilter] ?? [];
  }

  setFilter(selectedFilter: string): void {
    this.activeFilter = selectedFilter;
    this.buildSectionsMap();
  }

  toggleFilters(): void {
    this.filtersOpen = !this.filtersOpen;
  }

  /* ─────────────────────────────*
   *  Section Editing Methods    *
   *─────────────────────────────*/
  startEditing(section: ISection): void {
    this.editingSectionId = section.id;
    this.originalSectionName = section.name ?? '';
  }

  stopEditing(): void {
    this.editingSectionId = null;
  }

  saveSection(section: ISection, event?: Event): void {
    if (event) {
      (event.target as HTMLInputElement).blur();
    }
    // Update the section using the service.
    this.sectionService.update(section).subscribe(() => {
      this.editingSectionId = null;
    });
  }

  cancelEdit(section: ISection): void {
    // Revert to the original name and cancel editing.
    section.name = this.originalSectionName;
    this.editingSectionId = null;
  }

  addSection(): void {
    const newSection: NewSection = { id: null, name: 'New Section' };
    this.sectionService.create(newSection).subscribe({
      next: (res: HttpResponse<ISection>) => {
        const created = res.body;
        if (created) {
          this.sections.push(created);
          this.buildSectionsMap();
          // Optionally scroll the new section into view.
          setTimeout(() => {
            const el = document.getElementById(`section-${created.id}`);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      },
    });
    this.settingsOpen = false;
  }

  deleteSection(section: ISection): void {
    const modalRef = this.modalService.open(SectionDeleteDialogComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.section = section;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  toggleSection(section: ISection): void {
    this.collapsedSections[section.id] = !this.collapsedSections[section.id];
  }

  /* ─────────────────────────────*
   *   Task CRUD Modal Methods   *
   *─────────────────────────────*/
  addTask(title?: string): void {
    const taskTitle = title?.trim() ?? '';
    const modalRef = this.modalService.open(TaskModalComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.task = { title: taskTitle, completed: false } as ITask;
    modalRef.closed.subscribe(result => {
      if (result) {
        this.tasks.push(result);
        this.newTaskTitle = '';
        this.refreshTaskLayout();
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
          this.refreshTaskLayout();
        }
      }
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

  /* ─────────────────────────────*
   *     Miscellaneous Methods   *
   *─────────────────────────────*/
  toggleCompleted(task: ITask): void {
    task.completed = !task.completed;
    this.taskService.update(task).subscribe(() => this.load());
  }

  toggleMenu(taskId: number): void {
    this.openMenuTaskId = this.openMenuTaskId === taskId ? null : taskId;
  }

  toggleSettings(): void {
    this.settingsOpen = !this.settingsOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdowns(event: Event): void {
    const insideSettings = (event.target as HTMLElement).closest('.task-settings');
    const insideMenu = (event.target as HTMLElement).closest('.task-dropdown');
    if (!insideSettings) {
      this.settingsOpen = false;
    }
    if (!insideMenu) {
      this.openMenuTaskId = null;
    }
  }

  formatTaskDate(dueDate: dayjs.Dayjs | string | null | undefined): string {
    if (!dueDate) return '';
    const date = dayjs(dueDate);
    const now = dayjs();
    if (date.isSame(now, 'day')) return 'Today ' + date.format('HH:mm');
    if (date.isSame(now.add(1, 'day'), 'day')) return 'Tomorrow ' + date.format('HH:mm');
    if (date.isAfter(now) && date.diff(now, 'days') < 6) return date.format('dddd HH:mm');
    const isNextYear = date.year() > now.year();
    return date.format(`D MMM${isNextYear ? ' YYYY' : ''} HH:mm`);
  }

  isTaskPast(dueDate: dayjs.Dayjs | string | null | undefined): boolean {
    if (!dueDate) return false;
    return dayjs(dueDate).isBefore(dayjs(), 'minute');
  }

  getCategoryStyle(category: ICategory | null): Record<string, string> {
    if (!category?.color) return {};
    return {
      color: category.color,
      'background-color': this.getCategoryBackground(category.color) ?? '',
    };
  }

  getCategoryBackground(color: string | null | undefined): string | null {
    if (!color) return null;
    const div = document.createElement('div');
    div.style.color = color;
    document.body.appendChild(div);
    const computedColor = getComputedStyle(div).color;
    document.body.removeChild(div);
    const match = computedColor.match(/rgba?\((\d+), (\d+), (\d+)/);
    if (!match) return null;
    const [_, r, g, b] = match;
    return `rgba(${r}, ${g}, ${b}, 0.18)`;
  }

  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return null;
    let c = hex.substring(1).split('');
    if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    const r = parseInt(c[0] + c[1], 16);
    const g = parseInt(c[2] + c[3], 16);
    const b = parseInt(c[4] + c[5], 16);
    return { r, g, b };
  }

  /* ─────────────────────────────*
   *  Protected/Private Methods  *
   *─────────────────────────────*/
  protected refineData(data: ITask[]): ITask[] {
    return data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  protected fillComponentAttributesFromResponseBody(data: ITask[] | null): ITask[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = { sort: this.sortService.buildSortParam(this.sortState()) };
    return this.taskService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.tasks = this.refineData(dataFromBody);
  }

  protected handleNavigation(sortState: SortState): void {
    const queryParamsObj = { sort: this.sortService.buildSortParam(sortState) };
    this.ngZone.run(() => {
      this.router.navigate(['./'], { relativeTo: this.activatedRoute, queryParams: queryParamsObj });
    });
  }

  // Helper: Return the array of tasks for a given container ID.
  private getTaskArrayByContainerId(containerId: string): ITask[] {
    if (containerId === 'unsectioned') {
      return this.unsectionedTasks;
    }
    const sectionId = Number(containerId.split('-')[1]);
    return this.sectionsMap[sectionId] ?? [];
  }

  // Helper: Update the "order" property for each task in the provided array.
  private updateOrder(tasks: ITask[]): void {
    tasks.forEach((task, idx) => (task.order = idx + 1));
  }
}
