import dayjs from 'dayjs/esm';

import { IProductivityReport, NewProductivityReport } from './productivity-report.model';

export const sampleWithRequiredData: IProductivityReport = {
  id: 13959,
  focusScore: 20718.29,
  timestamp: dayjs('2025-02-03T20:52'),
};

export const sampleWithPartialData: IProductivityReport = {
  id: 13443,
  taskAvgCompletionTime: 23253.62,
  focusScore: 21633.35,
  timestamp: dayjs('2025-02-03T16:10'),
};

export const sampleWithFullData: IProductivityReport = {
  id: 26230,
  tasksPlanned: 6770,
  tasksCompleted: 12710,
  taskAvgCompletionTime: 3903.59,
  taskEfficiency: 12106.03,
  pomodoroSessions: 7155,
  distractionsCount: 32327,
  focusTime: 25024.48,
  focusScore: 19283.04,
  timestamp: dayjs('2025-02-04T10:24'),
};

export const sampleWithNewData: NewProductivityReport = {
  focusScore: 16356.6,
  timestamp: dayjs('2025-02-04T03:20'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
