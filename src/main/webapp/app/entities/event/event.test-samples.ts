import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 32363,
  title: 'euphonium',
  eventDate: dayjs('2025-02-01T01:43'),
  startTime: dayjs('2025-02-01T03:56'),
  endTime: dayjs('2025-01-31T22:51'),
};

export const sampleWithPartialData: IEvent = {
  id: 19705,
  title: 'since',
  eventDate: dayjs('2025-02-01T08:29'),
  startTime: dayjs('2025-01-31T21:23'),
  endTime: dayjs('2025-01-31T18:49'),
  location: 'ugh',
};

export const sampleWithFullData: IEvent = {
  id: 4461,
  title: 'sway',
  description: 'pry',
  eventDate: dayjs('2025-02-01T02:00'),
  startTime: dayjs('2025-02-01T02:26'),
  endTime: dayjs('2025-02-01T11:02'),
  location: 'next oof',
  reminder: false,
};

export const sampleWithNewData: NewEvent = {
  title: 'nerve aggravating quarrelsomely',
  eventDate: dayjs('2025-02-01T10:10'),
  startTime: dayjs('2025-01-31T16:53'),
  endTime: dayjs('2025-02-01T10:45'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
