import dayjs from 'dayjs/esm';

import { IProductivityReport, NewProductivityReport } from './productivity-report.model';

export const sampleWithRequiredData: IProductivityReport = {
  id: 18109,
  focusScore: 12113.13,
  timestamp: dayjs('2025-02-03T20:08'),
};

export const sampleWithPartialData: IProductivityReport = {
  id: 1985,
  tasksPlanned: 32321,
  taskEfficiency: 10921.69,
  pomodoroSessions: 17828,
  focusTime: 16361.41,
  focusScore: 10420.21,
  timestamp: dayjs('2025-02-04T06:55'),
};

export const sampleWithFullData: IProductivityReport = {
  id: 1324,
  tasksPlanned: 10043,
  tasksCompleted: 6511,
  taskAvgCompletionTime: 22784.58,
  taskEfficiency: 32130.52,
  pomodoroSessions: 9524,
  distractionsCount: 5982,
  focusTime: 19260.77,
  focusScore: 23941.18,
  timestamp: dayjs('2025-02-04T03:22'),
};

export const sampleWithNewData: NewProductivityReport = {
  focusScore: 24695.82,
  timestamp: dayjs('2025-02-04T10:01'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
