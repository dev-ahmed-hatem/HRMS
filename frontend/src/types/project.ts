import { AssignedEmployee } from "./employee";

export type ProjectStatus = "قيد التنفيذ" | "مكتمل" | "قيد الموافقة" | "متوقف";

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  start_date: string;
  end_date: string;
  client: string;
  supervisors?: AssignedEmployee[];
  budget: number;
  description: string;
  created_at: string;
  created_by: string;
};

export type ProjectsStats = {
  total: number;
  ongoing: number;
  completed: number;
  pending_approval: number;
  overdue: number;
  paused: number;
};

export type AssignedProject = {
  name: string;
  id: number | string;
  [key: string]: any;
};
