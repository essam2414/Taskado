import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IGoal, NewGoal } from '../goal.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGoal for edit and NewGoalFormGroupInput for create.
 */
type GoalFormGroupInput = IGoal | PartialWithRequiredKeyOf<NewGoal>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IGoal | NewGoal> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

type GoalFormRawValue = FormValueOf<IGoal>;

type NewGoalFormRawValue = FormValueOf<NewGoal>;

type GoalFormDefaults = Pick<NewGoal, 'id' | 'startDate' | 'endDate'>;

type GoalFormGroupContent = {
  id: FormControl<GoalFormRawValue['id'] | NewGoal['id']>;
  title: FormControl<GoalFormRawValue['title']>;
  description: FormControl<GoalFormRawValue['description']>;
  startDate: FormControl<GoalFormRawValue['startDate']>;
  endDate: FormControl<GoalFormRawValue['endDate']>;
  progress: FormControl<GoalFormRawValue['progress']>;
  user: FormControl<GoalFormRawValue['user']>;
};

export type GoalFormGroup = FormGroup<GoalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GoalFormService {
  createGoalFormGroup(goal: GoalFormGroupInput = { id: null }): GoalFormGroup {
    const goalRawValue = this.convertGoalToGoalRawValue({
      ...this.getFormDefaults(),
      ...goal,
    });
    return new FormGroup<GoalFormGroupContent>({
      id: new FormControl(
        { value: goalRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(goalRawValue.title, {
        validators: [Validators.required],
      }),
      description: new FormControl(goalRawValue.description),
      startDate: new FormControl(goalRawValue.startDate, {
        validators: [Validators.required],
      }),
      endDate: new FormControl(goalRawValue.endDate),
      progress: new FormControl(goalRawValue.progress),
      user: new FormControl(goalRawValue.user),
    });
  }

  getGoal(form: GoalFormGroup): IGoal | NewGoal {
    return this.convertGoalRawValueToGoal(form.getRawValue() as GoalFormRawValue | NewGoalFormRawValue);
  }

  resetForm(form: GoalFormGroup, goal: GoalFormGroupInput): void {
    const goalRawValue = this.convertGoalToGoalRawValue({ ...this.getFormDefaults(), ...goal });
    form.reset(
      {
        ...goalRawValue,
        id: { value: goalRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GoalFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      endDate: currentTime,
    };
  }

  private convertGoalRawValueToGoal(rawGoal: GoalFormRawValue | NewGoalFormRawValue): IGoal | NewGoal {
    return {
      ...rawGoal,
      startDate: dayjs(rawGoal.startDate, DATE_TIME_FORMAT),
      endDate: dayjs(rawGoal.endDate, DATE_TIME_FORMAT),
    };
  }

  private convertGoalToGoalRawValue(
    goal: IGoal | (Partial<NewGoal> & GoalFormDefaults),
  ): GoalFormRawValue | PartialWithRequiredKeyOf<NewGoalFormRawValue> {
    return {
      ...goal,
      startDate: goal.startDate ? goal.startDate.format(DATE_TIME_FORMAT) : undefined,
      endDate: goal.endDate ? goal.endDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
