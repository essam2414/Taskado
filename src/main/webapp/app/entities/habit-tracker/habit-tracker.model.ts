import dayjs from 'dayjs/esm';

export interface IHabitTracker {
  id: number;
  name?: string | null;
  repeatFrequency?: string | null;
  startDate?: dayjs.Dayjs | null;
  streak?: number | null;
}

export type NewHabitTracker = Omit<IHabitTracker, 'id'> & { id: null };
