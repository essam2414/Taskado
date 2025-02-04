import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 19768,
  login: "yY@94F\\'k",
};

export const sampleWithPartialData: IUser = {
  id: 5163,
  login: 'ITox',
};

export const sampleWithFullData: IUser = {
  id: 25643,
  login: '6Ltd@f',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
