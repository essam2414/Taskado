import dayjs from 'dayjs/esm';

import { IProductivityReport, NewProductivityReport } from './productivity-report.model';

export const sampleWithRequiredData: IProductivityReport = {
  id: 4708,
  focusScore: 9705.37,
  timestamp: dayjs('2025-02-03T18:15'),
};

export const sampleWithPartialData: IProductivityReport = {
  id: 15399,
  tasksPlanned: 5363,
  focusScore: 22360.19,
  timestamp: dayjs('2025-02-04T05:39'),
};

export const sampleWithFullData: IProductivityReport = {
  id: 9203,
  tasksPlanned: 25898,
  tasksCompleted: 1626,
  taskAvgCompletionTime: 32009.99,
  taskEfficiency: 13193.26,
  pomodoroSessions: 24249,
  distractionsCount: 9896,
  focusTime: 18748.4,
  focusScore: 17339.2,
  timestamp: dayjs('2025-02-04T13:44'),
};

export const sampleWithNewData: NewProductivityReport = {
  focusScore: 5865.98,
  timestamp: dayjs('2025-02-04T10:10'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
