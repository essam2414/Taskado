import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { EventFormService } from '../modal/event-form.service';
import { IEvent } from '../event.model';
import { EventService } from '../service/event.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss'],
})
export class EventModalComponent implements OnInit {
  @Input() event?: IEvent;
  eventForm!: FormGroup;
  isEditMode = false;

  constructor(
    public activeModal: NgbActiveModal,
    private eventFormService: EventFormService,
    private eventService: EventService,
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.event;
    this.eventForm = this.eventFormService.createEventForm(this.event);
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
  /*
  save(): void {
    if (this.eventForm.valid) {
      const eventData: IEvent = {
        ...this.eventForm.value,
        eventDate: dayjs(this.eventForm.value.eventDate), // Convert to Dayjs
        startTime: dayjs(this.eventForm.value.startTime, 'HH:mm'), // Ensure correct format
        endTime: dayjs(this.eventForm.value.endTime, 'HH:mm'),
      };
  
      const request = this.isEditMode
        ? this.eventService.update(eventData)
        : this.eventService.create(eventData);

      request.subscribe(() => this.activeModal.close(eventData));
    }
  }
  */
}
