import dayjs from 'dayjs/esm';

import { INotification, NewNotification } from './notification.model';

export const sampleWithRequiredData: INotification = {
  id: 19266,
  message: 'so instead',
  notificationType: 'SYSTEM_UPDATE',
  timestamp: dayjs('2025-02-03T11:00'),
  read: false,
  priority: 'CRITICAL',
  status: 'PENDING',
  isRecurring: true,
  sentVia: 'PUSH',
};

export const sampleWithPartialData: INotification = {
  id: 22007,
  message: 'enormously rebuff',
  notificationType: 'SYSTEM_UPDATE',
  timestamp: dayjs('2025-02-03T08:30'),
  read: true,
  priority: 'HIGH',
  status: 'PENDING',
  actionURL: 'palatable duh',
  icon: 'aw furthermore',
  isRecurring: false,
  sentVia: 'EMAIL',
};

export const sampleWithFullData: INotification = {
  id: 18273,
  message: 'rotten',
  notificationType: 'DEADLINE',
  timestamp: dayjs('2025-02-02T19:20'),
  linkedEntityType: 'aside',
  read: true,
  priority: 'LOW',
  status: 'SENT',
  expirationDate: dayjs('2025-02-03T03:04'),
  actionURL: 'annually lighthearted',
  icon: 'bah video',
  isRecurring: false,
  recurrencePattern: 'satisfy table',
  sentVia: 'PUSH',
};

export const sampleWithNewData: NewNotification = {
  message: 'savour',
  notificationType: 'SYSTEM_UPDATE',
  timestamp: dayjs('2025-02-02T17:51'),
  read: true,
  priority: 'LOW',
  status: 'SENT',
  isRecurring: true,
  sentVia: 'PUSH',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
