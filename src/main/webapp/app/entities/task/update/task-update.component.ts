import { Component, OnInit, inject } from '@angular/core';
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
import { ISection } from 'app/entities/section/section.model';
import { SectionService } from 'app/entities/section/service/section.service';
import { IProductivityReport } from 'app/entities/productivity-report/productivity-report.model';
import { ProductivityReportService } from 'app/entities/productivity-report/service/productivity-report.service';
import { Priority } from 'app/entities/enumerations/priority.model';
import { TaskService } from '../service/task.service';
import { ITask } from '../task.model';
import { TaskFormGroup, TaskFormService } from './task-form.service';

@Component({
  standalone: true,
  selector: 'jhi-task-update',
  templateUrl: './task-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TaskUpdateComponent implements OnInit {
  isSaving = false;
  task: ITask | null = null;
  priorityValues = Object.keys(Priority);

  categoriesSharedCollection: ICategory[] = [];
  tasksSharedCollection: ITask[] = [];
  usersSharedCollection: IUser[] = [];
  sectionsSharedCollection: ISection[] = [];
  productivityReportsSharedCollection: IProductivityReport[] = [];

  protected taskService = inject(TaskService);
  protected taskFormService = inject(TaskFormService);
  protected categoryService = inject(CategoryService);
  protected userService = inject(UserService);
  protected sectionService = inject(SectionService);
  protected productivityReportService = inject(ProductivityReportService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TaskFormGroup = this.taskFormService.createTaskFormGroup();

  compareCategory = (o1: ICategory | null, o2: ICategory | null): boolean => this.categoryService.compareCategory(o1, o2);

  compareTask = (o1: ITask | null, o2: ITask | null): boolean => this.taskService.compareTask(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareSection = (o1: ISection | null, o2: ISection | null): boolean => this.sectionService.compareSection(o1, o2);

  compareProductivityReport = (o1: IProductivityReport | null, o2: IProductivityReport | null): boolean =>
    this.productivityReportService.compareProductivityReport(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ task }) => {
      this.task = task;
      if (task) {
        this.updateForm(task);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITask>>): void {
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

  protected updateForm(task: ITask): void {
    this.task = task;
    this.taskFormService.resetForm(this.editForm, task);

    this.categoriesSharedCollection = this.categoryService.addCategoryToCollectionIfMissing<ICategory>(
      this.categoriesSharedCollection,
      task.category,
    );
    this.tasksSharedCollection = this.taskService.addTaskToCollectionIfMissing<ITask>(this.tasksSharedCollection, task.parentTask);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, task.user);
    this.sectionsSharedCollection = this.sectionService.addSectionToCollectionIfMissing<ISection>(
      this.sectionsSharedCollection,
      task.section,
    );
    this.productivityReportsSharedCollection =
      this.productivityReportService.addProductivityReportToCollectionIfMissing<IProductivityReport>(
        this.productivityReportsSharedCollection,
        ...(task.productivityReports ?? []),
      );
  }

  protected loadRelationshipsOptions(): void {
    this.categoryService
      .query()
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) => this.categoryService.addCategoryToCollectionIfMissing<ICategory>(categories, this.task?.category)),
      )
      .subscribe((categories: ICategory[]) => (this.categoriesSharedCollection = categories));

    this.taskService
      .query()
      .pipe(map((res: HttpResponse<ITask[]>) => res.body ?? []))
      .pipe(map((tasks: ITask[]) => this.taskService.addTaskToCollectionIfMissing<ITask>(tasks, this.task?.parentTask)))
      .subscribe((tasks: ITask[]) => (this.tasksSharedCollection = tasks));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.task?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.sectionService
      .query()
      .pipe(map((res: HttpResponse<ISection[]>) => res.body ?? []))
      .pipe(map((sections: ISection[]) => this.sectionService.addSectionToCollectionIfMissing<ISection>(sections, this.task?.section)))
      .subscribe((sections: ISection[]) => (this.sectionsSharedCollection = sections));

    this.productivityReportService
      .query()
      .pipe(map((res: HttpResponse<IProductivityReport[]>) => res.body ?? []))
      .pipe(
        map((productivityReports: IProductivityReport[]) =>
          this.productivityReportService.addProductivityReportToCollectionIfMissing<IProductivityReport>(
            productivityReports,
            ...(this.task?.productivityReports ?? []),
          ),
        ),
      )
      .subscribe((productivityReports: IProductivityReport[]) => (this.productivityReportsSharedCollection = productivityReports));
  }
}
