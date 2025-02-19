import { ITaskCategory, NewTaskCategory } from './task-category.model';

export const sampleWithRequiredData: ITaskCategory = {
  id: 6942,
  name: 'apud',
  color: 'turquoise',
};

export const sampleWithPartialData: ITaskCategory = {
  id: 11162,
  name: 'yuck honored till',
  color: 'mint green',
};

export const sampleWithFullData: ITaskCategory = {
  id: 5567,
  name: 'fedora',
  color: 'mint green',
};

export const sampleWithNewData: NewTaskCategory = {
  name: 'yum',
  color: 'grey',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
