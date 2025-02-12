import dayjs from 'dayjs/esm';

import { IGoal, NewGoal } from './goal.model';

export const sampleWithRequiredData: IGoal = {
  id: 7689,
  title: 'instead',
  startDate: dayjs('2025-02-04T00:17'),
};

export const sampleWithPartialData: IGoal = {
  id: 16504,
  title: 'poetry although why',
  description: 'worst deform solidly',
  startDate: dayjs('2025-02-03T23:51'),
  endDate: dayjs('2025-02-04T07:45'),
  progress: 14828,
};

export const sampleWithFullData: IGoal = {
  id: 5323,
  title: 'failing',
  description: 'until unabashedly seldom',
  startDate: dayjs('2025-02-04T04:37'),
  endDate: dayjs('2025-02-04T01:08'),
  progress: 27191,
};

export const sampleWithNewData: NewGoal = {
  title: 'busily',
  startDate: dayjs('2025-02-03T22:20'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
