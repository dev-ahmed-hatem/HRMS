import React from "react";
import { Card, Avatar, Tabs, Button, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getInitials } from "../../utils";
import TaskDetails from "../../components/tasks/TaskDetails";
import RelatedTasks from "../../components/tasks/RelatedTasks";
import { Task } from "../../types/task";
import { Link } from "react-router";

const task: Task = {
  id: 1,
  title: "تحليل المتطلبات",
  description: "جمع وتحليل متطلبات المشروع وتوثيقها.",
  department: "تحليل",
  status: "مكتمل",
  priority: "مرتفع",
  dueDate: "2024-02-10",
  assignedTo: "أحمد علي",
  project: { id: "P001", name: "تطوير نظام إدارة الموارد" }, // Task is linked to a project
};

const TaskProfilePage: React.FC = () => {
  const statusColors: Record<Task["status"], string> = {
    مكتمل: "green",
    "غير مكتمل": "red",
    متأخر: "gold",
  };

  const priorityColors: Record<Task["priority"], string> = {
    منخفض: "blue",
    متوسط: "orange",
    مرتفع: "red",
  };

  const items = [
    {
      label: "تفاصيل المهمة",
      key: "1",
      children: <TaskDetails task={task} />,
    },
    {
      label: "مهام مرتبطة",
      key: "2",
      children: <RelatedTasks taskId={task.id} />,
    },
  ];

  return (
    <>
      {/* Task Header */}
      <Card className="shadow-lg rounded-xl">
        <div className="flex items-center justify-between flex-wrap gap-y-6">
          {/* Avatar with Fallback */}
          <div className="flex items-center flex-wrap gap-4">
            <Avatar size={80} className="bg-calypso-700 font-semibold">
              {getInitials(task.title)}
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{task.title}</h2>
              <p className="text-gray-500">{task.department}</p>
            </div>
          </div>

          {/* Status & Priority */}
          <div className="flex flex-col gap-2 text-center">
            <Tag color={statusColors[task.status]}>{task.status}</Tag>
            <Tag color={priorityColors[task.priority]}>{task.priority}</Tag>
          </div>

          {/* Project Association */}
          <div>
            {task.project ? (
              <Link
                to={`/projects/project/${task.project.id}`}
                className="text-blue-600 hover:underline hover:text-blue-700"
              >
                مرتبط بـ {task.project.name}
              </Link>
            ) : (
              <Tag color="gray">غير مرتبط بمشروع</Tag>
            )}
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
          تعديل المهمة
        </Button>
        <Button
          className="enabled:bg-red-500 enabled:border-red-500 enabled:shadow-[0_2px_0_rgba(0,58,58,0.31)]
                enabled:hover:border-red-400 enabled:hover:bg-red-400 enabled:text-white"
          icon={<DeleteOutlined />}
        >
          حذف المهمة
        </Button>
      </div>
    </>
  );
};

export default TaskProfilePage;
