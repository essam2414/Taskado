import { IUser } from 'app/entities/user/user.model';

export interface ISection {
  id: number;
  name?: string | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewSection = Omit<ISection, 'id'> & { id: null };
