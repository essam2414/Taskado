import dayjs from 'dayjs/esm';

import { IProductivityReport, NewProductivityReport } from './productivity-report.model';

export const sampleWithRequiredData: IProductivityReport = {
  id: 13959,
  taskEfficiency: 20718.29,
  focusScore: 7876.39,
  timestamp: dayjs('2025-02-04T12:39'),
};

export const sampleWithPartialData: IProductivityReport = {
  id: 13443,
  tasksCompleted: 23254,
  taskEfficiency: 21633.35,
  focusScore: 1450.97,
  timestamp: dayjs('2025-02-04T10:19'),
};

export const sampleWithFullData: IProductivityReport = {
  id: 6770,
  tasksPlanned: 12710,
  tasksCompleted: 3903,
  taskAvgCompletionTime: 12106.03,
  taskEfficiency: 7155.66,
  pomodoroSuccessRate: 32326.77,
  focusTime: 25024.48,
  focusScore: 19283.04,
  distractionsCount: 26363,
  timestamp: dayjs('2025-02-04T03:05'),
};

export const sampleWithNewData: NewProductivityReport = {
  taskEfficiency: 16699.74,
  focusScore: 20361.03,
  timestamp: dayjs('2025-02-04T11:49'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
