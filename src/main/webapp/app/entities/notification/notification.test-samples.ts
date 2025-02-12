import dayjs from 'dayjs/esm';

import { INotification, NewNotification } from './notification.model';

export const sampleWithRequiredData: INotification = {
  id: 28950,
  message: 'likewise',
  notificationType: 'DEADLINE',
  timestamp: dayjs('2025-02-02T16:47'),
  read: false,
  priority: 'MEDIUM',
  status: 'PENDING',
  isRecurring: true,
  sentVia: 'PUSH',
};

export const sampleWithPartialData: INotification = {
  id: 27896,
  message: 'courtroom institute retract',
  notificationType: 'REMINDER',
  timestamp: dayjs('2025-02-02T15:43'),
  read: false,
  priority: 'LOW',
  status: 'SENT',
  expirationDate: dayjs('2025-02-03T02:32'),
  actionURL: 'only unfortunately',
  isRecurring: true,
  sentVia: 'EMAIL',
};

export const sampleWithFullData: INotification = {
  id: 26676,
  message: 'loaf',
  notificationType: 'DEADLINE',
  timestamp: dayjs('2025-02-02T22:30'),
  linkedEntityType: 'turret',
  read: true,
  priority: 'CRITICAL',
  status: 'PENDING',
  expirationDate: dayjs('2025-02-02T18:01'),
  actionURL: 'oof yippee',
  icon: 'popularize',
  isRecurring: true,
  recurrencePattern: 'upbeat',
  sentVia: 'SMS',
};

export const sampleWithNewData: NewNotification = {
  message: 'content or or',
  notificationType: 'SYSTEM_UPDATE',
  timestamp: dayjs('2025-02-03T11:44'),
  read: true,
  priority: 'HIGH',
  status: 'SENT',
  isRecurring: true,
  sentVia: 'SMS',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
