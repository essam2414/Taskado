import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IPomodoroSession {
  id: number;
  name?: string | null;
  duration?: number | null;
  breakDuration?: number | null;
  longBreakDuration?: number | null;
  cycles?: number | null;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  completed?: boolean | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewPomodoroSession = Omit<IPomodoroSession, 'id'> & { id: null };
