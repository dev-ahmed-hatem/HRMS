import { AssignedEmployee } from "./employee";

export type Attendance = {
  id: number;
  employee: AssignedEmployee;
  date: string;
  check_in: string;
  check_out?: string | null;
};
