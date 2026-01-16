import { Dayjs } from "dayjs";
import { AssignedEmployee } from "./employee";
import { Task, TasksStats } from "./task";
import { BadgeProps } from "antd";

export type ProjectStatus = "قيد التنفيذ" | "مكتمل" | "قيد الموافقة" | "متوقف";

// Status Color Mapping
export const statusColors: Record<Project["status"], string> = {
  "قيد التنفيذ": "blue",
  مكتمل: "green",
  "قيد الموافقة": "gold",
  متوقف: "gray",
};

// Status for antd Badje
export const badgeStatus: Record<Project["status"], BadgeProps["status"]> = {
  "قيد التنفيذ": "processing",
  مكتمل: "success",
  "قيد الموافقة": "warning",
  متوقف: "default",
};

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  start_date: string;
  end_date?: string;
  progress_started?: string;
  client: string;
  supervisors?: AssignedEmployee[];
  budget: number;
  description: string;
  created_at: string;
  created_by: string;
  tasks: Task[];
  stats: TasksStats;
  notes?: string;
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

// form component params
export type ProjectFormParams = {
  initialValues?: Project & { current_supervisors: AssignedEmployee[] };
  projectId?: string;
  onSubmit?: (values: Project) => void;
};

// collected form values
export type ProjectFormValues = Omit<Project, "status"> & {
  start_date: Dayjs;
  end_date: Dayjs;
};
