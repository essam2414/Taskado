import { ICategory, NewCategory } from './category.model';

export const sampleWithRequiredData: ICategory = {
  id: 639,
  name: 'sternly aha',
  color: 'lime',
};

export const sampleWithPartialData: ICategory = {
  id: 22274,
  name: 'silky',
  color: 'orange',
};

export const sampleWithFullData: ICategory = {
  id: 6610,
  name: 'whenever',
  color: 'sky blue',
};

export const sampleWithNewData: NewCategory = {
  name: 'silk',
  color: 'gold',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
