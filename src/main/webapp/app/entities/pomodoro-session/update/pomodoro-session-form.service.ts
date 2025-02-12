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
type FormValueOf<T extends IPomodoroSession | NewPomodoroSession> = Omit<T, 'start' | 'stop'> & {
  start?: string | null;
  stop?: string | null;
};

type PomodoroSessionFormRawValue = FormValueOf<IPomodoroSession>;

type NewPomodoroSessionFormRawValue = FormValueOf<NewPomodoroSession>;

type PomodoroSessionFormDefaults = Pick<NewPomodoroSession, 'id' | 'start' | 'stop' | 'paused'>;

type PomodoroSessionFormGroupContent = {
  id: FormControl<PomodoroSessionFormRawValue['id'] | NewPomodoroSession['id']>;
  start: FormControl<PomodoroSessionFormRawValue['start']>;
  stop: FormControl<PomodoroSessionFormRawValue['stop']>;
  duration: FormControl<PomodoroSessionFormRawValue['duration']>;
  paused: FormControl<PomodoroSessionFormRawValue['paused']>;
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
      start: new FormControl(pomodoroSessionRawValue.start, {
        validators: [Validators.required],
      }),
      stop: new FormControl(pomodoroSessionRawValue.stop),
      duration: new FormControl(pomodoroSessionRawValue.duration),
      paused: new FormControl(pomodoroSessionRawValue.paused),
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
      start: currentTime,
      stop: currentTime,
      paused: false,
    };
  }

  private convertPomodoroSessionRawValueToPomodoroSession(
    rawPomodoroSession: PomodoroSessionFormRawValue | NewPomodoroSessionFormRawValue,
  ): IPomodoroSession | NewPomodoroSession {
    return {
      ...rawPomodoroSession,
      start: dayjs(rawPomodoroSession.start, DATE_TIME_FORMAT),
      stop: dayjs(rawPomodoroSession.stop, DATE_TIME_FORMAT),
    };
  }

  private convertPomodoroSessionToPomodoroSessionRawValue(
    pomodoroSession: IPomodoroSession | (Partial<NewPomodoroSession> & PomodoroSessionFormDefaults),
  ): PomodoroSessionFormRawValue | PartialWithRequiredKeyOf<NewPomodoroSessionFormRawValue> {
    return {
      ...pomodoroSession,
      start: pomodoroSession.start ? pomodoroSession.start.format(DATE_TIME_FORMAT) : undefined,
      stop: pomodoroSession.stop ? pomodoroSession.stop.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
