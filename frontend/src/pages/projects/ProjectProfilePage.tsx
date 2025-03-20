import React from "react";
import { Card, Avatar, Tabs, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getInitials } from "../../utils";
import ProjectDetails from "../../components/projects/ProjectDetails";
import TasksOverview from "../../components/tasks/TasksOverview";
import { Project } from "../../types/project";
import { Task } from "../../types/task";
import ProjectTasks from "../../components/projects/ProjectTasks";

const project: Project = {
  id: "P001",
  status: "قيد التنفيذ",
  startDate: "2024-03-01",
  endDate: "2024-06-01",
  assignedTeam: "فريق التطوير",
  projectID: "PRJ2025",
  name: "تطوير نظام إدارة الموارد",
  client: "شركة التقنية الحديثة",
  teamMembers: ["محمد", "أحمد", "سارة"],
  budget: 50000,
  description: "مشروع تطوير نظام متكامل لإدارة الموارد البشرية.",
};

const tasks: Task[] = [
  {
    id: 1,
    title: "تحليل المتطلبات",
    description: "جمع وتحليل متطلبات المشروع وتوثيقها.",
    department: "تحليل",
    status: "مكتمل",
    priority: "مرتفع",
    dueDate: "2024-02-10",
    assignedTo: "أحمد علي",
  },
  {
    id: 2,
    title: "تصميم قاعدة البيانات",
    description: "تصميم قاعدة البيانات بما يتناسب مع احتياجات المشروع.",
    department: "تطوير",
    status: "متأخر",
    priority: "مرتفع",
    dueDate: "2024-03-15",
    assignedTo: "خالد إبراهيم",
  },
  {
    id: 3,
    title: "تطوير الواجهة الأمامية",
    description: "تنفيذ التصميمات وبناء الواجهة الأمامية للموقع.",
    department: "تطوير",
    status: "غير مكتمل",
    priority: "متوسط",
    dueDate: "2024-04-20",
    assignedTo: "سارة محمد",
  },
  {
    id: 4,
    title: "اختبار النظام",
    description: "إجراء اختبارات على النظام والتأكد من جودته.",
    department: "اختبار",
    status: "غير مكتمل",
    priority: "منخفض",
    dueDate: "2024-05-30",
    assignedTo: "يوسف عبد الله",
  },
];

const ProjectProfilePage: React.FC = () => {
  const items = [
    {
      label: "نظرة عامة على المهام",
      key: "1",
      children: <TasksOverview tasks={tasks} />,
    },
    {
      label: "تفاصيل المشروع",
      key: "2",
      children: <ProjectDetails project={project} />,
    },
    {
      label: "المهام",
      key: "3",
      children: <ProjectTasks tasks={tasks} />,
    },
  ];
  return (
    <>
      {/* Project Header */}
      <Card className="shadow-lg rounded-xl">
        <div className="flex items-center justify-between flex-wrap gap-y-6">
          {/* Avatar with Fallback */}
          <div className="flex items-center flex-wrap gap-4">
            <Avatar size={80} className="bg-calypso-700 font-semibold">
              {getInitials(project.name)}
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{project.name}</h2>
              <p className="text-gray-500">{project.client}</p>
            </div>
          </div>

          {/* Status */}
          <div>
            <Button type="primary">{project.status}</Button>
          </div>
        </div>
      </Card>

      {/* Tabs Section */}
      <Tabs
        className="mt-4"
        defaultActiveKey="1"
        direction="rtl"
        items={items}
      />

      {/* Action Buttons */}
      <div className="flex md:justify-end mt-4 flex-wrap gap-4">
        <Button type="primary" icon={<EditOutlined />}>
          تعديل البيانات
        </Button>
        <Button
          className="enabled:bg-red-500 enabled:border-red-500 enabled:shadow-[0_2px_0_rgba(0,58,58,0.31)]
                enabled:hover:border-red-400 enabled:hover:bg-red-400 enabled:text-white"
          icon={<DeleteOutlined />}
        >
          حذف المشروع
        </Button>
      </div>
    </>
  );
};

export default ProjectProfilePage;
