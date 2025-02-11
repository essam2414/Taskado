import dayjs from 'dayjs/esm';

import { IGoal, NewGoal } from './goal.model';

export const sampleWithRequiredData: IGoal = {
  id: 1617,
  title: 'punctually',
  startDate: dayjs('2025-02-04T02:19'),
};

export const sampleWithPartialData: IGoal = {
  id: 28329,
  title: 'graffiti pension',
  description: 'before meh',
  startDate: dayjs('2025-02-03T13:54'),
  endDate: dayjs('2025-02-03T18:11'),
  progress: 1615,
};

export const sampleWithFullData: IGoal = {
  id: 11281,
  title: 'hose',
  description: 'lecture inside both',
  startDate: dayjs('2025-02-04T02:32'),
  endDate: dayjs('2025-02-03T18:54'),
  progress: 9378,
};

export const sampleWithNewData: NewGoal = {
  title: 'limited store',
  startDate: dayjs('2025-02-04T00:27'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
