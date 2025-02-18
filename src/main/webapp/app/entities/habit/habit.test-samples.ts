import dayjs from 'dayjs/esm';

import { IHabit, NewHabit } from './habit.model';

export const sampleWithRequiredData: IHabit = {
  id: 15834,
  name: 'frightfully lighthearted sweetly',
  repeatFrequency: 'rare',
  startDate: dayjs('2025-01-31T18:26'),
};

export const sampleWithPartialData: IHabit = {
  id: 17648,
  name: 'signature an',
  repeatFrequency: 'hungrily',
  startDate: dayjs('2025-02-01T04:03'),
  completionRate: 5307.59,
};

export const sampleWithFullData: IHabit = {
  id: 15261,
  name: 'hope',
  repeatFrequency: 'trolley phooey how',
  startDate: dayjs('2025-02-01T10:12'),
  streak: 20241,
  completionRate: 7389.8,
};

export const sampleWithNewData: NewHabit = {
  name: 'proceed stealthily fooey',
  repeatFrequency: 'babushka',
  startDate: dayjs('2025-01-31T22:29'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
