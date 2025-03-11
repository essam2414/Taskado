import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IReminder {
  id: number;
  title?: string | null;
  description?: string | null;
  reminderDate?: dayjs.Dayjs | null;
  repeatType?: string | null;
  repeatInterval?: number | null;
  linkedEntityType?: string | null;
  linkedEntityId?: number | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewReminder = Omit<IReminder, 'id'> & { id: null };
