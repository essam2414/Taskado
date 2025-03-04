import dayjs from 'dayjs/esm';

import { INote, NewNote } from './note.model';

export const sampleWithRequiredData: INote = {
  id: 30514,
  title: 'frankly boohoo',
  content: '../fake-data/blob/hipster.txt',
  createdAt: dayjs('2025-03-03T23:41'),
};

export const sampleWithPartialData: INote = {
  id: 8001,
  title: 'bookcase wholly tomorrow',
  content: '../fake-data/blob/hipster.txt',
  createdAt: dayjs('2025-03-04T12:45'),
};

export const sampleWithFullData: INote = {
  id: 30759,
  title: 'classic instead liquid',
  content: '../fake-data/blob/hipster.txt',
  createdAt: dayjs('2025-03-03T21:09'),
  updatedAt: dayjs('2025-03-04T18:00'),
};

export const sampleWithNewData: NewNote = {
  title: 'boldly even',
  content: '../fake-data/blob/hipster.txt',
  createdAt: dayjs('2025-03-04T12:09'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
