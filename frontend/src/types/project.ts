export type Project = {
  projectID: string;
  id: string;
  name: string;
  status: "قيد التنفيذ" | "مكتمل" | "قيد الموافقة" | "متوقف";
  startDate: string;
  endDate: string;
  assignedTeam: string;
  client: string;
  teamMembers: string[];
  budget: number;
  description: string;
};
