import dayjs from 'dayjs/esm';

import { IPomodoroSession, NewPomodoroSession } from './pomodoro-session.model';

export const sampleWithRequiredData: IPomodoroSession = {
  id: 6326,
  start: dayjs('2025-02-11T01:03'),
};

export const sampleWithPartialData: IPomodoroSession = {
  id: 32009,
  start: dayjs('2025-02-11T02:38'),
  stop: dayjs('2025-02-11T14:58'),
  duration: 1883,
  paused: true,
};

export const sampleWithFullData: IPomodoroSession = {
  id: 1713,
  start: dayjs('2025-02-10T20:48'),
  stop: dayjs('2025-02-11T17:01'),
  duration: 10404,
  paused: false,
};

export const sampleWithNewData: NewPomodoroSession = {
  start: dayjs('2025-02-10T18:58'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
