import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface ITask {
  id: number;
  title?: string | null;
  description?: string | null;
  dueDate?: dayjs.Dayjs | null;
  priority?: number | null;
  completed?: boolean | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewTask = Omit<ITask, 'id'> & { id: null };
