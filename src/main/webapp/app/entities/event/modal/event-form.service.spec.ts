import { TestBed } from '@angular/core/testing';
import { EventFormService } from './event-form.service';
import { FormBuilder } from '@angular/forms';
import dayjs from 'dayjs';

describe('EventFormService', () => {
  let service: EventFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventFormService, FormBuilder],
    });
    service = TestBed.inject(EventFormService);
  });

  it('should create a form with default values', () => {
    const form = service.createEventForm();
    expect(form.value).toEqual({
      id: null,
      title: '',
      eventDate: '',
      startTime: '',
      endTime: '',
      description: '',
    });
  });

  it('should create a form with given event values', () => {
    const event = {
      id: 1,
      title: 'Test Event',
      eventDate: dayjs('2025-03-05'), // Convert string to Dayjs
      startTime: dayjs('10:00', 'HH:mm'), // Convert time string to Dayjs
      endTime: dayjs('12:00', 'HH:mm'),
      description: 'Sample event',
    };

    const form = service.createEventForm();
    expect(form.value).toEqual({
      ...event,
      eventDate: event.eventDate.toISOString(), // Compare using ISO format
      startTime: event.startTime.format('HH:mm'),
      endTime: event.endTime.format('HH:mm'),
    });
  });
});
