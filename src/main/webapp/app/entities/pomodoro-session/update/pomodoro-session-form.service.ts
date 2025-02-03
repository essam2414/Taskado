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
type FormValueOf<T extends IPomodoroSession | NewPomodoroSession> = Omit<T, 'start' | 'end'> & {
  start?: string | null;
  end?: string | null;
};

type PomodoroSessionFormRawValue = FormValueOf<IPomodoroSession>;

type NewPomodoroSessionFormRawValue = FormValueOf<NewPomodoroSession>;

type PomodoroSessionFormDefaults = Pick<NewPomodoroSession, 'id' | 'start' | 'end' | 'paused'>;

type PomodoroSessionFormGroupContent = {
  id: FormControl<PomodoroSessionFormRawValue['id'] | NewPomodoroSession['id']>;
  start: FormControl<PomodoroSessionFormRawValue['start']>;
  end: FormControl<PomodoroSessionFormRawValue['end']>;
  duration: FormControl<PomodoroSessionFormRawValue['duration']>;
  type: FormControl<PomodoroSessionFormRawValue['type']>;
  paused: FormControl<PomodoroSessionFormRawValue['paused']>;
  observations: FormControl<PomodoroSessionFormRawValue['observations']>;
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
      end: new FormControl(pomodoroSessionRawValue.end),
      duration: new FormControl(pomodoroSessionRawValue.duration),
      type: new FormControl(pomodoroSessionRawValue.type, {
        validators: [Validators.required],
      }),
      paused: new FormControl(pomodoroSessionRawValue.paused),
      observations: new FormControl(pomodoroSessionRawValue.observations),
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
      end: currentTime,
      paused: false,
    };
  }

  private convertPomodoroSessionRawValueToPomodoroSession(
    rawPomodoroSession: PomodoroSessionFormRawValue | NewPomodoroSessionFormRawValue,
  ): IPomodoroSession | NewPomodoroSession {
    return {
      ...rawPomodoroSession,
      start: dayjs(rawPomodoroSession.start, DATE_TIME_FORMAT),
      end: dayjs(rawPomodoroSession.end, DATE_TIME_FORMAT),
    };
  }

  private convertPomodoroSessionToPomodoroSessionRawValue(
    pomodoroSession: IPomodoroSession | (Partial<NewPomodoroSession> & PomodoroSessionFormDefaults),
  ): PomodoroSessionFormRawValue | PartialWithRequiredKeyOf<NewPomodoroSessionFormRawValue> {
    return {
      ...pomodoroSession,
      start: pomodoroSession.start ? pomodoroSession.start.format(DATE_TIME_FORMAT) : undefined,
      end: pomodoroSession.end ? pomodoroSession.end.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
