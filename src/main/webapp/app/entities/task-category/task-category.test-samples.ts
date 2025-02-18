import { ITaskCategory, NewTaskCategory } from './task-category.model';

export const sampleWithRequiredData: ITaskCategory = {
  id: 16938,
  name: 'psst',
};

export const sampleWithPartialData: ITaskCategory = {
  id: 11012,
  name: 'suspiciously',
};

export const sampleWithFullData: ITaskCategory = {
  id: 28531,
  name: 'if',
};

export const sampleWithNewData: NewTaskCategory = {
  name: 'fluffy gym',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
