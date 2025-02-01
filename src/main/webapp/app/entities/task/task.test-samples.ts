import dayjs from 'dayjs/esm';

import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 7066,
  title: 'at',
  dueDate: dayjs('2025-01-31T06:18'),
};

export const sampleWithPartialData: ITask = {
  id: 8999,
  title: 'doting meh untidy',
  dueDate: dayjs('2025-01-31T07:27'),
  priority: 23681,
  completed: false,
};

export const sampleWithFullData: ITask = {
  id: 24069,
  title: 'solvency',
  description: 'yowza',
  dueDate: dayjs('2025-01-31T16:10'),
  priority: 30883,
  completed: true,
};

export const sampleWithNewData: NewTask = {
  title: 'hoarse tooth',
  dueDate: dayjs('2025-01-31T06:49'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
