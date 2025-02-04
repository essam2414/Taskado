import dayjs from 'dayjs/esm';

import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 23710,
  title: 'abnormally',
  dueDate: dayjs('2025-01-31T19:33'),
};

export const sampleWithPartialData: ITask = {
  id: 23662,
  title: 'whoever',
  description: 'intrigue spotless',
  dueDate: dayjs('2025-01-31T14:15'),
  priority: 'HIGH',
  completed: false,
  createdAt: dayjs('2025-01-31T17:31'),
};

export const sampleWithFullData: ITask = {
  id: 11556,
  title: 'warming pfft',
  description: 'till where',
  dueDate: dayjs('2025-01-31T21:25'),
  priority: 'MEDIUM',
  category: 'PERSONAL',
  completed: false,
  createdAt: dayjs('2025-01-31T04:23'),
  updatedAt: dayjs('2025-01-31T07:10'),
};

export const sampleWithNewData: NewTask = {
  title: 'considering because ack',
  dueDate: dayjs('2025-01-31T10:24'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
