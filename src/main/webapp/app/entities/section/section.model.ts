export interface ISection {
  id: number;
  name?: string | null;
}

export type NewSection = Omit<ISection, 'id'> & { id: null };
