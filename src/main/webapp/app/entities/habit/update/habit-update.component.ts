import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IHabit } from '../habit.model';
import { HabitService } from '../service/habit.service';
import { HabitFormGroup, HabitFormService } from './habit-form.service';

@Component({
  standalone: true,
  selector: 'jhi-habit-update',
  templateUrl: './habit-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class HabitUpdateComponent implements OnInit {
  isSaving = false;
  habit: IHabit | null = null;

  usersSharedCollection: IUser[] = [];

  protected habitService = inject(HabitService);
  protected habitFormService = inject(HabitFormService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: HabitFormGroup = this.habitFormService.createHabitFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ habit }) => {
      this.habit = habit;
      if (habit) {
        this.updateForm(habit);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const habit = this.habitFormService.getHabit(this.editForm);
    if (habit.id !== null) {
      this.subscribeToSaveResponse(this.habitService.update(habit));
    } else {
      this.subscribeToSaveResponse(this.habitService.create(habit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHabit>>): void {
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

  protected updateForm(habit: IHabit): void {
    this.habit = habit;
    this.habitFormService.resetForm(this.editForm, habit);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, habit.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.habit?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
