import dayjs from 'dayjs/esm';
import { ICategory } from 'app/entities/category/category.model';
import { IUser } from 'app/entities/user/user.model';

export interface INote {
  id: number;
  title?: string | null;
  content?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  category?: ICategory | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewNote = Omit<INote, 'id'> & { id: null };
