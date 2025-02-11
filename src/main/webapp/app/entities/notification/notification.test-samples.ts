import dayjs from 'dayjs/esm';

import { INotification, NewNotification } from './notification.model';

export const sampleWithRequiredData: INotification = {
  id: 28421,
  message: 'furthermore',
  notificationType: 'DEADLINE',
  timestamp: dayjs('2025-02-03T12:01'),
  read: true,
  priority: 'LOW',
  status: 'PENDING',
  isRecurring: true,
  sentVia: 'PUSH',
};

export const sampleWithPartialData: INotification = {
  id: 32114,
  message: 'cheap quash',
  notificationType: 'SYSTEM_UPDATE',
  timestamp: dayjs('2025-02-03T01:31'),
  read: true,
  priority: 'HIGH',
  status: 'FAILED',
  actionURL: 'corny',
  icon: 'how fervently within',
  isRecurring: false,
  recurrencePattern: 'yet',
  sentVia: 'SMS',
};

export const sampleWithFullData: INotification = {
  id: 315,
  message: 'helpfully wonderfully',
  notificationType: 'REMINDER',
  timestamp: dayjs('2025-02-03T04:35'),
  linkedEntityType: 'however growing',
  read: true,
  priority: 'MEDIUM',
  status: 'PENDING',
  expirationDate: dayjs('2025-02-02T21:40'),
  actionURL: 'ew psst',
  icon: 'toward admonish kiddingly',
  isRecurring: false,
  recurrencePattern: 'internalize',
  sentVia: 'EMAIL',
};

export const sampleWithNewData: NewNotification = {
  message: 'after',
  notificationType: 'REMINDER',
  timestamp: dayjs('2025-02-02T23:26'),
  read: true,
  priority: 'CRITICAL',
  status: 'SENT',
  isRecurring: true,
  sentVia: 'SMS',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
