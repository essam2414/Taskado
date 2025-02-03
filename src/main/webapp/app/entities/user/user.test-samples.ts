import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 16558,
  login: '1L45',
};

export const sampleWithPartialData: IUser = {
  id: 5213,
  login: 'Q9wN',
};

export const sampleWithFullData: IUser = {
  id: 13740,
  login: 'Q3',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
