export interface ITaskCategory {
  id: number;
  name?: string | null;
}

export type NewTaskCategory = Omit<ITaskCategory, 'id'> & { id: null };
