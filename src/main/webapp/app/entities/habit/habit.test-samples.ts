import dayjs from 'dayjs/esm';

import { IHabit, NewHabit } from './habit.model';

export const sampleWithRequiredData: IHabit = {
  id: 29912,
  name: 'ha cease',
  startDate: dayjs('2025-02-01T06:56'),
  repeatType: 'as resolve',
};

export const sampleWithPartialData: IHabit = {
  id: 13174,
  name: 'declaration to',
  startDate: dayjs('2025-01-31T14:35'),
  streak: 26416,
  repeatType: 'as degenerate decent',
  repeatDays: 'barring beneath',
  repeatTimes: 'remorseful',
};

export const sampleWithFullData: IHabit = {
  id: 10882,
  name: 'quintuple woot meanwhile',
  startDate: dayjs('2025-02-01T07:09'),
  streak: 30883,
  completionRate: 28271.63,
  repeatType: 'boo ah outsource',
  repeatInterval: 20586,
  repeatDays: 'upon',
  repeatTimes: 'psst downshift accomplished',
  completedDates: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewHabit = {
  name: 'nectarine',
  startDate: dayjs('2025-01-31T14:35'),
  repeatType: 'pfft',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
