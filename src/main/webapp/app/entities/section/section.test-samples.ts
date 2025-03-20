import { ISection, NewSection } from './section.model';

export const sampleWithRequiredData: ISection = {
  id: 18714,
  name: 'woeful seafood taxicab',
};

export const sampleWithPartialData: ISection = {
  id: 2525,
  name: 'trick fork scientific',
};

export const sampleWithFullData: ISection = {
  id: 29069,
  name: 'except',
};

export const sampleWithNewData: NewSection = {
  name: 'known',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
