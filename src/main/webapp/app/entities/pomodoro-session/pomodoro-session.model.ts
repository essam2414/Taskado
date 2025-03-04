import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IPomodoroSession {
  id: number;
  start?: dayjs.Dayjs | null;
  stop?: dayjs.Dayjs | null;
  duration?: IUser;
  user?: Pick<IUser, 'id'> | null;
}

export type NewPomodoroSession = Omit<IPomodoroSession, 'id'> & { id: null };
