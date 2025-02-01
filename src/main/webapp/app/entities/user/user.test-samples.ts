import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 4944,
  login: 'cb9l',
};

export const sampleWithPartialData: IUser = {
  id: 3323,
  login: 'eiu8@U0D\\=-89\\#2\\"rC263\\Pc',
};

export const sampleWithFullData: IUser = {
  id: 23061,
  login: 'dyYC@YY4P',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
