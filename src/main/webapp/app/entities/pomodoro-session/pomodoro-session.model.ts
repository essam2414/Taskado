import dayjs from 'dayjs/esm';
import { PomodoroType } from 'app/entities/enumerations/pomodoro-type.model';

export interface IPomodoroSession {
  id: number;
  start?: dayjs.Dayjs | null;
  end?: dayjs.Dayjs | null;
  duration?: number | null;
  type?: keyof typeof PomodoroType | null;
  paused?: boolean | null;
  observations?: string | null;
}

export type NewPomodoroSession = Omit<IPomodoroSession, 'id'> & { id: null };
