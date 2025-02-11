import dayjs from 'dayjs/esm';

import { IHabit, NewHabit } from './habit.model';

export const sampleWithRequiredData: IHabit = {
  id: 13113,
  name: 'tune modulo till',
  repeatFrequency: 'cauliflower afore utterly',
  startDate: dayjs('2025-02-01T06:55'),
};

export const sampleWithPartialData: IHabit = {
  id: 24048,
  name: 'ugh',
  repeatFrequency: 'before',
  startDate: dayjs('2025-02-01T07:13'),
  completionRate: 28389.7,
};

export const sampleWithFullData: IHabit = {
  id: 31683,
  name: 'neglected irritably yowza',
  repeatFrequency: 'crowded',
  startDate: dayjs('2025-02-01T09:02'),
  streak: 10153,
  completionRate: 6997.79,
};

export const sampleWithNewData: NewHabit = {
  name: 'patiently instead lazy',
  repeatFrequency: 'separately',
  startDate: dayjs('2025-02-01T00:33'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
