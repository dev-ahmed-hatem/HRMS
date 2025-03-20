// Task Type Definition
export type Task = {
  id: string | number;
  title: string;
  description?: string;
  department: string;
  status: "مكتمل" | "غير مكتمل" | "متأخر";
  priority: "منخفض" | "متوسط" | "مرتفع";
  dueDate: string;
  assignedTo: string;
  project?: { id: string; name: string } | null; // Nullable project reference
};
