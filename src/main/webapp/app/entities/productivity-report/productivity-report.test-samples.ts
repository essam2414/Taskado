import dayjs from 'dayjs/esm';

import { IProductivityReport, NewProductivityReport } from './productivity-report.model';

export const sampleWithRequiredData: IProductivityReport = {
  id: 18931,
  focusScore: 12058.97,
  timestamp: dayjs('2025-02-04T07:02'),
};

export const sampleWithPartialData: IProductivityReport = {
  id: 24935,
  tasksCompleted: 28063,
  taskEfficiency: 18727.53,
  focusTime: 8549.72,
  focusScore: 16597.3,
  timestamp: dayjs('2025-02-04T13:18'),
};

export const sampleWithFullData: IProductivityReport = {
  id: 30813,
  tasksPlanned: 18836,
  tasksCompleted: 10098,
  taskAvgCompletionTime: 9391.03,
  taskEfficiency: 29080.13,
  pomodoroSessions: 1489,
  distractionsCount: 30723,
  focusTime: 21372.97,
  focusScore: 29936.23,
  timestamp: dayjs('2025-02-04T12:32'),
};

export const sampleWithNewData: NewProductivityReport = {
  focusScore: 28766.11,
  timestamp: dayjs('2025-02-03T23:27'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
