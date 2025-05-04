import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IEvent } from '../event.model';

@Injectable({ providedIn: 'root' })
export class EventFormService {
  constructor(private fb: FormBuilder) {}

  createEventForm(event?: IEvent): FormGroup {
    return this.fb.group({
      id: [event?.id ?? null],
      title: [event?.title ?? '', [Validators.required]],
      eventDate: [event?.eventDate ?? '', [Validators.required]],
      startTime: [event?.startTime ?? ''],
      endTime: [event?.endTime ?? ''],
      description: [event?.description ?? ''],
    });
  }
}
