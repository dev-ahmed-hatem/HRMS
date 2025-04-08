export type Income = {
  id: string;
  date: string; // YYYY-MM-DD format
  category: string; // Selected from predefined options
  description?: string;
  amount: number;
};
