import dayjs from 'dayjs/esm';

import { IProductivityReport, NewProductivityReport } from './productivity-report.model';

export const sampleWithRequiredData: IProductivityReport = {
  id: 30045,
  tasksPlanned: 14221,
  tasksCompleted: 11107,
  pomodoroSessionsCompleted: 2829,
  timestamp: dayjs('2025-03-10T13:20'),
};

export const sampleWithPartialData: IProductivityReport = {
  id: 2760,
  tasksPlanned: 22785,
  tasksCompleted: 1883,
  pomodoroSessionsCompleted: 27339,
  totalFocusTime: 643.53,
  timestamp: dayjs('2025-03-10T12:19'),
};

export const sampleWithFullData: IProductivityReport = {
  id: 20718,
  tasksPlanned: 7876,
  tasksCompleted: 29421,
  pomodoroSessionsCompleted: 32494,
  totalFocusTime: 272.4,
  distractionsCount: 23772,
  efficiencyScore: 78.4,
  timestamp: dayjs('2025-03-10T18:15'),
};

export const sampleWithNewData: NewProductivityReport = {
  tasksPlanned: 25729,
  tasksCompleted: 13443,
  pomodoroSessionsCompleted: 23254,
  timestamp: dayjs('2025-03-10T17:56'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
