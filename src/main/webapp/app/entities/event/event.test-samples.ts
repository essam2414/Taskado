import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 18998,
  title: 'despite suitcase',
  eventDate: dayjs('2025-01-31T19:11'),
  startTime: dayjs('2025-01-31T18:28'),
  endTime: dayjs('2025-02-01T06:53'),
};

export const sampleWithPartialData: IEvent = {
  id: 23223,
  title: 'aside for ultimate',
  description: 'incidentally blah drat',
  eventDate: dayjs('2025-01-31T16:27'),
  startTime: dayjs('2025-01-31T19:46'),
  endTime: dayjs('2025-01-31T23:13'),
};

export const sampleWithFullData: IEvent = {
  id: 18624,
  title: 'adviser enrich',
  description: 'eek patiently hammock',
  eventDate: dayjs('2025-02-01T03:16'),
  startTime: dayjs('2025-02-01T09:57'),
  endTime: dayjs('2025-01-31T18:48'),
  location: 'nectarine inhibit boo',
  reminder: false,
};

export const sampleWithNewData: NewEvent = {
  title: 'excluding',
  eventDate: dayjs('2025-01-31T22:11'),
  startTime: dayjs('2025-01-31T23:32'),
  endTime: dayjs('2025-01-31T18:25'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
