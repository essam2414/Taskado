import dayjs from 'dayjs/esm';

import { INotification, NewNotification } from './notification.model';

export const sampleWithRequiredData: INotification = {
  id: 10266,
  message: 'easily archaeology',
  notificationType: 'REMINDER',
  timestamp: dayjs('2025-02-03T12:29'),
  read: true,
  priority: 'HIGH',
  status: 'PENDING',
  isRecurring: true,
  sentVia: 'PUSH',
};

export const sampleWithPartialData: INotification = {
  id: 15658,
  message: 'athwart',
  notificationType: 'SYSTEM_UPDATE',
  timestamp: dayjs('2025-02-02T19:58'),
  linkedEntityType: 'duh',
  read: false,
  priority: 'MEDIUM',
  status: 'SENT',
  actionURL: 'aw',
  icon: 'blissfully transcend',
  isRecurring: false,
  sentVia: 'SMS',
};

export const sampleWithFullData: INotification = {
  id: 9458,
  message: 'offensively though hence',
  notificationType: 'DEADLINE',
  timestamp: dayjs('2025-02-03T13:53'),
  linkedEntityType: 'where ah',
  read: false,
  priority: 'CRITICAL',
  status: 'PENDING',
  expirationDate: dayjs('2025-02-03T07:32'),
  actionURL: 'ew mythology',
  icon: 'alarmed oh',
  isRecurring: false,
  recurrencePattern: 'immediately',
  sentVia: 'SMS',
};

export const sampleWithNewData: NewNotification = {
  message: 'roughly utterly meanwhile',
  notificationType: 'REMINDER',
  timestamp: dayjs('2025-02-03T03:02'),
  read: false,
  priority: 'CRITICAL',
  status: 'FAILED',
  isRecurring: false,
  sentVia: 'SMS',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
