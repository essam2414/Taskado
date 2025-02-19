export interface ITaskCategory {
  id: number;
  name?: string | null;
  color?: string | null;
}

export type NewTaskCategory = Omit<ITaskCategory, 'id'> & { id: null };
