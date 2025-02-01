import dayjs from 'dayjs/esm';

import { IHabit, NewHabit } from './habit.model';

export const sampleWithRequiredData: IHabit = {
  id: 21328,
  name: 'inwardly',
  repeatFrequency: 'than squid',
  startDate: dayjs('2025-02-01T06:05'),
};

export const sampleWithPartialData: IHabit = {
  id: 11779,
  name: 'yowza duh depute',
  repeatFrequency: 'gosh where nor',
  startDate: dayjs('2025-02-01T11:30'),
  completionRate: 19817.3,
};

export const sampleWithFullData: IHabit = {
  id: 25010,
  name: 'cash tired yet',
  repeatFrequency: 'yin',
  startDate: dayjs('2025-01-31T15:59'),
  streak: 31795,
  completionRate: 17010.38,
};

export const sampleWithNewData: NewHabit = {
  name: 'consequently cross inwardly',
  repeatFrequency: 'ack',
  startDate: dayjs('2025-02-01T02:52'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
