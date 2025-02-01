import dayjs from 'dayjs/esm';

import { IHabit, NewHabit } from './habit.model';

export const sampleWithRequiredData: IHabit = {
  id: 15535,
  name: 'mild inasmuch',
  repeatFrequency: 'boastfully total meanwhile',
  startDate: dayjs('2025-01-31T20:52'),
};

export const sampleWithPartialData: IHabit = {
  id: 21879,
  name: 'supposing exterior',
  repeatFrequency: 'indeed crumble rarely',
  startDate: dayjs('2025-02-01T12:25'),
  streak: 21023,
};

export const sampleWithFullData: IHabit = {
  id: 28046,
  name: 'analogy',
  repeatFrequency: 'release fast commandeer',
  startDate: dayjs('2025-02-01T12:36'),
  streak: 2113,
  completionRate: 1335,
};

export const sampleWithNewData: NewHabit = {
  name: 'than understanding',
  repeatFrequency: 'agreeable incidentally',
  startDate: dayjs('2025-02-01T00:41'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
