import { Component, OnInit, inject, HostListener, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { finalize, filter, tap } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICategory, NewCategory, CATEGORY_COLORS } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { Priority } from 'app/entities/enumerations/priority.model';
import { TaskService } from '../service/task.service';
import { ITask, NewTask } from '../task.model';
import { TaskFormService, TaskFormGroup } from './task-form.service';
import { TaskDeleteDialogComponent } from '../delete/task-delete-dialog.component';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import dayjs from 'dayjs';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

type AllowedPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null;

@Component({
  standalone: true,
  selector: 'jhi-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['../task.scss'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule, CdkDrag, CdkDropList],
})
export class TaskModalComponent implements OnInit {
  isSaving = false;
  task: ITask | null = null;

  subtasks: ITask[] = [];
  editingSubtaskId: number | null = null;
  isCreatingSubtask = false;
  @Output() refreshParent = new EventEmitter<void>();

  @ViewChild('subtaskTitleInput') subtaskTitleInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('selectedSubtaskDate') subtaskDateInputRef!: ElementRef<HTMLInputElement>;
  selectedSubtaskDueDate: string | null = null;
  subtaskDatePickerOpen = false;

  subtaskPriorityDropdownOpen = false;
  selectedSubtaskPriority: AllowedPriority = null;
  subtaskCategoryDropdownOpen = false;
  selectedSubtaskCategory: ICategory | null = null;

  @ViewChild('selectedDate') dateInputRef!: ElementRef<HTMLInputElement>;
  selectedDueDate: string | null = null;
  datePickerOpen = false;

  priorityValues = Object.keys(Priority) as (keyof typeof Priority)[];
  priorityDropdownOpen = false;
  selectedPriority: AllowedPriority = null;

  @ViewChild('addCategoryInput') addCategoryInputRef?: ElementRef<HTMLInputElement>;
  categoryDropdownOpen = false;
  selectedCategory: ICategory | null = null;
  addCategoryOpen = false;
  newCategoryName = '';
  newCategoryColor = this.getRandomColor();

  categoriesSharedCollection: ICategory[] = [];
  usersSharedCollection: IUser[] = [];

  editForm: TaskFormGroup = inject(TaskFormService).createTaskFormGroup();
  subtaskForm: TaskFormGroup = inject(TaskFormService).createTaskFormGroup();
  protected taskService = inject(TaskService);
  protected taskFormService = inject(TaskFormService);
  protected categoryService = inject(CategoryService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);
  protected modalService = inject(NgbModal);

  constructor(public activeModal: NgbActiveModal) {}

  trackId = (item: ITask): number => this.taskService.getTaskIdentifier(item);

  compareCategory = (o1: ICategory | null, o2: ICategory | null): boolean => this.categoryService.compareCategory(o1, o2);
  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.loadCategories();

    if (this.task) {
      this.updateForm(this.task);
      this.loadSubtasks();
    }
  }

  close(result?: ITask): void {
    this.activeModal.close(result);
  }

  save(): void {
    this.isSaving = true;
    const task = this.taskFormService.getTask(this.editForm);
    if (task.id !== null) {
      this.subscribeToSaveResponse(this.taskService.update(task));
    } else {
      this.subscribeToSaveResponse(this.taskService.create(task));
    }
  }

  drop(event: CdkDragDrop<ITask[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    moveItemInArray(this.subtasks, event.previousIndex, event.currentIndex);

    this.subtasks.forEach((subtask, index) => {
      subtask.order = index + 1;
    });

    const silentHeaders = new HttpHeaders({ 'X-Silent-Alert': 'true' });
    const updates = this.subtasks.map(subtask =>
      this.taskService['http'].put(`${this.taskService['resourceUrl']}/${subtask.id}`, subtask, {
        observe: 'response',
        headers: silentHeaders,
      }),
    );

    combineLatest(updates).subscribe(() => {
      this.loadSubtasks();
    });
  }

  // subtask methods
  loadSubtasks(): void {
    if (!this.task?.id) {
      this.subtasks = []; // No subtasks if parent doesn't exist yet
      return;
    }

    this.taskService.query().subscribe(res => {
      const allTasks = res.body ?? [];
      this.subtasks = allTasks
        .filter(t => t.parentTask?.id === this.task?.id)
        .sort((a, b) => {
          if ((a.order ?? 0) !== (b.order ?? 0)) {
            return (a.order ?? 0) - (b.order ?? 0);
          }
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
          return 0;
        });

      this.subtasks.forEach(subtask => {
        if (subtask.category?.id) {
          const fullCategory = this.categoriesSharedCollection.find(c => c.id === subtask.category?.id);
          if (fullCategory) {
            subtask.category = fullCategory;
          }
        }
      });
    });
  }

  saveSubtask(): void {
    const subtask = this.taskFormService.getTask(this.subtaskForm);

    subtask.parentTask = { id: this.task!.id };

    if (this.editingSubtaskId) {
      subtask.id = this.editingSubtaskId;

      const existingSubtask = this.subtasks.find(s => s.id === this.editingSubtaskId);
      if (existingSubtask?.user) {
        subtask.user = existingSubtask.user;
      }
    } else {
      subtask.id = null;
    }

    const request = this.editingSubtaskId ? this.taskService.update(subtask as ITask) : this.taskService.create(subtask as NewTask);

    request.subscribe(() => {
      this.resetSubtaskForm();
      this.loadSubtasks();
      this.refreshParent.emit();
    });
  }

  deleteSubtask(task: ITask): void {
    const modalRef = this.modalService.open(TaskDeleteDialogComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.task = task;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.loadSubtasks()),
      )
      .subscribe();
  }

  get completedSubtaskCount(): number {
    return this.subtasks.filter(s => s.completed).length;
  }

  get totalSubtaskCount(): number {
    return this.subtasks.length;
  }

  resetSubtaskForm(): void {
    this.editingSubtaskId = null;
    this.isCreatingSubtask = false;
    this.taskFormService.resetForm(this.subtaskForm, { id: null, parentTask: { id: this.task!.id } });
  }

  startCreatingSubtask(): void {
    this.editingSubtaskId = null;
    this.isCreatingSubtask = true;

    this.selectedSubtaskDueDate = null;
    this.selectedSubtaskPriority = null;
    this.selectedSubtaskCategory = null;

    // ✅ Clear the form completely with null id
    this.taskFormService.resetForm(this.subtaskForm, {
      id: null,
      parentTask: { id: this.task!.id },
      title: '',
      description: '',
      dueDate: undefined,
      priority: null,
      category: null,
      user: null,
      section: null,
      productivityReports: [],
      completed: false,
      createdAt: undefined,
      updatedAt: undefined,
      order: 0,
    });

    setTimeout(() => this.subtaskTitleInputRef.nativeElement.focus());
  }

  editSubtask(task: ITask): void {
    this.isCreatingSubtask = false;
    this.editingSubtaskId = task.id;
    this.selectedSubtaskPriority = task.priority ?? null;
    this.selectedSubtaskCategory = task.category ?? null;
    this.selectedSubtaskDueDate = task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DDTHH:mm') : null;

    this.subtaskForm.reset();

    this.subtaskForm.patchValue({
      title: task.title ?? '',
      description: task.description ?? '',
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      priority: task.priority ?? null,
      category: task.category ?? null,
    });

    setTimeout(() => this.subtaskTitleInputRef.nativeElement.focus());
  }

  toggleCompleted(task: ITask): void {
    const updatedTask = { ...task, completed: !task.completed };

    this.taskService.update(updatedTask).subscribe(() => {
      task.completed = updatedTask.completed;
      this.loadSubtasks();
      this.refreshParent.emit();
    });
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

  getDueDateClass(dueDate: dayjs.Dayjs | string | null | undefined): string {
    if (!dueDate) return '';

    const date = dayjs(dueDate);
    const now = dayjs();

    if (date.isBefore(now, 'minute')) return 'past-task';
    if (date.isSame(now, 'day')) return 'due-today';

    return '';
  }

  selectSubtaskPriority(priority: string | null): void {
    if (priority === null) {
      this.selectedSubtaskPriority = null;
    } else if (['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(priority)) {
      this.selectedSubtaskPriority = priority as AllowedPriority;
    } else {
      this.selectedSubtaskPriority = null;
      console.warn('Invalid priority value:', priority);
    }

    this.subtaskForm.controls['priority'].setValue(this.selectedSubtaskPriority);
    this.subtaskForm.controls['priority'].markAsDirty();
    this.subtaskPriorityDropdownOpen = false;
  }

  selectSubtaskCategory(category: ICategory | null): void {
    const matched = this.categoriesSharedCollection.find(c => c.id === category?.id) ?? null;
    this.selectedSubtaskCategory = matched;
    this.subtaskForm.controls['category'].setValue(matched);
    this.subtaskForm.controls['category'].markAsDirty();
    this.subtaskCategoryDropdownOpen = false;
  }

  toggleSubtaskPriorityDropdown(): void {
    const wasOpen = this.subtaskPriorityDropdownOpen;
    this.closeAllDropdowns();
    this.subtaskPriorityDropdownOpen = !wasOpen;
  }

  toggleSubtaskCategoryDropdown(): void {
    const wasOpen = this.subtaskCategoryDropdownOpen;
    this.closeAllDropdowns();
    this.addCategoryOpen = false;
    this.subtaskCategoryDropdownOpen = !wasOpen;
  }

  toggleSubtaskDatePicker(): void {
    const wasOpen = this.subtaskDatePickerOpen;
    this.closeAllDropdowns();

    this.subtaskDatePickerOpen = !wasOpen;
    if (!this.subtaskDatePickerOpen) {
      setTimeout(() => {
        this.subtaskDateInputRef.nativeElement.blur();
      }, 0);
    }
  }

  // priority/category methods
  toggleDatePicker(): void {
    const wasOpen = this.datePickerOpen;
    this.closeAllDropdowns();

    this.datePickerOpen = !wasOpen;
    if (!this.datePickerOpen) {
      setTimeout(() => {
        this.dateInputRef.nativeElement.blur();
      }, 0);
    }
  }

  togglePriorityDropdown(): void {
    const wasOpen = this.priorityDropdownOpen;
    this.closeAllDropdowns();
    this.priorityDropdownOpen = !wasOpen;
  }

  toggleCategoryDropdown(): void {
    const wasOpen = this.categoryDropdownOpen;
    this.closeAllDropdowns();
    this.addCategoryOpen = false;
    this.categoryDropdownOpen = !wasOpen;
  }

  selectDueDate(date: string | null, form: TaskFormGroup): void {
    form.controls['dueDate'].setValue(date);
    form.controls['dueDate'].markAsDirty();
  }

  selectPriority(priority: string | null): void {
    if (priority === null) {
      this.selectedPriority = null;
    } else if (['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(priority)) {
      this.selectedPriority = priority as AllowedPriority;
    } else {
      this.selectedPriority = null;
      console.warn('Invalid priority value:', priority);
    }

    this.editForm.controls['priority'].setValue(this.selectedPriority);
    this.editForm.controls['priority'].markAsDirty();
    this.priorityDropdownOpen = false;
  }

  getPriorityLabel(priority: keyof typeof Priority | null): string {
    const labels: Record<keyof typeof Priority, string> = {
      LOW: 'Low Priority',
      MEDIUM: 'Medium Priority',
      HIGH: 'High Priority',
      CRITICAL: 'Critical Priority',
    };

    return priority ? labels[priority] : 'Select Priority';
  }

  selectCategory(category: ICategory | null): void {
    this.selectedCategory = category ? { ...category } : null;
    this.editForm.controls['category'].setValue(this.selectedCategory);
    this.editForm.controls['category'].markAsDirty();
    this.categoryDropdownOpen = false;
  }

  toggleAddCategory(): void {
    this.addCategoryOpen = !this.addCategoryOpen;

    if (this.addCategoryOpen) {
      setTimeout(() => {
        this.addCategoryInputRef?.nativeElement.focus();
      });
    }
  }

  addCategoryFromInput(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;

    keyboardEvent.preventDefault();

    const name = this.newCategoryName.trim();
    const color = this.newCategoryColor;

    if (!name) return;

    const newCategory: NewCategory = {
      id: null,
      name,
      color,
    };

    this.categoryService.create(newCategory).subscribe({
      next: res => {
        const added = res.body;
        if (added) {
          this.categoriesSharedCollection.push(added);
          this.newCategoryName = '';
          this.newCategoryColor = this.getRandomColor();
          this.addCategoryOpen = false;
        }
      },
    });
  }

  getRandomColor(): string {
    const random = Math.floor(Math.random() * CATEGORY_COLORS.length);
    return CATEGORY_COLORS[random].value;
  }

  loadCategories(): void {
    this.categoryService.query().subscribe({
      next: (res: HttpResponse<ICategory[]>) => {
        this.categoriesSharedCollection = res.body ?? [];

        if (this.task?.category?.id) {
          const fullCategory = this.categoriesSharedCollection.find(c => c.id === this.task?.category?.id);
          if (fullCategory) {
            this.selectedCategory = fullCategory;
            this.editForm.controls['category'].setValue(fullCategory);
          }
        }
      },
    });
  }

  deleteCategory(category: ICategory, event: Event): void {
    event.stopPropagation(); // ✅ So it doesn’t trigger selectCategory()

    if (!category.id) return;

    this.categoryService.delete(category.id).subscribe(() => {
      this.categoriesSharedCollection = this.categoriesSharedCollection.filter(c => c.id !== category.id);

      // Clear it from the selected form if it was selected
      if (this.editForm.controls['category'].value?.id === category.id) {
        this.editForm.controls['category'].setValue(null);
        this.selectedCategory = null;
      }
    });
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
    return `rgba(${r}, ${g}, ${b}, 0.18)`; // your custom alpha
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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInsideDropdown = target.closest('.dropdown-select');

    if (!clickedInsideDropdown) {
      this.closeAllDropdowns();
    }
  }

  // helper methods
  closeAllDropdowns(): void {
    this.priorityDropdownOpen = false;
    this.categoryDropdownOpen = false;
    this.datePickerOpen = false;

    this.subtaskPriorityDropdownOpen = false;
    this.subtaskCategoryDropdownOpen = false;
    this.subtaskDatePickerOpen = false;
  }

  protected updateForm(task: ITask): void {
    this.task = task;
    this.taskFormService.resetForm(this.editForm, task);

    this.selectedPriority = task.priority ?? null;
    this.selectedCategory = task.category ?? null;
    this.selectedDueDate = task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DDTHH:mm') : null;

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, task.user);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITask>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: response => {
        if (response.body) {
          this.onSaveSuccess(response.body);
        } // ✅ Pass the saved task to onSaveSuccess()
      },
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(task: ITask): void {
    this.fillCategory(task);
    this.activeModal.close(task);
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  private fillCategory(task: ITask): void {
    if (task.category?.id) {
      const full = this.categoriesSharedCollection.find(c => c.id === task.category?.id);
      if (full) task.category = full;
    }
  }
}
