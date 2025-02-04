import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 9531,
  title: 'fortunate thankfully',
  eventDate: dayjs('2025-02-01T11:53'),
  startTime: dayjs('2025-02-01T07:13'),
  endTime: dayjs('2025-01-31T22:35'),
};

export const sampleWithPartialData: IEvent = {
  id: 25123,
  title: 'confused',
  description: 'tribe per word',
  eventDate: dayjs('2025-02-01T02:53'),
  startTime: dayjs('2025-02-01T00:32'),
  endTime: dayjs('2025-02-01T05:22'),
  location: 'afterwards after',
  reminder: true,
};

export const sampleWithFullData: IEvent = {
  id: 7697,
  title: 'swing geez oof',
  description: 'babyish whoa',
  eventDate: dayjs('2025-01-31T16:47'),
  startTime: dayjs('2025-02-01T12:20'),
  endTime: dayjs('2025-02-01T14:23'),
  location: 'victoriously intermarry',
  reminder: true,
};

export const sampleWithNewData: NewEvent = {
  title: 'tail generously',
  eventDate: dayjs('2025-02-01T06:46'),
  startTime: dayjs('2025-01-31T16:18'),
  endTime: dayjs('2025-01-31T18:23'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
