import dayjs from 'dayjs/esm';
import { ICategory } from 'app/entities/category/category.model';
import { IUser } from 'app/entities/user/user.model';
import { IProductivityReport } from 'app/entities/productivity-report/productivity-report.model';

export interface IHabit {
  id: number;
  name?: string | null;
  startDate?: dayjs.Dayjs | null;
  streak?: number | null;
  completionRate?: number | null;
  repeatType?: string | null;
  repeatInterval?: number | null;
  repeatDays?: string | null;
  repeatTimes?: string | null;
  completedDates?: string | null;
  category?: ICategory | null;
  user?: Pick<IUser, 'id'> | null;
  productivityReports?: IProductivityReport[] | null;
}

export type NewHabit = Omit<IHabit, 'id'> & { id: null };
