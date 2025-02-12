import dayjs from 'dayjs/esm';

import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 31241,
  title: 'besides ew',
  dueDate: dayjs('2025-01-31T04:40'),
};

export const sampleWithPartialData: ITask = {
  id: 2994,
  title: 'mammoth',
  dueDate: dayjs('2025-01-31T04:04'),
  createdAt: dayjs('2025-01-31T16:09'),
};

export const sampleWithFullData: ITask = {
  id: 23540,
  title: 'sanity',
  description: 'which until given',
  dueDate: dayjs('2025-01-31T00:28'),
  priority: 'LOW',
  category: 'OTHER',
  completed: true,
  createdAt: dayjs('2025-01-31T17:58'),
  updatedAt: dayjs('2025-01-31T20:02'),
};

export const sampleWithNewData: NewTask = {
  title: 'mmm cow',
  dueDate: dayjs('2025-01-31T20:44'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
