import { Attendance } from "./attendance";
import { Project } from "./project";
import { Task } from "./task";
import { User } from "./user";

export type Employee = {
  id: number;
  url: string;
  department: string;
  gender: "ذكر" | "أنثى";
  marital_status: "أعزب" | "متزوج" | "مطلق" | "أرمل";
  mode: "عن بُعد" | "من المقر" | "هجين";
  created_by: string;
  name: string;
  email: string;
  phone: string;
  employee_id: string;
  address: string;
  birth_date: string;
  age: number;
  national_id: string;
  position: string;
  hire_date: string;
  cv?: string;
  image?: string;
  is_active: boolean;
  created_at: string;
  user?: User;

  projects?: Project[];
  tasks?: Task[];

  attendance: Partial<Attendance>[];

  salaryHistory: { date: string; baseSalary: number; bonuses: number }[];
};

export interface AssignedEmployee {
  id: number | string;
  name: string;
  is_active: boolean;
  [key: string]: any;
}
