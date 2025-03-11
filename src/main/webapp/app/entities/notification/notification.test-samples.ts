import dayjs from 'dayjs/esm';

import { INotification, NewNotification } from './notification.model';

export const sampleWithRequiredData: INotification = {
  id: 23219,
  message: 'linseed midst',
  notificationType: 'REMINDER',
  createdAt: dayjs('2025-03-10T04:09'),
  read: false,
  priority: 'MEDIUM',
  status: 'PENDING',
  sentVia: 'SMS',
};

export const sampleWithPartialData: INotification = {
  id: 13089,
  message: 'greatly less',
  notificationType: 'REMINDER',
  createdAt: dayjs('2025-03-10T08:25'),
  read: false,
  priority: 'LOW',
  status: 'SENT',
  sentVia: 'SMS',
};

export const sampleWithFullData: INotification = {
  id: 9557,
  message: 'pretty switch complete',
  notificationType: 'DEADLINE',
  createdAt: dayjs('2025-03-10T18:22'),
  read: false,
  priority: 'HIGH',
  status: 'SENT',
  sentVia: 'PUSH',
};

export const sampleWithNewData: NewNotification = {
  message: 'which doorpost soft',
  notificationType: 'DEADLINE',
  createdAt: dayjs('2025-03-10T13:15'),
  read: true,
  priority: 'MEDIUM',
  status: 'FAILED',
  sentVia: 'SMS',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
