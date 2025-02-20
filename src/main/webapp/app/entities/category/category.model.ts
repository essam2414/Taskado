export interface ICategory {
  id: number;
  name?: string | null;
  color?: string | null;
}

export const CATEGORY_COLORS = [
  { name: 'Soft Red', value: '#FF6B6B' },
  { name: 'Sky Blue', value: '#4DABF7' },
  { name: 'Mint Green', value: '#63E6BE' },
  { name: 'Warm Yellow', value: '#FFD43B' },
  { name: 'Lavender', value: '#B197FC' },
  { name: 'Peach Orange', value: '#FF922B' },
  { name: 'Rose Pink', value: '#FF758F' },
  { name: 'Aqua Teal', value: '#20C997' },
  { name: 'Coffee Brown', value: '#AC8E68' },
  { name: 'Cool Gray', value: '#868E96' },
];

export type NewCategory = Omit<ICategory, 'id'> & { id: null };
