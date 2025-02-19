import dayjs from 'dayjs/esm';

import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 12837,
  title: 'marten oxygenate',
};

export const sampleWithPartialData: ITask = {
  id: 23152,
  title: 'sadly',
  createdAt: dayjs('2025-01-31T09:38'),
  updatedAt: dayjs('2025-01-31T15:51'),
};

export const sampleWithFullData: ITask = {
  id: 29994,
  title: 'bravely across square',
  description: 'ingratiate instead summarise',
  dueDate: dayjs('2025-01-31T12:47'),
  priority: 'CRITICAL',
  completed: true,
  createdAt: dayjs('2025-01-30T22:33'),
  updatedAt: dayjs('2025-01-31T04:15'),
};

export const sampleWithNewData: NewTask = {
  title: 'iterate how',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
