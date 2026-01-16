export type ProjectStatus =
  | "ongoing"
  | "completed"
  | "pending-approval"
  | "paused";
export type ProjectStatusDisplay =
  | "قيد التنفيذ"
  | "مكتمل"
  | "قيد الموافقة"
  | "متوقف";

export type TaskStatus = "completed" | "incomplete";
export type TaskStatusDisplay = "مكتمل" | "غير مكتمل";

interface BaseAssignment {
  id: number;
  notes?: string;
  assigned_at: string;
  assigned_by: string;
  assigned_by_employee: boolean;
}

export interface ProjectAssignment extends BaseAssignment {
  project: string;
  status: ProjectStatusDisplay;
}

export interface TaskAssignment extends BaseAssignment {
  task: string;
  status: TaskStatusDisplay;
}
