import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITaskCategory } from '../task-category.model';
import { TaskCategoryService } from '../service/task-category.service';
import { TaskCategoryFormGroup, TaskCategoryFormService } from './task-category-form.service';

@Component({
  standalone: true,
  selector: 'jhi-task-category-update',
  templateUrl: './task-category-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TaskCategoryUpdateComponent implements OnInit {
  isSaving = false;
  taskCategory: ITaskCategory | null = null;

  protected taskCategoryService = inject(TaskCategoryService);
  protected taskCategoryFormService = inject(TaskCategoryFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TaskCategoryFormGroup = this.taskCategoryFormService.createTaskCategoryFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ taskCategory }) => {
      this.taskCategory = taskCategory;
      if (taskCategory) {
        this.updateForm(taskCategory);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const taskCategory = this.taskCategoryFormService.getTaskCategory(this.editForm);
    if (taskCategory.id !== null) {
      this.subscribeToSaveResponse(this.taskCategoryService.update(taskCategory));
    } else {
      this.subscribeToSaveResponse(this.taskCategoryService.create(taskCategory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITaskCategory>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(taskCategory: ITaskCategory): void {
    this.taskCategory = taskCategory;
    this.taskCategoryFormService.resetForm(this.editForm, taskCategory);
  }
}
