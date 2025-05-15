import { AssignedEmployee } from "./employee";

export type ProjectStatus = "قيد التنفيذ" | "مكتمل" | "قيد الموافقة" | "متوقف";

export type Project = {
  project_id: string;
  id: string;
  name: string;
  status: ProjectStatus;
  start_date: string;
  end_date: string;
  client: string;
  supervisors?: AssignedEmployee[];
  budget: number;
  description: string;
};

export type ProjectStats = {
  total: number;
  ongoing: number;
  completed: number;
  pending_approval: number;
  overdue: number;
  paused: number;
};
