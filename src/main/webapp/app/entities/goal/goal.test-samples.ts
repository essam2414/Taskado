import dayjs from 'dayjs/esm';

import { IGoal, NewGoal } from './goal.model';

export const sampleWithRequiredData: IGoal = {
  id: 15164,
  title: 'ultimately innocently',
  startDate: dayjs('2025-02-04T11:25'),
};

export const sampleWithPartialData: IGoal = {
  id: 6451,
  title: 'under hence',
  description: 'upright pillow',
  startDate: dayjs('2025-02-04T06:03'),
  progress: 406,
};

export const sampleWithFullData: IGoal = {
  id: 22891,
  title: 'hmph ouch along',
  description: 'scientific yahoo silt',
  startDate: dayjs('2025-02-04T06:37'),
  endDate: dayjs('2025-02-03T15:33'),
  progress: 27343,
};

export const sampleWithNewData: NewGoal = {
  title: 'since peaceful bin',
  startDate: dayjs('2025-02-04T01:58'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
