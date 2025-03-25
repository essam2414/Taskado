import { Component, OnInit, inject, HostListener, ViewChild, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICategory, NewCategory, CATEGORY_COLORS } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { Priority } from 'app/entities/enumerations/priority.model';
import { TaskService } from '../service/task.service';
import { ITask } from '../task.model';
import { TaskFormService, TaskFormGroup } from './task-form.service';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

type AllowedPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null;

@Component({
  standalone: true,
  selector: 'jhi-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['../task.scss'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TaskModalComponent implements OnInit {
  isSaving = false;
  task: ITask | null = null;

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
  protected taskService = inject(TaskService);
  protected taskFormService = inject(TaskFormService);
  protected categoryService = inject(CategoryService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  constructor(public activeModal: NgbActiveModal) {}

  compareCategory = (o1: ICategory | null, o2: ICategory | null): boolean => this.categoryService.compareCategory(o1, o2);
  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.loadCategories();

    if (this.task) {
      this.updateForm(this.task);
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

  togglePriorityDropdown(): void {
    this.categoryDropdownOpen = false;
    this.priorityDropdownOpen = !this.priorityDropdownOpen;
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
    this.selectedCategory = category ?? null;
    this.editForm.controls['category'].setValue(this.selectedCategory);
    this.categoryDropdownOpen = false;
  }

  toggleCategoryDropdown(): void {
    this.priorityDropdownOpen = false;
    this.addCategoryOpen = false;
    this.categoryDropdownOpen = !this.categoryDropdownOpen;
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
      this.priorityDropdownOpen = false;
      this.categoryDropdownOpen = false;
    }
  }

  protected updateForm(task: ITask): void {
    this.task = task;
    this.taskFormService.resetForm(this.editForm, task);

    this.selectedPriority = task.priority ?? null;
    this.selectedCategory = task.category ?? null;

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
    const updatedTask = this.taskFormService.getTask(this.editForm);
    this.activeModal.close({ ...task, ...updatedTask });
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
