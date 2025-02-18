import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 26036,
  title: 'peppery',
  eventDate: dayjs('2025-01-31T19:28'),
  startTime: dayjs('2025-01-31T18:57'),
  endTime: dayjs('2025-01-31T23:31'),
};

export const sampleWithPartialData: IEvent = {
  id: 8812,
  title: 'nor frequent guilty',
  eventDate: dayjs('2025-02-01T16:01'),
  startTime: dayjs('2025-02-01T04:20'),
  endTime: dayjs('2025-01-31T17:26'),
};

export const sampleWithFullData: IEvent = {
  id: 2818,
  title: 'over whoever bruised',
  description: 'finally legal',
  eventDate: dayjs('2025-02-01T02:25'),
  startTime: dayjs('2025-02-01T00:34'),
  endTime: dayjs('2025-02-01T14:34'),
  location: 'prejudge',
  reminder: false,
};

export const sampleWithNewData: NewEvent = {
  title: 'potentially dearly',
  eventDate: dayjs('2025-02-01T07:39'),
  startTime: dayjs('2025-02-01T12:29'),
  endTime: dayjs('2025-02-01T01:50'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
