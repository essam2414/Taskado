import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { Priority } from 'app/entities/enumerations/priority.model';
import { TaskCategory } from 'app/entities/enumerations/task-category.model';

export interface ITask {
  id: number;
  title?: string | null;
  description?: string | null;
  dueDate?: dayjs.Dayjs | null;
  priority?: keyof typeof Priority | null;
  category?: keyof typeof TaskCategory | null;
  completed?: boolean | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewTask = Omit<ITask, 'id'> & { id: null };
