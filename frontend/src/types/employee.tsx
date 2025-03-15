export type Employee = {
  id: string;
  name: string;
  gender: "ذكر" | "أنثى";
  email: string;
  phone: string;
  address: string;
  age: number;
  birthDate: string;
  nationalId: string;
  maritalStatus: "أعزب" | "متزوج" | "مطلق" | "أرمل";
  position: string;
  department: string;
  hireDate: string;
  employeeID: string;
  cv?: string;
  avatar?: string;
  mode: "عن بُعد" | "من المقر" | "هجين";

  performance: {
    totalProjects: number;
    activeProjects: number;
    totalAssignments: number;
    activeAssignments: number;
  };

  attendance: {
    date: string;
    checkIn?: string;
    checkOut?: string;
  }[];

  salaryHistory: { date: string; baseSalary: number; bonuses: number }[];
};
