import React from "react";
import { Card, Avatar, Tabs, Button, Popconfirm, Tag, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getInitials } from "../../utils";
import ProjectDetails from "../../components/projects/ProjectDetails";
import TasksOverview from "../../components/tasks/TasksOverview";
import { Project, ProjectStatus } from "../../types/project";
import { Task } from "../../types/task";
import ProjectTasks from "../../components/projects/ProjectTasks";
import { useNavigate, useParams } from "react-router";
import { useNotification } from "@/providers/NotificationProvider";
import { useGetProjectQuery } from "@/app/api/endpoints/projects";
import Loading from "@/components/Loading";
import { axiosBaseQueryError } from "@/app/api/axiosBaseQuery";
import Error from "../Error";

const project3: Project = {
  id: "P001",
  status: "قيد التنفيذ",
  start_date: "2024-03-01",
  end_date: "2024-06-01",
  supervisors: [
    { name: "روان محمود", id: 2 },
    { name: "محمد أحمد", id: 1 },
  ],
  name: "تطوير نظام إدارة الموارد",
  client: "شركة التقنية الحديثة",
  budget: 50000,
  description: "مشروع تطوير نظام متكامل لإدارة الموارد البشرية.",
  created_at: "2023-1-1",
  created_by: "Dev Ahmed Helal",
};

const tasks: Task[] = [
  {
    id: 1,
    title: "تحليل المتطلبات",
    description: "جمع وتحليل متطلبات المشروع وتوثيقها.",
    departments: [{ name: "تحليل", id: 1 }],
    status: "مكتمل",
    priority: "مرتفع",
    dueDate: "2024-02-10",
    assigned_to: [{ name: "أحمد علي", id: 1 }],
  },
  {
    id: 2,
    title: "تصميم قاعدة البيانات",
    description: "تصميم قاعدة البيانات بما يتناسب مع احتياجات المشروع.",
    status: "متأخر",
    priority: "مرتفع",
    dueDate: "2024-03-15",
    departments: [{ name: "تحليل", id: 1 }],
    assigned_to: [{ name: "أحمد علي", id: 1 }],
  },
  {
    id: 3,
    title: "تطوير الواجهة الأمامية",
    description: "تنفيذ التصميمات وبناء الواجهة الأمامية للموقع.",
    status: "غير مكتمل",
    priority: "متوسط",
    dueDate: "2024-04-20",
    departments: [{ name: "تحليل", id: 1 }],
    assigned_to: [{ name: "أحمد علي", id: 1 }],
  },
  {
    id: 4,
    title: "اختبار النظام",
    description: "إجراء اختبارات على النظام والتأكد من جودته.",
    status: "غير مكتمل",
    priority: "منخفض",
    dueDate: "2024-05-30",
    departments: [{ name: "تحليل", id: 1 }],
    assigned_to: [{ name: "أحمد علي", id: 1 }],
  },
];

const items = (project: Project) => [
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

type StatusOption = {
  value: ProjectStatus;
  color: string;
};

const statusOptions: StatusOption[] = [
  { value: "مكتمل", color: "green" },
  { value: "قيد التنفيذ", color: "blue" },
  { value: "قيد الموافقة", color: "orange" },
  { value: "متوقف", color: "red" },
];

const ProjectProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const notification = useNotification();
  const { project_id } = useParams();

  const {
    data: project,
    isFetching,
    isError,
    error: projectError,
  } = useGetProjectQuery({
    id: project_id as string,
    format: "detailed",
  });

  if (isFetching) return <Loading />;
  if (isError) {
    const error_title =
      (projectError as axiosBaseQueryError).status === 404
        ? "موظف غير موجود! تأكد من كود الموظف المدخل."
        : undefined;

    return <Error subtitle={error_title} reload={error_title === undefined} />;
  }
  return (
    <>
      {/* Project Header */}
      <Card className="shadow-lg rounded-xl">
        <div className="flex items-center justify-between flex-wrap gap-y-6">
          {/* Avatar with Fallback */}
          <div className="flex items-center flex-wrap gap-4">
            <Avatar size={80} className="bg-calypso-700 font-semibold">
              {getInitials(project!.name)}
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{project!.name}</h2>
              <p className="text-gray-500">{project!.client}</p>
            </div>
          </div>

          {/* Status Selector */}
          <div>
            <Select
              value={project!.status}
              onChange={(value) => {
                // handleStatusChange(value);
              }}
              style={{ minWidth: 150 }}
              optionLabelProp="label"
            >
              {statusOptions.map((opt) => (
                <Select.Option
                  key={opt.value}
                  value={opt.value}
                  label={opt.value}
                >
                  <Tag color={opt.color} className="w-full text-center">
                    {opt.value}
                  </Tag>
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* Tabs Section */}
      <Tabs
        className="mt-4"
        defaultActiveKey="1"
        direction="rtl"
        items={items(project!)}
      />

      <div className="flex justify-between mt-2 flex-wrap gap-2">
        {/* Meta Data */}
        <div className="flex gap-1 flex-col text-sm">
          <div>
            <span className="font-medium text-gray-700" dir="rtl">
              تاريخ الإضافة:{" "}
            </span>
            {project!.created_at}
          </div>
          <div>
            <span className="font-medium text-gray-700">بواسطة: </span>
            {project!.created_by || "غير مسجل"}
          </div>
        </div>

        {/* Action Button */}
        <div className="btn-wrapper flex md:justify-end mt-4 flex-wrap gap-4">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              navigate(`/projects/edit/${project_id}`);
            }}
          >
            تعديل البيانات
          </Button>
          <Popconfirm
            title="هل أنت متأكد من حذف هذا الموظف؟"
            // onConfirm={handleDelete}
            okText="نعم"
            cancelText="لا"
          >
            <Button
              className="enabled:bg-red-500 enabled:border-red-500 enabled:shadow-[0_2px_0_rgba(0,58,58,0.31)]
            enabled:hover:border-red-400 enabled:hover:bg-red-400 enabled:text-white"
              icon={<DeleteOutlined />}
              // loading={deleting}
            >
              حذف المشروع
            </Button>
          </Popconfirm>
        </div>
      </div>
    </>
  );
};

export default ProjectProfilePage;
