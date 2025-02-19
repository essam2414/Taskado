import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 31791,
  title: 'instead hammock',
  eventDate: dayjs('2025-01-31T22:08'),
  startTime: dayjs('2025-02-01T15:27'),
  endTime: dayjs('2025-01-31T16:17'),
};

export const sampleWithPartialData: IEvent = {
  id: 30007,
  title: 'at midst',
  eventDate: dayjs('2025-01-31T16:43'),
  startTime: dayjs('2025-01-31T19:24'),
  endTime: dayjs('2025-02-01T01:24'),
};

export const sampleWithFullData: IEvent = {
  id: 9670,
  title: 'zowie',
  description: 'as',
  eventDate: dayjs('2025-01-31T18:25'),
  startTime: dayjs('2025-01-31T21:57'),
  endTime: dayjs('2025-01-31T23:59'),
  location: 'hierarchy',
  reminder: true,
};

export const sampleWithNewData: NewEvent = {
  title: 'synthesise gah minor',
  eventDate: dayjs('2025-01-31T19:40'),
  startTime: dayjs('2025-01-31T19:22'),
  endTime: dayjs('2025-02-01T12:36'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
