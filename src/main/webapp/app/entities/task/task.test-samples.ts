import dayjs from 'dayjs/esm';

import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 21539,
  title: 'well-lit which',
  dueDate: dayjs('2025-01-31T14:00'),
};

export const sampleWithPartialData: ITask = {
  id: 5942,
  title: 'readjust when',
  dueDate: dayjs('2025-01-31T11:12'),
  priority: 'LOW',
  createdAt: dayjs('2025-01-31T18:56'),
};

export const sampleWithFullData: ITask = {
  id: 32419,
  title: 'tool',
  description: 'duh',
  dueDate: dayjs('2025-01-31T07:32'),
  priority: 'LOW',
  category: 'PERSONAL',
  completed: true,
  createdAt: dayjs('2025-01-31T13:30'),
  updatedAt: dayjs('2025-01-31T08:52'),
};

export const sampleWithNewData: NewTask = {
  title: 'republican preregister',
  dueDate: dayjs('2025-01-31T00:42'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
