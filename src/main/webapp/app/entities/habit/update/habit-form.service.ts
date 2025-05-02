import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IHabit, NewHabit } from '../habit.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHabit for edit and NewHabitFormGroupInput for create.
 */
type HabitFormGroupInput = IHabit | PartialWithRequiredKeyOf<NewHabit>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IHabit | NewHabit> = Omit<T, 'startDate'> & {
  startDate?: string | null;
};

type HabitFormRawValue = FormValueOf<IHabit>;

type NewHabitFormRawValue = FormValueOf<NewHabit>;

type HabitFormDefaults = Pick<NewHabit, 'id' | 'startDate' | 'productivityReports'>;

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
  productivityReports: FormControl<HabitFormRawValue['productivityReports']>;
};

export type HabitFormGroup = FormGroup<HabitFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HabitFormService {
  createHabitFormGroup(habit: HabitFormGroupInput = { id: null }): HabitFormGroup {
    const habitRawValue = this.convertHabitToHabitRawValue({
      ...this.getFormDefaults(),
      ...habit,
    });
    return new FormGroup<HabitFormGroupContent>({
      id: new FormControl(
        { value: habitRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(habitRawValue.name, {
        validators: [Validators.required],
      }),
      startDate: new FormControl(habitRawValue.startDate, {
        validators: [Validators.required],
      }),
      streak: new FormControl(habitRawValue.streak),
      completionRate: new FormControl(habitRawValue.completionRate),
      repeatType: new FormControl(habitRawValue.repeatType, {
        validators: [Validators.required],
      }),
      repeatInterval: new FormControl(habitRawValue.repeatInterval),
      repeatDays: new FormControl(habitRawValue.repeatDays),
      repeatTimes: new FormControl(habitRawValue.repeatTimes),
      completedDates: new FormControl(habitRawValue.completedDates),
      category: new FormControl(habitRawValue.category),
      user: new FormControl(habitRawValue.user),
      productivityReports: new FormControl(habitRawValue.productivityReports ?? []),
    });
  }

  getHabit(form: HabitFormGroup): IHabit | NewHabit {
    return this.convertHabitRawValueToHabit(form.getRawValue() as HabitFormRawValue | NewHabitFormRawValue);
  }

  resetForm(form: HabitFormGroup, habit: HabitFormGroupInput): void {
    const habitRawValue = this.convertHabitToHabitRawValue({ ...this.getFormDefaults(), ...habit });
    form.reset(
      {
        ...habitRawValue,
        id: { value: habitRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): HabitFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      productivityReports: [],
    };
  }

  private convertHabitRawValueToHabit(rawHabit: HabitFormRawValue | NewHabitFormRawValue): IHabit | NewHabit {
    return {
      ...rawHabit,
      startDate: dayjs(rawHabit.startDate, DATE_TIME_FORMAT),
    };
  }

  private convertHabitToHabitRawValue(
    habit: IHabit | (Partial<NewHabit> & HabitFormDefaults),
  ): HabitFormRawValue | PartialWithRequiredKeyOf<NewHabitFormRawValue> {
    return {
      ...habit,
      startDate: habit.startDate ? habit.startDate.format(DATE_TIME_FORMAT) : undefined,
      productivityReports: habit.productivityReports ?? [],
    };
  }
}
