import dayjs from 'dayjs/esm';

import { IHabit, NewHabit } from './habit.model';

export const sampleWithRequiredData: IHabit = {
  id: 30880,
  name: 'every before till',
  repeatFrequency: 'schnitzel',
  startDate: dayjs('2025-02-01T07:52'),
};

export const sampleWithPartialData: IHabit = {
  id: 10675,
  name: 'pfft emphasise nor',
  repeatFrequency: 'gosh',
  startDate: dayjs('2025-01-31T21:19'),
  completionRate: 8307.01,
};

export const sampleWithFullData: IHabit = {
  id: 3883,
  name: 'CD understated yippee',
  repeatFrequency: 'oh suburban contrast',
  startDate: dayjs('2025-01-31T21:05'),
  streak: 2203,
  completionRate: 22574.62,
};

export const sampleWithNewData: NewHabit = {
  name: 'catch indeed',
  repeatFrequency: 'ruin',
  startDate: dayjs('2025-01-31T16:28'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
