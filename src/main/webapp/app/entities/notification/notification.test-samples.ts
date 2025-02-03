import dayjs from 'dayjs/esm';

import { INotification, NewNotification } from './notification.model';

export const sampleWithRequiredData: INotification = {
  id: 18412,
  message: 'soon',
  notificationType: 'DEADLINE',
  timestamp: dayjs('2025-02-03T00:23'),
  read: true,
  priority: 'CRITICAL',
  status: 'PENDING',
  isRecurring: true,
  sentVia: 'SMS',
};

export const sampleWithPartialData: INotification = {
  id: 18298,
  message: 'fat',
  notificationType: 'REMINDER',
  timestamp: dayjs('2025-02-03T07:27'),
  linkedEntityType: 'fat',
  read: false,
  priority: 'LOW',
  status: 'FAILED',
  isRecurring: true,
  sentVia: 'SMS',
};

export const sampleWithFullData: INotification = {
  id: 12191,
  message: 'rust yahoo blindly',
  notificationType: 'DEADLINE',
  timestamp: dayjs('2025-02-03T05:00'),
  linkedEntityType: 'round',
  read: false,
  priority: 'LOW',
  status: 'PENDING',
  expirationDate: dayjs('2025-02-03T09:28'),
  actionURL: 'towards how grok',
  icon: 'uncover sadly',
  isRecurring: true,
  recurrencePattern: 'next happy-go-lucky geez',
  sentVia: 'PUSH',
};

export const sampleWithNewData: NewNotification = {
  message: 'mmm',
  notificationType: 'SYSTEM_UPDATE',
  timestamp: dayjs('2025-02-03T10:02'),
  read: true,
  priority: 'LOW',
  status: 'PENDING',
  isRecurring: true,
  sentVia: 'SMS',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
