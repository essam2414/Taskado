import dayjs from 'dayjs/esm';

import { IPomodoroSession, NewPomodoroSession } from './pomodoro-session.model';

export const sampleWithRequiredData: IPomodoroSession = {
  id: 7613,
  start: dayjs('2025-02-11T09:26'),
  type: 'Meditation',
};

export const sampleWithPartialData: IPomodoroSession = {
  id: 8067,
  start: dayjs('2025-02-11T00:13'),
  duration: 10288,
  type: 'Meditation',
  observations: 'hence woot',
};

export const sampleWithFullData: IPomodoroSession = {
  id: 2261,
  start: dayjs('2025-02-11T10:44'),
  end: dayjs('2025-02-10T19:18'),
  duration: 3018,
  type: 'Standard',
  paused: true,
  observations: 'brilliant',
};

export const sampleWithNewData: NewPomodoroSession = {
  start: dayjs('2025-02-11T17:37'),
  type: 'Standard',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
