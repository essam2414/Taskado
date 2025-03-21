import dayjs from 'dayjs/esm';

import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 20406,
  title: 'inwardly solidly recent',
};

export const sampleWithPartialData: ITask = {
  id: 2128,
  title: 'foodstuffs',
  dueDate: dayjs('2025-01-31T10:38'),
  priority: 'MEDIUM',
  createdAt: dayjs('2025-01-31T08:35'),
};

export const sampleWithFullData: ITask = {
  id: 31019,
  title: 'blah wherever',
  description: 'before lightly',
  dueDate: dayjs('2025-01-31T01:09'),
  priority: 'LOW',
  completed: true,
  createdAt: dayjs('2025-01-31T09:22'),
  updatedAt: dayjs('2025-01-31T02:32'),
  order: 27968,
};

export const sampleWithNewData: NewTask = {
  title: 'treasure notwithstanding duh',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
