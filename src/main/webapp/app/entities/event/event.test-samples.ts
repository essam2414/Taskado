import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 22133,
  title: 'eek',
  eventDate: dayjs('2025-02-01T08:50'),
  startTime: dayjs('2025-01-31T17:17'),
  endTime: dayjs('2025-02-01T04:07'),
};

export const sampleWithPartialData: IEvent = {
  id: 27637,
  title: 'while worth consequently',
  eventDate: dayjs('2025-02-01T16:04'),
  startTime: dayjs('2025-02-01T07:13'),
  endTime: dayjs('2025-01-31T22:28'),
  location: 'on',
};

export const sampleWithFullData: IEvent = {
  id: 30167,
  title: 'meanwhile wry finally',
  description: 'scarification iridescence',
  eventDate: dayjs('2025-02-01T10:51'),
  startTime: dayjs('2025-02-01T02:14'),
  endTime: dayjs('2025-02-01T09:59'),
  location: 'expert',
  reminder: false,
};

export const sampleWithNewData: NewEvent = {
  title: 'slide',
  eventDate: dayjs('2025-01-31T22:05'),
  startTime: dayjs('2025-02-01T06:59'),
  endTime: dayjs('2025-01-31T23:57'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
