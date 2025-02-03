import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { NotificationType } from 'app/entities/enumerations/notification-type.model';
import { Priority } from 'app/entities/enumerations/priority.model';
import { NotificationStatus } from 'app/entities/enumerations/notification-status.model';
import { NotificationChannel } from 'app/entities/enumerations/notification-channel.model';

export interface INotification {
  id: number;
  message?: string | null;
  notificationType?: keyof typeof NotificationType | null;
  timestamp?: dayjs.Dayjs | null;
  linkedEntityType?: string | null;
  read?: boolean | null;
  priority?: keyof typeof Priority | null;
  status?: keyof typeof NotificationStatus | null;
  expirationDate?: dayjs.Dayjs | null;
  actionURL?: string | null;
  icon?: string | null;
  isRecurring?: boolean | null;
  recurrencePattern?: string | null;
  sentVia?: keyof typeof NotificationChannel | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewNotification = Omit<INotification, 'id'> & { id: null };
