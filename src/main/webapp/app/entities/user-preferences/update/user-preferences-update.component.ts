import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IUserPreferences } from '../user-preferences.model';
import { UserPreferencesService } from '../service/user-preferences.service';
import { UserPreferencesFormGroup, UserPreferencesFormService } from './user-preferences-form.service';

@Component({
  standalone: true,
  selector: 'jhi-user-preferences-update',
  templateUrl: './user-preferences-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UserPreferencesUpdateComponent implements OnInit {
  isSaving = false;
  userPreferences: IUserPreferences | null = null;

  usersSharedCollection: IUser[] = [];

  protected userPreferencesService = inject(UserPreferencesService);
  protected userPreferencesFormService = inject(UserPreferencesFormService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: UserPreferencesFormGroup = this.userPreferencesFormService.createUserPreferencesFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userPreferences }) => {
      this.userPreferences = userPreferences;
      if (userPreferences) {
        this.updateForm(userPreferences);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userPreferences = this.userPreferencesFormService.getUserPreferences(this.editForm);
    if (userPreferences.id !== null) {
      this.subscribeToSaveResponse(this.userPreferencesService.update(userPreferences));
    } else {
      this.subscribeToSaveResponse(this.userPreferencesService.create(userPreferences));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserPreferences>>): void {
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

  protected updateForm(userPreferences: IUserPreferences): void {
    this.userPreferences = userPreferences;
    this.userPreferencesFormService.resetForm(this.editForm, userPreferences);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, userPreferences.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.userPreferences?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
