import dayjs from 'dayjs/esm';

import { INotification, NewNotification } from './notification.model';

export const sampleWithRequiredData: INotification = {
  id: 3934,
  message: 'why pfft highly',
  notificationType: 'SYSTEM_UPDATE',
  timestamp: dayjs('2025-02-02T23:10'),
  read: true,
  priority: 'LOW',
  status: 'PENDING',
  isRecurring: false,
  sentVia: 'PUSH',
};

export const sampleWithPartialData: INotification = {
  id: 9793,
  message: 'adventurously tromp into',
  notificationType: 'SYSTEM_UPDATE',
  timestamp: dayjs('2025-02-03T02:39'),
  read: false,
  priority: 'LOW',
  status: 'PENDING',
  expirationDate: dayjs('2025-02-03T01:59'),
  isRecurring: false,
  sentVia: 'SMS',
};

export const sampleWithFullData: INotification = {
  id: 10494,
  message: 'furthermore now',
  notificationType: 'SYSTEM_UPDATE',
  timestamp: dayjs('2025-02-02T23:09'),
  linkedEntityType: 'when fleck next',
  read: true,
  priority: 'CRITICAL',
  status: 'SENT',
  expirationDate: dayjs('2025-02-02T18:15'),
  actionURL: 'leading',
  icon: 'scaffold',
  isRecurring: false,
  recurrencePattern: 'at confound',
  sentVia: 'EMAIL',
};

export const sampleWithNewData: NewNotification = {
  message: 'whose',
  notificationType: 'SYSTEM_UPDATE',
  timestamp: dayjs('2025-02-03T04:01'),
  read: true,
  priority: 'MEDIUM',
  status: 'SENT',
  isRecurring: true,
  sentVia: 'PUSH',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
