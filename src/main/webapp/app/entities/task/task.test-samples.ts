import dayjs from 'dayjs/esm';

import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 28231,
  title: 'valiantly',
  dueDate: dayjs('2025-01-31T00:00'),
};

export const sampleWithPartialData: ITask = {
  id: 18445,
  title: 'upon caption',
  dueDate: dayjs('2025-01-31T06:27'),
};

export const sampleWithFullData: ITask = {
  id: 4086,
  title: 'nearly voluminous',
  description: 'overproduce obligation',
  dueDate: dayjs('2025-01-31T07:32'),
  priority: 21376,
  completed: true,
};

export const sampleWithNewData: NewTask = {
  title: 'demonstrate tightly overload',
  dueDate: dayjs('2025-01-31T00:04'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
