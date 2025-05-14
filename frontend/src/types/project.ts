import { AssignedEmployee } from "./employee";

export type Project = {
  project_id: string;
  id: string;
  name: string;
  status: "قيد التنفيذ" | "مكتمل" | "قيد الموافقة" | "متوقف";
  start_date: string;
  end_date: string;
  assigned_team: string;
  client: string;
  team_members: AssignedEmployee[];
  budget: number;
  description: string;
};
