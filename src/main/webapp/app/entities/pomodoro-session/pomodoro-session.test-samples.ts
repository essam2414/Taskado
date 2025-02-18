import dayjs from 'dayjs/esm';

import { IPomodoroSession, NewPomodoroSession } from './pomodoro-session.model';

export const sampleWithRequiredData: IPomodoroSession = {
  id: 4956,
  start: dayjs('2025-02-11T10:17'),
};

export const sampleWithPartialData: IPomodoroSession = {
  id: 3542,
  start: dayjs('2025-02-11T00:49'),
  paused: true,
};

export const sampleWithFullData: IPomodoroSession = {
  id: 16920,
  start: dayjs('2025-02-11T06:17'),
  stop: dayjs('2025-02-11T13:40'),
  duration: 26205,
  paused: false,
};

export const sampleWithNewData: NewPomodoroSession = {
  start: dayjs('2025-02-10T22:06'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
