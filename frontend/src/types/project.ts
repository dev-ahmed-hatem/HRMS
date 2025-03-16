export type Project = {
  id: string;
  name: string;
  status: "قيد التنفيذ" | "مكتمل" | "قيد الموافقة" | "متوقف";
  startDate: string;
  endDate: string;
  assignedTeam: string;
};
