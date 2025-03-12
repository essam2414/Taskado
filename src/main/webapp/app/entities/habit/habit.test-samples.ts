import dayjs from 'dayjs/esm';

import { IHabit, NewHabit } from './habit.model';

export const sampleWithRequiredData: IHabit = {
  id: 9321,
  name: 'weakly burly furthermore',
  startDate: dayjs('2025-01-31T21:13'),
  repeatType: 'reboot mantua but',
};

export const sampleWithPartialData: IHabit = {
  id: 20527,
  name: 'equally eyeglasses',
  startDate: dayjs('2025-01-31T17:23'),
  streak: 16786,
  completionRate: 16391.15,
  repeatType: 'on',
  repeatDays: 'flat',
};

export const sampleWithFullData: IHabit = {
  id: 28353,
  name: 'meh excitable uh-huh',
  startDate: dayjs('2025-02-01T10:47'),
  streak: 5925,
  completionRate: 10331.81,
  repeatType: 'enormously who',
  repeatInterval: 23080,
  repeatDays: 'wherever finally',
  repeatTimes: 'antique phooey',
  completedDates: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewHabit = {
  name: 'next duh inside',
  startDate: dayjs('2025-02-01T03:55'),
  repeatType: 'handy',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
