import dayjs from 'dayjs/esm';

import { IGoal, NewGoal } from './goal.model';

export const sampleWithRequiredData: IGoal = {
  id: 25605,
  title: 'yet',
  startDate: dayjs('2025-02-04T00:24'),
};

export const sampleWithPartialData: IGoal = {
  id: 15627,
  title: 'basic throughout',
  startDate: dayjs('2025-02-04T01:07'),
  progress: 1497,
};

export const sampleWithFullData: IGoal = {
  id: 29077,
  title: 'roger writhing revere',
  description: 'finally',
  startDate: dayjs('2025-02-04T00:27'),
  endDate: dayjs('2025-02-04T04:05'),
  progress: 24698,
};

export const sampleWithNewData: NewGoal = {
  title: 'towards',
  startDate: dayjs('2025-02-04T08:20'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
