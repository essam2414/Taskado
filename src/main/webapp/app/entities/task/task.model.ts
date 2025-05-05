import dayjs from 'dayjs/esm';
import { ICategory } from 'app/entities/category/category.model';
import { IUser } from 'app/entities/user/user.model';
import { ISection } from 'app/entities/section/section.model';
import { IProductivityReport } from 'app/entities/productivity-report/productivity-report.model';
import { Priority } from 'app/entities/enumerations/priority.model';

export interface ITask {
  id: number;
  title?: string | null;
  description?: string | null;
  dueDate?: dayjs.Dayjs | null;
  priority?: keyof typeof Priority | null;
  completed?: boolean | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  order?: number | null;
  category?: ICategory | null;
  parentTask?: ITask | null;
  user?: Pick<IUser, 'id'> | null;
  section?: ISection | null;
  productivityReports?: IProductivityReport[] | null;
  reminderId?: number | null;
}

export type NewTask = Omit<ITask, 'id'> & { id: null };
