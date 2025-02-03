import dayjs from 'dayjs/esm';

import { IHabit, NewHabit } from './habit.model';

export const sampleWithRequiredData: IHabit = {
  id: 26070,
  name: 'perfectly intervention',
  repeatFrequency: 'replicate',
  startDate: dayjs('2025-01-31T16:49'),
};

export const sampleWithPartialData: IHabit = {
  id: 19726,
  name: 'miserable junior opposite',
  repeatFrequency: 'than',
  startDate: dayjs('2025-01-31T21:36'),
  streak: 5907,
  completionRate: 7261.85,
};

export const sampleWithFullData: IHabit = {
  id: 12014,
  name: 'off without',
  repeatFrequency: 'ha shadowbox',
  startDate: dayjs('2025-02-01T05:18'),
  streak: 5623,
  completionRate: 1968.57,
};

export const sampleWithNewData: NewHabit = {
  name: 'plain',
  repeatFrequency: 'manipulate',
  startDate: dayjs('2025-02-01T10:51'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
