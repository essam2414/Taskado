import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 4132,
  login: 'p!Y@l-pl\\1H\\4d\\uqVYvK\\pi8\\baM',
};

export const sampleWithPartialData: IUser = {
  id: 32510,
  login: '0vbbYF',
};

export const sampleWithFullData: IUser = {
  id: 8620,
  login: 'xqKo',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
