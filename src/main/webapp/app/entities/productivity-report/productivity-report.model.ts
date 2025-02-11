import dayjs from 'dayjs/esm';

export interface IProductivityReport {
  id: number;
  tasksPlanned?: number | null;
  tasksCompleted?: number | null;
  taskAvgCompletionTime?: number | null;
  taskEfficiency?: number | null;
  pomodoroSessions?: number | null;
  distractionsCount?: number | null;
  focusTime?: number | null;
  focusScore?: number | null;
  timestamp?: dayjs.Dayjs | null;
}

export type NewProductivityReport = Omit<IProductivityReport, 'id'> & { id: null };
