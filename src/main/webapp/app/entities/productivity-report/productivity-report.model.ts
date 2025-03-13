import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { ITask } from 'app/entities/task/task.model';
import { IHabit } from 'app/entities/habit/habit.model';

export interface IProductivityReport {
  id: number;
  tasksPlanned?: number | null;
  tasksCompleted?: number | null;
  pomodoroSessionsCompleted?: number | null;
  totalFocusTime?: number | null;
  distractionsCount?: number | null;
  efficiencyScore?: number | null;
  timestamp?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id'> | null;
  completedTasks?: ITask[] | null;
  completedHabits?: IHabit[] | null;
}

export type NewProductivityReport = Omit<IProductivityReport, 'id'> & { id: null };
