import dayjs from 'dayjs/esm';

import { IHabit, NewHabit } from './habit.model';

export const sampleWithRequiredData: IHabit = {
  id: 4872,
  name: 'barring',
  repeatFrequency: 'annually yowza um',
  startDate: dayjs('2025-02-01T00:57'),
};

export const sampleWithPartialData: IHabit = {
  id: 25200,
  name: 'uh-huh instead but',
  repeatFrequency: 'gadzooks duh marathon',
  startDate: dayjs('2025-01-31T20:02'),
  streak: 9806,
};

export const sampleWithFullData: IHabit = {
  id: 16737,
  name: 'ultimately brightly sans',
  repeatFrequency: 'mostly',
  startDate: dayjs('2025-01-31T16:13'),
  streak: 19892,
  completionRate: 22301.28,
};

export const sampleWithNewData: NewHabit = {
  name: 'round atop joyously',
  repeatFrequency: 'guzzle',
  startDate: dayjs('2025-02-01T01:43'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
