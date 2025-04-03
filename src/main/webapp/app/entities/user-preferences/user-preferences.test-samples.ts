import { IUserPreferences, NewUserPreferences } from './user-preferences.model';

export const sampleWithRequiredData: IUserPreferences = {
  id: 31119,
};

export const sampleWithPartialData: IUserPreferences = {
  id: 4053,
  fontSizeLevel: 30455,
  highContrast: true,
  reduceMotion: false,
};

export const sampleWithFullData: IUserPreferences = {
  id: 5774,
  darkMode: true,
  sidebarColorLight: 'above chops',
  sidebarColorDark: 'when although',
  accentColor: 'even zowie',
  fontSizeLevel: 20996,
  dyslexiaMode: true,
  highContrast: true,
  reduceMotion: true,
};

export const sampleWithNewData: NewUserPreferences = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
