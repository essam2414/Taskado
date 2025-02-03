import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IEvent {
  id: number;
  title?: string | null;
  description?: string | null;
  eventDate?: dayjs.Dayjs | null;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  location?: string | null;
  reminder?: boolean | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewEvent = Omit<IEvent, 'id'> & { id: null };
