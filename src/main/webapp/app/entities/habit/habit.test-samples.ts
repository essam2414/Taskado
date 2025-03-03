import dayjs from 'dayjs/esm';

import { IHabit, NewHabit } from './habit.model';

export const sampleWithRequiredData: IHabit = {
  id: 17758,
  name: 'yet monster unless',
  repeatType: 'why',
  completed: true,
  startDate: dayjs('2025-01-31T23:53'),
};

export const sampleWithPartialData: IHabit = {
  id: 8003,
  name: 'following yippee highlight',
  repeatType: 'favorite boo',
  repeatDays: 'numb biodegradable',
  completed: false,
  startDate: dayjs('2025-02-01T03:49'),
  completionRate: 2492.83,
};

export const sampleWithFullData: IHabit = {
  id: 1453,
  name: 'uh-huh',
  repeatType: 'awareness readily',
  repeatInterval: 20219,
  repeatDays: 'present',
  repeatTimes: 'perky',
  completed: true,
  startDate: dayjs('2025-02-01T13:06'),
  streak: 18761,
  completionRate: 30822.96,
};

export const sampleWithNewData: NewHabit = {
  name: 'but',
  repeatType: 'management',
  completed: false,
  startDate: dayjs('2025-02-01T12:43'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
