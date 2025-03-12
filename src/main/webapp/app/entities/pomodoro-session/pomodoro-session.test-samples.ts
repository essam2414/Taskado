import dayjs from 'dayjs/esm';

import { IPomodoroSession, NewPomodoroSession } from './pomodoro-session.model';

export const sampleWithRequiredData: IPomodoroSession = {
  id: 9925,
  duration: 11298,
  breakDuration: 18557,
  cycles: 23473,
  startTime: dayjs('2025-02-11T14:45'),
  completed: false,
};

export const sampleWithPartialData: IPomodoroSession = {
  id: 4346,
  name: 'bend standard cauliflower',
  duration: 21645,
  breakDuration: 7016,
  cycles: 26219,
  startTime: dayjs('2025-02-11T13:57'),
  completed: true,
};

export const sampleWithFullData: IPomodoroSession = {
  id: 13741,
  name: 'worth',
  duration: 24486,
  breakDuration: 19831,
  longBreakDuration: 32656,
  cycles: 765,
  startTime: dayjs('2025-02-11T10:49'),
  endTime: dayjs('2025-02-10T18:43'),
  completed: false,
};

export const sampleWithNewData: NewPomodoroSession = {
  duration: 1396,
  breakDuration: 12528,
  cycles: 25963,
  startTime: dayjs('2025-02-11T14:28'),
  completed: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
