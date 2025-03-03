import dayjs from 'dayjs/esm';

import { INote, NewNote } from './note.model';

export const sampleWithRequiredData: INote = {
  id: 30514,
  title: 'frankly boohoo',
  content: '../fake-data/blob/hipster.txt',
  createdAt: dayjs('2025-03-03T02:57'),
};

export const sampleWithPartialData: INote = {
  id: 8001,
  title: 'bookcase wholly tomorrow',
  content: '../fake-data/blob/hipster.txt',
  createdAt: dayjs('2025-03-03T16:00'),
};

export const sampleWithFullData: INote = {
  id: 30759,
  title: 'classic instead liquid',
  content: '../fake-data/blob/hipster.txt',
  createdAt: dayjs('2025-03-03T00:24'),
  uupdatedAt: dayjs('2025-03-03T21:15'),
};

export const sampleWithNewData: NewNote = {
  title: 'boldly even',
  content: '../fake-data/blob/hipster.txt',
  createdAt: dayjs('2025-03-03T15:25'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
