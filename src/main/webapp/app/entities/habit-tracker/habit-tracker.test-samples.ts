import dayjs from 'dayjs/esm';

import { IHabitTracker, NewHabitTracker } from './habit-tracker.model';

export const sampleWithRequiredData: IHabitTracker = {
  id: 22150,
  name: 'utilization',
  repeatFrequency: 'that including',
  startDate: dayjs('2025-01-31T12:39'),
};

export const sampleWithPartialData: IHabitTracker = {
  id: 10187,
  name: 'intellect',
  repeatFrequency: 'frightfully',
  startDate: dayjs('2025-01-31T20:14'),
  streak: 24641,
};

export const sampleWithFullData: IHabitTracker = {
  id: 24054,
  name: 'premier amongst striking',
  repeatFrequency: 'throughout hateful catalyst',
  startDate: dayjs('2025-01-31T01:32'),
  streak: 29698,
};

export const sampleWithNewData: NewHabitTracker = {
  name: 'how while',
  repeatFrequency: 'until whose',
  startDate: dayjs('2025-01-31T12:44'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
