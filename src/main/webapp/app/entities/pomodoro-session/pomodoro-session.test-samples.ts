import dayjs from 'dayjs/esm';

import { IPomodoroSession, NewPomodoroSession } from './pomodoro-session.model';

export const sampleWithRequiredData: IPomodoroSession = {
  id: 2135,
  start: dayjs('2025-02-11T06:41'),
};

export const sampleWithPartialData: IPomodoroSession = {
  id: 18407,
  start: dayjs('2025-02-10T20:42'),
  stop: dayjs('2025-02-11T06:45'),
  duration: 2494,
};

export const sampleWithFullData: IPomodoroSession = {
  id: 24440,
  start: dayjs('2025-02-11T08:50'),
  stop: dayjs('2025-02-11T10:15'),
  duration: 21041,
  paused: true,
};

export const sampleWithNewData: NewPomodoroSession = {
  start: dayjs('2025-02-11T01:00'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
