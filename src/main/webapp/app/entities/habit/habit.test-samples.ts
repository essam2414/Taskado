import dayjs from 'dayjs/esm';

import { IHabit, NewHabit } from './habit.model';

export const sampleWithRequiredData: IHabit = {
  id: 7143,
  name: 'siege rue deploy',
  repeatFrequency: 'valentine successfully swelter',
  startDate: dayjs('2025-01-31T18:30'),
};

export const sampleWithPartialData: IHabit = {
  id: 430,
  name: 'once',
  repeatFrequency: 'highlight submissive',
  startDate: dayjs('2025-01-31T20:50'),
};

export const sampleWithFullData: IHabit = {
  id: 7287,
  name: 'unto',
  repeatFrequency: 'imaginary mid',
  startDate: dayjs('2025-01-31T16:18'),
  streak: 1453,
  completionRate: 6719.86,
};

export const sampleWithNewData: NewHabit = {
  name: 'drat awareness readily',
  repeatFrequency: 'outside like',
  startDate: dayjs('2025-02-01T07:18'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
