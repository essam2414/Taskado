import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IGoal } from '../goal.model';
import { GoalService } from '../service/goal.service';
import { GoalFormGroup, GoalFormService } from './goal-form.service';

@Component({
  standalone: true,
  selector: 'jhi-goal-update',
  templateUrl: './goal-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GoalUpdateComponent implements OnInit {
  isSaving = false;
  goal: IGoal | null = null;

  usersSharedCollection: IUser[] = [];

  protected goalService = inject(GoalService);
  protected goalFormService = inject(GoalFormService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: GoalFormGroup = this.goalFormService.createGoalFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ goal }) => {
      this.goal = goal;
      if (goal) {
        this.updateForm(goal);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const goal = this.goalFormService.getGoal(this.editForm);
    if (goal.id !== null) {
      this.subscribeToSaveResponse(this.goalService.update(goal));
    } else {
      this.subscribeToSaveResponse(this.goalService.create(goal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGoal>>): void {
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

  protected updateForm(goal: IGoal): void {
    this.goal = goal;
    this.goalFormService.resetForm(this.editForm, goal);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, goal.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.goal?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
