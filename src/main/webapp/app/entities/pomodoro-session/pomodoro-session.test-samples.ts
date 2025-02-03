import dayjs from 'dayjs/esm';

import { IPomodoroSession, NewPomodoroSession } from './pomodoro-session.model';

export const sampleWithRequiredData: IPomodoroSession = {
  id: 7613,
  start: dayjs('2025-02-03T07:17'),
  type: 'Meditation',
};

export const sampleWithPartialData: IPomodoroSession = {
  id: 8067,
  start: dayjs('2025-02-02T22:04'),
  duration: 10288,
  type: 'Meditation',
  observations: 'hence woot',
};

export const sampleWithFullData: IPomodoroSession = {
  id: 2261,
  start: dayjs('2025-02-03T08:34'),
  end: dayjs('2025-02-02T17:08'),
  duration: 3018,
  type: 'Standard',
  paused: true,
  observations: 'brilliant',
};

export const sampleWithNewData: NewPomodoroSession = {
  start: dayjs('2025-02-03T15:27'),
  type: 'Standard',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
