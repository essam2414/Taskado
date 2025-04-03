import { IUser } from 'app/entities/user/user.model';

export interface IUserPreferences {
  id: number;
  darkMode?: boolean | null;
  sidebarColorLight?: string | null;
  sidebarColorDark?: string | null;
  accentColor?: string | null;
  fontSizeLevel?: number | null;
  dyslexiaMode?: boolean | null;
  highContrast?: boolean | null;
  reduceMotion?: boolean | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewUserPreferences = Omit<IUserPreferences, 'id'> & { id: null };
