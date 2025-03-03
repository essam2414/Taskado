import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { INote, NewNote } from '../note.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts INote for edit and NewNoteFormGroupInput for create.
 */
type NoteFormGroupInput = INote | PartialWithRequiredKeyOf<NewNote>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends INote | NewNote> = Omit<T, 'createdAt' | 'uupdatedAt'> & {
  createdAt?: string | null;
  uupdatedAt?: string | null;
};

type NoteFormRawValue = FormValueOf<INote>;

type NewNoteFormRawValue = FormValueOf<NewNote>;

type NoteFormDefaults = Pick<NewNote, 'id' | 'createdAt' | 'uupdatedAt'>;

type NoteFormGroupContent = {
  id: FormControl<NoteFormRawValue['id'] | NewNote['id']>;
  title: FormControl<NoteFormRawValue['title']>;
  content: FormControl<NoteFormRawValue['content']>;
  createdAt: FormControl<NoteFormRawValue['createdAt']>;
  uupdatedAt: FormControl<NoteFormRawValue['uupdatedAt']>;
  user: FormControl<NoteFormRawValue['user']>;
};

export type NoteFormGroup = FormGroup<NoteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class NoteFormService {
  createNoteFormGroup(note: NoteFormGroupInput = { id: null }): NoteFormGroup {
    const noteRawValue = this.convertNoteToNoteRawValue({
      ...this.getFormDefaults(),
      ...note,
    });
    return new FormGroup<NoteFormGroupContent>({
      id: new FormControl(
        { value: noteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(noteRawValue.title, {
        validators: [Validators.required],
      }),
      content: new FormControl(noteRawValue.content, {
        validators: [Validators.required],
      }),
      createdAt: new FormControl(noteRawValue.createdAt, {
        validators: [Validators.required],
      }),
      uupdatedAt: new FormControl(noteRawValue.uupdatedAt),
      user: new FormControl(noteRawValue.user),
    });
  }

  getNote(form: NoteFormGroup): INote | NewNote {
    return this.convertNoteRawValueToNote(form.getRawValue() as NoteFormRawValue | NewNoteFormRawValue);
  }

  resetForm(form: NoteFormGroup, note: NoteFormGroupInput): void {
    const noteRawValue = this.convertNoteToNoteRawValue({ ...this.getFormDefaults(), ...note });
    form.reset(
      {
        ...noteRawValue,
        id: { value: noteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): NoteFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      uupdatedAt: currentTime,
    };
  }

  private convertNoteRawValueToNote(rawNote: NoteFormRawValue | NewNoteFormRawValue): INote | NewNote {
    return {
      ...rawNote,
      createdAt: dayjs(rawNote.createdAt, DATE_TIME_FORMAT),
      uupdatedAt: dayjs(rawNote.uupdatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertNoteToNoteRawValue(
    note: INote | (Partial<NewNote> & NoteFormDefaults),
  ): NoteFormRawValue | PartialWithRequiredKeyOf<NewNoteFormRawValue> {
    return {
      ...note,
      createdAt: note.createdAt ? note.createdAt.format(DATE_TIME_FORMAT) : undefined,
      uupdatedAt: note.uupdatedAt ? note.uupdatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
