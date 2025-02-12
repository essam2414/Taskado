import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 19038,
  login: 'O$hR@HU6',
};

export const sampleWithPartialData: IUser = {
  id: 4020,
  login: '$n*@5q1',
};

export const sampleWithFullData: IUser = {
  id: 24431,
  login: 'Tk@l9tm\\ AlZcAF\\#w',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
