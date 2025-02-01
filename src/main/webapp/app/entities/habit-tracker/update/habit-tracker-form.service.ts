import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IHabitTracker, NewHabitTracker } from '../habit-tracker.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHabitTracker for edit and NewHabitTrackerFormGroupInput for create.
 */
type HabitTrackerFormGroupInput = IHabitTracker | PartialWithRequiredKeyOf<NewHabitTracker>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IHabitTracker | NewHabitTracker> = Omit<T, 'startDate'> & {
  startDate?: string | null;
};

type HabitTrackerFormRawValue = FormValueOf<IHabitTracker>;

type NewHabitTrackerFormRawValue = FormValueOf<NewHabitTracker>;

type HabitTrackerFormDefaults = Pick<NewHabitTracker, 'id' | 'startDate'>;

type HabitTrackerFormGroupContent = {
  id: FormControl<HabitTrackerFormRawValue['id'] | NewHabitTracker['id']>;
  name: FormControl<HabitTrackerFormRawValue['name']>;
  repeatFrequency: FormControl<HabitTrackerFormRawValue['repeatFrequency']>;
  startDate: FormControl<HabitTrackerFormRawValue['startDate']>;
  streak: FormControl<HabitTrackerFormRawValue['streak']>;
};

export type HabitTrackerFormGroup = FormGroup<HabitTrackerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HabitTrackerFormService {
  createHabitTrackerFormGroup(habitTracker: HabitTrackerFormGroupInput = { id: null }): HabitTrackerFormGroup {
    const habitTrackerRawValue = this.convertHabitTrackerToHabitTrackerRawValue({
      ...this.getFormDefaults(),
      ...habitTracker,
    });
    return new FormGroup<HabitTrackerFormGroupContent>({
      id: new FormControl(
        { value: habitTrackerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(habitTrackerRawValue.name, {
        validators: [Validators.required],
      }),
      repeatFrequency: new FormControl(habitTrackerRawValue.repeatFrequency, {
        validators: [Validators.required],
      }),
      startDate: new FormControl(habitTrackerRawValue.startDate, {
        validators: [Validators.required],
      }),
      streak: new FormControl(habitTrackerRawValue.streak),
    });
  }

  getHabitTracker(form: HabitTrackerFormGroup): IHabitTracker | NewHabitTracker {
    return this.convertHabitTrackerRawValueToHabitTracker(form.getRawValue() as HabitTrackerFormRawValue | NewHabitTrackerFormRawValue);
  }

  resetForm(form: HabitTrackerFormGroup, habitTracker: HabitTrackerFormGroupInput): void {
    const habitTrackerRawValue = this.convertHabitTrackerToHabitTrackerRawValue({ ...this.getFormDefaults(), ...habitTracker });
    form.reset(
      {
        ...habitTrackerRawValue,
        id: { value: habitTrackerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): HabitTrackerFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
    };
  }

  private convertHabitTrackerRawValueToHabitTracker(
    rawHabitTracker: HabitTrackerFormRawValue | NewHabitTrackerFormRawValue,
  ): IHabitTracker | NewHabitTracker {
    return {
      ...rawHabitTracker,
      startDate: dayjs(rawHabitTracker.startDate, DATE_TIME_FORMAT),
    };
  }

  private convertHabitTrackerToHabitTrackerRawValue(
    habitTracker: IHabitTracker | (Partial<NewHabitTracker> & HabitTrackerFormDefaults),
  ): HabitTrackerFormRawValue | PartialWithRequiredKeyOf<NewHabitTrackerFormRawValue> {
    return {
      ...habitTracker,
      startDate: habitTracker.startDate ? habitTracker.startDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
