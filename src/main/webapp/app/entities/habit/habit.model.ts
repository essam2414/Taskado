import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IHabit {
  id: number;
  name?: string | null;
  repeatFrequency?: string | null;
  startDate?: dayjs.Dayjs | null;
  streak?: number | null;
  completionRate?: number | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewHabit = Omit<IHabit, 'id'> & { id: null };
