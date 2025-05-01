/* eslint-disable prettier/prettier */
// src/main/webapp/app/entities/habit/update/habit-form.service.ts

import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IHabit, NewHabit } from '../habit.model';

/** Utility type for edit vs new forms */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/** Input type for createHabitFormGroup */
type HabitFormGroupInput = IHabit | PartialWithRequiredKeyOf<NewHabit>;

/** Convert Dayjs to string for forms */
type FormValueOf<T extends IHabit | NewHabit> = Omit<T, 'startDate'> & {
  startDate?: string | null;
};

type HabitFormRawValue = FormValueOf<IHabit>;
type NewHabitFormRawValue = FormValueOf<NewHabit>;

/** Fields that get defaults when creating a new form */
type HabitFormDefaults = Pick<NewHabit, 'id' | 'startDate' | 'repeatType'>;

type HabitFormGroupContent = {
  id: FormControl<HabitFormRawValue['id'] | NewHabit['id']>;
  name: FormControl<HabitFormRawValue['name']>;
  startDate: FormControl<HabitFormRawValue['startDate']>;
  streak: FormControl<HabitFormRawValue['streak']>;
  completionRate: FormControl<HabitFormRawValue['completionRate']>;
  repeatType: FormControl<HabitFormRawValue['repeatType']>;
  repeatInterval: FormControl<HabitFormRawValue['repeatInterval']>;
  repeatDays: FormControl<HabitFormRawValue['repeatDays']>;
  repeatTimes: FormControl<HabitFormRawValue['repeatTimes']>;
  completedDates: FormControl<HabitFormRawValue['completedDates']>;
  category: FormControl<HabitFormRawValue['category']>;
  user: FormControl<HabitFormRawValue['user']>;
};

export type HabitFormGroup = FormGroup<HabitFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HabitFormService {
  createHabitFormGroup(habit: HabitFormGroupInput = { id: null }): HabitFormGroup {
    const rawValue = this.convertHabitToFormValue({
      ...this.getFormDefaults(),
      ...habit,
    });

    return new FormGroup<HabitFormGroupContent>({
      id: new FormControl({ value: rawValue.id, disabled: true }, { nonNullable: true, validators: [Validators.required] }),
      name: new FormControl(rawValue.name, { validators: [Validators.required] }),
      startDate: new FormControl(rawValue.startDate, { validators: [Validators.required] }),
      streak: new FormControl(rawValue.streak),
      completionRate: new FormControl(rawValue.completionRate),

      // defaulted to 'DAILY' so never null
      repeatType: new FormControl(rawValue.repeatType),
      repeatInterval: new FormControl(rawValue.repeatInterval),
      repeatDays: new FormControl(rawValue.repeatDays),
      repeatTimes: new FormControl(rawValue.repeatTimes),
      completedDates: new FormControl(rawValue.completedDates),
      category: new FormControl(rawValue.category),
      user: new FormControl(rawValue.user),
    });
  }

  getHabit(form: HabitFormGroup): IHabit | NewHabit {
    const raw = form.getRawValue() as HabitFormRawValue & NewHabitFormRawValue;
    return this.convertFormValueToHabit(raw);
  }

  resetForm(form: HabitFormGroup, habit: HabitFormGroupInput): void {
    const rawValue = this.convertHabitToFormValue({
      ...this.getFormDefaults(),
      ...habit,
    });
    form.reset({
      ...rawValue,
      id: { value: rawValue.id, disabled: true },
    } as any);
  }

  private getFormDefaults(): HabitFormDefaults {
    return {
      id: null,
      startDate: dayjs(),
      repeatType: 'DAILY',
    };
  }

  private convertFormValueToHabit(raw: HabitFormRawValue | NewHabitFormRawValue): IHabit | NewHabit {
    return {
      ...raw,
      startDate: raw.startDate ? dayjs(raw.startDate, DATE_TIME_FORMAT) : undefined,
    };
  }

  private convertHabitToFormValue(habit: IHabit | (Partial<NewHabit> & HabitFormDefaults)): HabitFormRawValue | NewHabitFormRawValue {
    return {
      ...habit,
      startDate: habit.startDate ? habit.startDate.format(DATE_TIME_FORMAT) : undefined,
      repeatType: habit.repeatType ?? 'DAILY',
    };
  }
}
