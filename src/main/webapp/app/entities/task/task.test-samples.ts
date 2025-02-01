import dayjs from 'dayjs/esm';

import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 31842,
  title: 'ornate',
  dueDate: dayjs('2025-01-30T21:38'),
};

export const sampleWithPartialData: ITask = {
  id: 3485,
  title: 'athwart',
  dueDate: dayjs('2025-01-31T08:03'),
  priority: 15144,
};

export const sampleWithFullData: ITask = {
  id: 5910,
  title: 'cheerfully failing',
  description: 'given not',
  dueDate: dayjs('2025-01-31T05:27'),
  priority: 15854,
  completed: true,
};

export const sampleWithNewData: NewTask = {
  title: 'tame',
  dueDate: dayjs('2025-01-31T10:24'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
