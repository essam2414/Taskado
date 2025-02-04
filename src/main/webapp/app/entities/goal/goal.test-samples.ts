import dayjs from 'dayjs/esm';

import { IGoal, NewGoal } from './goal.model';

export const sampleWithRequiredData: IGoal = {
  id: 974,
  title: 'boohoo license as',
  startDate: dayjs('2025-02-04T09:01'),
};

export const sampleWithPartialData: IGoal = {
  id: 362,
  title: 'strait form whoever',
  startDate: dayjs('2025-02-03T16:50'),
  progress: 32265,
};

export const sampleWithFullData: IGoal = {
  id: 756,
  title: 'enlightened',
  description: 'damaged reprove',
  startDate: dayjs('2025-02-03T18:27'),
  endDate: dayjs('2025-02-04T01:34'),
  progress: 32542,
};

export const sampleWithNewData: NewGoal = {
  title: 'psst after except',
  startDate: dayjs('2025-02-04T10:05'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
