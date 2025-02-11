import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 28278,
  title: 'before colligate',
  eventDate: dayjs('2025-02-01T00:04'),
  startTime: dayjs('2025-02-01T03:41'),
  endTime: dayjs('2025-02-01T06:28'),
};

export const sampleWithPartialData: IEvent = {
  id: 15955,
  title: 'curl within',
  eventDate: dayjs('2025-01-31T17:32'),
  startTime: dayjs('2025-02-01T09:29'),
  endTime: dayjs('2025-02-01T15:15'),
  reminder: true,
};

export const sampleWithFullData: IEvent = {
  id: 28962,
  title: 'regularly delightfully',
  description: 'velocity',
  eventDate: dayjs('2025-01-31T17:01'),
  startTime: dayjs('2025-01-31T18:34'),
  endTime: dayjs('2025-02-01T02:52'),
  location: 'sandy by',
  reminder: true,
};

export const sampleWithNewData: NewEvent = {
  title: 'after likewise',
  eventDate: dayjs('2025-02-01T10:59'),
  startTime: dayjs('2025-02-01T02:04'),
  endTime: dayjs('2025-01-31T20:18'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
