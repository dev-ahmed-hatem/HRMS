import { Department } from "./department";
import { AssignedEmployee } from "./employee";
import { Project } from "./project";

export type TaskStatus = "مكتمل" | "غير مكتمل" | "متأخر";
export type TaskPriority = "منخفض" | "متوسط" | "مرتفع";

export interface Task {
  id: string | number;
  title: string;
  description?: string;
  departments: Department[];
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assigned_to: AssignedEmployee;
  project?: Project | null;
}
