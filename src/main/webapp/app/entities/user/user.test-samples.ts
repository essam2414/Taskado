import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 8579,
  login: 'Zz',
};

export const sampleWithPartialData: IUser = {
  id: 28635,
  login: 'lOES@Y\\@u\\|w\\/Os77mn',
};

export const sampleWithFullData: IUser = {
  id: 11971,
  login: 'DP-3',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
