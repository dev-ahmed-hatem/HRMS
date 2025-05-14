import { AssignedEmployee } from "./employee";

export type TaskStatus = "مكتمل" | "غير مكتمل" | "متأخر";
export type TaskPriority = "منخفض" | "متوسط" | "مرتفع";

export interface Project {
  id: string;
  name: string;
}

export interface Task {
  id: string | number;
  title: string;
  description?: string;
  department: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assigned_to: AssignedEmployee;
  project?: Project | null;
}
