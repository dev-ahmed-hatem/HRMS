import { Department } from "./department";
import { AssignedEmployee } from "./employee";
import { AssignedProject } from "./project";

export type TaskStatus = "مكتمل" | "غير مكتمل";
export type TaskPriority = "منخفض" | "متوسط" | "مرتفع";

export interface Task {
  id: string | number;
  title: string;
  description?: string;
  departments: Department[];
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  assigned_to: AssignedEmployee[];
  project?: AssignedProject | null;
}

export type TasksStats = {
  total: number;
  completed: number;
  incomplete?: number;
  overdue: number;
  rate: number;
};
