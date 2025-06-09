export type Attendance = {
  id: number;
  employee: string;
  date: string;
  check_in: string;
  check_out?: string | null;
};
