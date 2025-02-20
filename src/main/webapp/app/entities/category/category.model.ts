export interface ICategory {
  id: number;
  name?: string | null;
  color?: string | null;
}

export const CATEGORY_COLORS = [
  { name: 'Red', value: '#e03131' },
  { name: 'Blue', value: '#1c7ed6' },
  { name: 'Green', value: '#2f9e44' },
  { name: 'Yellow', value: '#f59f00' },
  { name: 'Purple', value: '#ae3ec9' },
  { name: 'Orange', value: '#e8590c' },
  { name: 'Pink', value: '#d6336c' },
  { name: 'Teal', value: '#0ca678' },
  { name: 'Brown', value: '#795548' },
  { name: 'Gray', value: '#6c757d' },
];

export type NewCategory = Omit<ICategory, 'id'> & { id: null };
