import dayjs from 'dayjs/esm';

import { IReminder, NewReminder } from './reminder.model';

export const sampleWithRequiredData: IReminder = {
  id: 5937,
  title: 'lest',
  reminderDate: dayjs('2025-03-10T21:28'),
};

export const sampleWithPartialData: IReminder = {
  id: 8423,
  title: 'inwardly ill-fated',
  reminderDate: dayjs('2025-03-10T05:00'),
  linkedEntityType: 'howl',
};

export const sampleWithFullData: IReminder = {
  id: 16906,
  title: 'frantically',
  description: 'which',
  reminderDate: dayjs('2025-03-10T07:12'),
  repeatType: 'very bracelet ha',
  repeatInterval: 17066,
  linkedEntityType: 'rubric about mostly',
  linkedEntityId: 30823,
};

export const sampleWithNewData: NewReminder = {
  title: 'enlightened boo',
  reminderDate: dayjs('2025-03-10T05:25'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
