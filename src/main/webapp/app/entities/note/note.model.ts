import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface INote {
  id: number;
  title?: string | null;
  content?: string | null;
  createdAt?: dayjs.Dayjs | null;
  uupdatedAt?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewNote = Omit<INote, 'id'> & { id: null };
