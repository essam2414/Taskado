import { IUserPreferences, NewUserPreferences } from './user-preferences.model';

export const sampleWithRequiredData: IUserPreferences = {
  id: 31119,
};

export const sampleWithPartialData: IUserPreferences = {
  id: 4053,
  accentColor: 'eek',
  reduceMotion: false,
};

export const sampleWithFullData: IUserPreferences = {
  id: 5774,
  darkMode: false,
  sidebarColorLight: 'butter',
  sidebarColorDark: 'camouflage within',
  accentColor: 'because roundabout unnaturally',
  fontSizeLevel: 18780,
  dyslexiaMode: false,
  highContrast: true,
  reduceMotion: true,
  dashboardWidgetsJson: '../fake-data/blob/hipster.txt',
  dashboardTheme: 'hippodrome impractical colorfully',
};

export const sampleWithNewData: NewUserPreferences = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
