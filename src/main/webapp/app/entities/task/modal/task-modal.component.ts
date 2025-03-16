import { Component, OnInit, inject, HostListener } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICategory } from 'app/entities/category/category.model';
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

  priorityValues = Object.keys(Priority);
  priorityDropdownOpen = false;
  selectedPriority: AllowedPriority = null;

  categoryDropdownOpen = false;
  selectedCategory: ICategory | null = null;

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
    this.close();
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

  toggleCategoryDropdown(): void {
    this.priorityDropdownOpen = false;
    this.categoryDropdownOpen = !this.categoryDropdownOpen;
  }

  selectCategory(category: ICategory | null): void {
    this.selectedCategory = category ?? null;
    this.editForm.controls['category'].setValue(category);
    this.categoryDropdownOpen = false;
  }

  editCategories(): void {
    window.location.href = '/category';
  }

  protected updateForm(task: ITask): void {
    this.task = task;
    this.taskFormService.resetForm(this.editForm, task);

    this.categoriesSharedCollection = this.categoryService.addCategoryToCollectionIfMissing<ICategory>(
      this.categoriesSharedCollection,
      task.category,
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, task.user);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITask>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    // this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
