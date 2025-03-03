import dayjs from 'dayjs/esm';
import { ICategory } from 'app/entities/category/category.model';
import { IUser } from 'app/entities/user/user.model';

export interface IHabit {
  id: number;
  name?: string | null;
  repeatType?: string | null;
  repeatInterval?: number | null;
  repeatDays?: string | null;
  repeatTimes?: string | null;
  completed?: boolean | null;
  startDate?: dayjs.Dayjs | null;
  streak?: number | null;
  completionRate?: number | null;
  category?: ICategory | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewHabit = Omit<IHabit, 'id'> & { id: null };
