import dayjs from 'dayjs/esm';

import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 19300,
  title: 'though rotten dish',
  dueDate: dayjs('2025-01-31T02:11'),
};

export const sampleWithPartialData: ITask = {
  id: 21838,
  title: 'playfully though or',
  description: 'righteously before',
  dueDate: dayjs('2025-01-31T00:23'),
  priority: 27693,
};

export const sampleWithFullData: ITask = {
  id: 10422,
  title: 'humidity',
  description: 'milestone bracelet',
  dueDate: dayjs('2025-01-31T02:27'),
  priority: 2120,
  completed: false,
};

export const sampleWithNewData: NewTask = {
  title: 'sign frightfully',
  dueDate: dayjs('2025-01-31T14:11'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
