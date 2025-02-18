import dayjs from 'dayjs/esm';

import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 18672,
  title: 'eek break wherever',
};

export const sampleWithPartialData: ITask = {
  id: 19326,
  title: 'onto psst',
  description: 'gratefully',
  createdAt: dayjs('2025-01-31T03:58'),
  updatedAt: dayjs('2025-01-31T08:52'),
};

export const sampleWithFullData: ITask = {
  id: 30949,
  title: 'who',
  description: 'impossible',
  dueDate: dayjs('2025-01-31T04:44'),
  priority: 'CRITICAL',
  completed: false,
  createdAt: dayjs('2025-01-31T09:11'),
  updatedAt: dayjs('2025-01-31T06:43'),
};

export const sampleWithNewData: NewTask = {
  title: 'limply volunteer',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
