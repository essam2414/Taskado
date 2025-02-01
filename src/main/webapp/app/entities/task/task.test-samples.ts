import dayjs from 'dayjs/esm';

import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 7584,
  title: 'illiterate apologise',
  dueDate: dayjs('2025-01-31T18:57'),
};

export const sampleWithPartialData: ITask = {
  id: 23710,
  title: 'qua',
  dueDate: dayjs('2025-01-31T16:25'),
  priority: 1855,
  completed: false,
};

export const sampleWithFullData: ITask = {
  id: 25556,
  title: 'jubilantly',
  description: 'inasmuch circa jittery',
  dueDate: dayjs('2025-01-31T15:24'),
  priority: 9719,
  completed: false,
};

export const sampleWithNewData: NewTask = {
  title: 'hmph pish notarize',
  dueDate: dayjs('2025-01-30T22:08'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
