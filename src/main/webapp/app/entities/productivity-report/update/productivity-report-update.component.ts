import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';
import { IHabit } from 'app/entities/habit/habit.model';
import { HabitService } from 'app/entities/habit/service/habit.service';
import { ProductivityReportService } from '../service/productivity-report.service';
import { IProductivityReport } from '../productivity-report.model';
import { ProductivityReportFormGroup, ProductivityReportFormService } from './productivity-report-form.service';

@Component({
  standalone: true,
  selector: 'jhi-productivity-report-update',
  templateUrl: './productivity-report-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProductivityReportUpdateComponent implements OnInit {
  isSaving = false;
  productivityReport: IProductivityReport | null = null;

  usersSharedCollection: IUser[] = [];
  tasksSharedCollection: ITask[] = [];
  habitsSharedCollection: IHabit[] = [];

  protected productivityReportService = inject(ProductivityReportService);
  protected productivityReportFormService = inject(ProductivityReportFormService);
  protected userService = inject(UserService);
  protected taskService = inject(TaskService);
  protected habitService = inject(HabitService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ProductivityReportFormGroup = this.productivityReportFormService.createProductivityReportFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareTask = (o1: ITask | null, o2: ITask | null): boolean => this.taskService.compareTask(o1, o2);

  compareHabit = (o1: IHabit | null, o2: IHabit | null): boolean => this.habitService.compareHabit(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productivityReport }) => {
      this.productivityReport = productivityReport;
      if (productivityReport) {
        this.updateForm(productivityReport);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productivityReport = this.productivityReportFormService.getProductivityReport(this.editForm);
    if (productivityReport.id !== null) {
      this.subscribeToSaveResponse(this.productivityReportService.update(productivityReport));
    } else {
      this.subscribeToSaveResponse(this.productivityReportService.create(productivityReport));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductivityReport>>): void {
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

  protected updateForm(productivityReport: IProductivityReport): void {
    this.productivityReport = productivityReport;
    this.productivityReportFormService.resetForm(this.editForm, productivityReport);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, productivityReport.user);
    this.tasksSharedCollection = this.taskService.addTaskToCollectionIfMissing<ITask>(
      this.tasksSharedCollection,
      ...(productivityReport.completedTasks ?? []),
    );
    this.habitsSharedCollection = this.habitService.addHabitToCollectionIfMissing<IHabit>(
      this.habitsSharedCollection,
      ...(productivityReport.completedHabits ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.productivityReport?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.taskService
      .query()
      .pipe(map((res: HttpResponse<ITask[]>) => res.body ?? []))
      .pipe(
        map((tasks: ITask[]) =>
          this.taskService.addTaskToCollectionIfMissing<ITask>(tasks, ...(this.productivityReport?.completedTasks ?? [])),
        ),
      )
      .subscribe((tasks: ITask[]) => (this.tasksSharedCollection = tasks));

    this.habitService
      .query()
      .pipe(map((res: HttpResponse<IHabit[]>) => res.body ?? []))
      .pipe(
        map((habits: IHabit[]) =>
          this.habitService.addHabitToCollectionIfMissing<IHabit>(habits, ...(this.productivityReport?.completedHabits ?? [])),
        ),
      )
      .subscribe((habits: IHabit[]) => (this.habitsSharedCollection = habits));
  }
}
