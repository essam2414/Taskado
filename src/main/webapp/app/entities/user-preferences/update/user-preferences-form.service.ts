import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IUserPreferences, NewUserPreferences } from '../user-preferences.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserPreferences for edit and NewUserPreferencesFormGroupInput for create.
 */
type UserPreferencesFormGroupInput = IUserPreferences | PartialWithRequiredKeyOf<NewUserPreferences>;

type UserPreferencesFormDefaults = Pick<NewUserPreferences, 'id' | 'darkMode' | 'dyslexiaMode' | 'highContrast' | 'reduceMotion'>;

type UserPreferencesFormGroupContent = {
  id: FormControl<IUserPreferences['id'] | NewUserPreferences['id']>;
  darkMode: FormControl<IUserPreferences['darkMode']>;
  sidebarColorLight: FormControl<IUserPreferences['sidebarColorLight']>;
  sidebarColorDark: FormControl<IUserPreferences['sidebarColorDark']>;
  accentColor: FormControl<IUserPreferences['accentColor']>;
  fontSizeLevel: FormControl<IUserPreferences['fontSizeLevel']>;
  dyslexiaMode: FormControl<IUserPreferences['dyslexiaMode']>;
  highContrast: FormControl<IUserPreferences['highContrast']>;
  reduceMotion: FormControl<IUserPreferences['reduceMotion']>;
  user: FormControl<IUserPreferences['user']>;
};

export type UserPreferencesFormGroup = FormGroup<UserPreferencesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserPreferencesFormService {
  createUserPreferencesFormGroup(userPreferences: UserPreferencesFormGroupInput = { id: null }): UserPreferencesFormGroup {
    const userPreferencesRawValue = {
      ...this.getFormDefaults(),
      ...userPreferences,
    };
    return new FormGroup<UserPreferencesFormGroupContent>({
      id: new FormControl(
        { value: userPreferencesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      darkMode: new FormControl(userPreferencesRawValue.darkMode),
      sidebarColorLight: new FormControl(userPreferencesRawValue.sidebarColorLight),
      sidebarColorDark: new FormControl(userPreferencesRawValue.sidebarColorDark),
      accentColor: new FormControl(userPreferencesRawValue.accentColor),
      fontSizeLevel: new FormControl(userPreferencesRawValue.fontSizeLevel),
      dyslexiaMode: new FormControl(userPreferencesRawValue.dyslexiaMode),
      highContrast: new FormControl(userPreferencesRawValue.highContrast),
      reduceMotion: new FormControl(userPreferencesRawValue.reduceMotion),
      user: new FormControl(userPreferencesRawValue.user),
    });
  }

  getUserPreferences(form: UserPreferencesFormGroup): IUserPreferences | NewUserPreferences {
    return form.getRawValue() as IUserPreferences | NewUserPreferences;
  }

  resetForm(form: UserPreferencesFormGroup, userPreferences: UserPreferencesFormGroupInput): void {
    const userPreferencesRawValue = { ...this.getFormDefaults(), ...userPreferences };
    form.reset(
      {
        ...userPreferencesRawValue,
        id: { value: userPreferencesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UserPreferencesFormDefaults {
    return {
      id: null,
      darkMode: false,
      dyslexiaMode: false,
      highContrast: false,
      reduceMotion: false,
    };
  }
}
