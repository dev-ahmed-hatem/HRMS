import { ProjectStatus } from "./project";
import { TaskPriority, TaskStatus } from "./task";

export type NotificationType = "info" | "warning" | "success" | "error";

export interface DashboardTask {
  id: number | string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  project?: string;
}

export interface DashboardProject {
  id: number | string;
  name: string;
  description?: string;
  status: ProjectStatus;
  progress: number;
  end_date?: string;
  team_size?: number;
}

export interface DashboardNotification {
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
}

export interface DashboardTasks {
  total: number;
  completed: number;

  today_focus: DashboardTask[];
  upcoming: DashboardTask[];
}

export interface DashboardProjects {
  total: number;
  active: number;
  completed_tasks: number;
  total_tasks: number;

  active_projects: DashboardProject[];
}

export interface DashboardData {
  performance_score: number;
  completionRate: number;
  rank: number;

  weekly_performance: number;
  weekly_completed_tasks: number;

  unread_messages: number;

  notifications: DashboardNotification[];

  tasks: DashboardTasks;
  projects: DashboardProjects;
}
