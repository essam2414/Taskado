import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPomodoroSession, NewPomodoroSession } from '../pomodoro-session.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPomodoroSession for edit and NewPomodoroSessionFormGroupInput for create.
 */
type PomodoroSessionFormGroupInput = IPomodoroSession | PartialWithRequiredKeyOf<NewPomodoroSession>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPomodoroSession | NewPomodoroSession> = Omit<T, 'startTime' | 'endTime'> & {
  startTime?: string | null;
  endTime?: string | null;
};

type PomodoroSessionFormRawValue = FormValueOf<IPomodoroSession>;

type NewPomodoroSessionFormRawValue = FormValueOf<NewPomodoroSession>;

type PomodoroSessionFormDefaults = Pick<NewPomodoroSession, 'id' | 'startTime' | 'endTime' | 'completed'>;

type PomodoroSessionFormGroupContent = {
  id: FormControl<PomodoroSessionFormRawValue['id'] | NewPomodoroSession['id']>;
  name: FormControl<PomodoroSessionFormRawValue['name']>;
  duration: FormControl<PomodoroSessionFormRawValue['duration']>;
  breakDuration: FormControl<PomodoroSessionFormRawValue['breakDuration']>;
  longBreakDuration: FormControl<PomodoroSessionFormRawValue['longBreakDuration']>;
  cycles: FormControl<PomodoroSessionFormRawValue['cycles']>;
  startTime: FormControl<PomodoroSessionFormRawValue['startTime']>;
  endTime: FormControl<PomodoroSessionFormRawValue['endTime']>;
  completed: FormControl<PomodoroSessionFormRawValue['completed']>;
  user: FormControl<PomodoroSessionFormRawValue['user']>;
};

export type PomodoroSessionFormGroup = FormGroup<PomodoroSessionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PomodoroSessionFormService {
  createPomodoroSessionFormGroup(pomodoroSession: PomodoroSessionFormGroupInput = { id: null }): PomodoroSessionFormGroup {
    const pomodoroSessionRawValue = this.convertPomodoroSessionToPomodoroSessionRawValue({
      ...this.getFormDefaults(),
      ...pomodoroSession,
    });
    return new FormGroup<PomodoroSessionFormGroupContent>({
      id: new FormControl(
        { value: pomodoroSessionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(pomodoroSessionRawValue.name),
      duration: new FormControl(pomodoroSessionRawValue.duration, {
        validators: [Validators.required],
      }),
      breakDuration: new FormControl(pomodoroSessionRawValue.breakDuration, {
        validators: [Validators.required],
      }),
      longBreakDuration: new FormControl(pomodoroSessionRawValue.longBreakDuration),
      cycles: new FormControl(pomodoroSessionRawValue.cycles, {
        validators: [Validators.required],
      }),
      startTime: new FormControl(pomodoroSessionRawValue.startTime, {
        validators: [Validators.required],
      }),
      endTime: new FormControl(pomodoroSessionRawValue.endTime),
      completed: new FormControl(pomodoroSessionRawValue.completed, {
        validators: [Validators.required],
      }),
      user: new FormControl(pomodoroSessionRawValue.user),
    });
  }

  getPomodoroSession(form: PomodoroSessionFormGroup): IPomodoroSession | NewPomodoroSession {
    return this.convertPomodoroSessionRawValueToPomodoroSession(
      form.getRawValue() as PomodoroSessionFormRawValue | NewPomodoroSessionFormRawValue,
    );
  }

  resetForm(form: PomodoroSessionFormGroup, pomodoroSession: PomodoroSessionFormGroupInput): void {
    const pomodoroSessionRawValue = this.convertPomodoroSessionToPomodoroSessionRawValue({ ...this.getFormDefaults(), ...pomodoroSession });
    form.reset(
      {
        ...pomodoroSessionRawValue,
        id: { value: pomodoroSessionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PomodoroSessionFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startTime: currentTime,
      endTime: currentTime,
      completed: false,
    };
  }

  private convertPomodoroSessionRawValueToPomodoroSession(
    rawPomodoroSession: PomodoroSessionFormRawValue | NewPomodoroSessionFormRawValue,
  ): IPomodoroSession | NewPomodoroSession {
    return {
      ...rawPomodoroSession,
      startTime: dayjs(rawPomodoroSession.startTime, DATE_TIME_FORMAT),
      endTime: dayjs(rawPomodoroSession.endTime, DATE_TIME_FORMAT),
    };
  }

  private convertPomodoroSessionToPomodoroSessionRawValue(
    pomodoroSession: IPomodoroSession | (Partial<NewPomodoroSession> & PomodoroSessionFormDefaults),
  ): PomodoroSessionFormRawValue | PartialWithRequiredKeyOf<NewPomodoroSessionFormRawValue> {
    return {
      ...pomodoroSession,
      startTime: pomodoroSession.startTime ? pomodoroSession.startTime.format(DATE_TIME_FORMAT) : undefined,
      endTime: pomodoroSession.endTime ? pomodoroSession.endTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
