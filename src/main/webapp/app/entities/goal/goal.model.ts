import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IGoal {
  id: number;
  title?: string | null;
  description?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  progress?: number | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewGoal = Omit<IGoal, 'id'> & { id: null };
