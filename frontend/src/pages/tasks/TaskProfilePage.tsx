import React from "react";
import { Card, Avatar, Tabs, Button, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getInitials, isOverdue } from "@/utils";
import TaskDetails from "@/components/tasks/TaskDetails";
import RelatedTasks from "@/components/tasks/RelatedTasks";
import { statusColors, priorityColors, Task } from "@/types/task";
import { Link, useNavigate, useParams } from "react-router";
import { useNotification } from "@/providers/NotificationProvider";
import { useGetTaskQuery } from "@/app/api/endpoints/tasks";
import Loading from "@/components/Loading";
import { axiosBaseQueryError } from "@/app/api/axiosBaseQuery";
import Error from "@/pages/Error";

const task2: Task = {
  id: 1,
  title: "تحليل المتطلبات",
  description: "جمع وتحليل متطلبات المشروع وتوثيقها.",
  departments: [{ name: "تحليل", id: 32 }],
  status: "مكتمل",
  priority: "مرتفع",
  due_date: "2024-02-10",
  assigned_to: [{ name: "أحمد علي", id: 2 }],
  project: { id: "P001", name: "تطوير نظام إدارة الموارد" },
};

const items = (task: Task) => [
  {
    label: "تفاصيل المهمة",
    key: "1",
    children: <TaskDetails task={task} />,
  },
  {
    label: "مهام مرتبطة",
    key: "2",
    children: <RelatedTasks task={task} />,
  },
];

const TaskProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const notification = useNotification();
  const { task_id } = useParams();

  const {
    data: task,
    isFetching,
    isError,
    error: projectError,
  } = useGetTaskQuery({
    id: task_id as string,
    format: "detailed",
  });

  if (isFetching) return <Loading />;
  if (isError) {
    const error_title =
      (projectError as axiosBaseQueryError).status === 404
        ? "مهمة غير موجودة! تأكد من كود المهمة المدخل."
        : undefined;

    return <Error subtitle={error_title} reload={error_title === undefined} />;
  }
  return (
    <>
      {/* Task Header */}
      <Card className="shadow-lg rounded-xl">
        <div className="flex items-center justify-between flex-wrap gap-y-6">
          {/* Avatar with Fallback */}
          <div className="flex items-center flex-wrap gap-4">
            <Avatar size={80} className="bg-calypso-700 font-semibold">
              {getInitials(task!.title)}
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{task!.title}</h2>
              <p className="text-gray-500">
                {task!.departments.map((dep) => dep.name).join("،")}
              </p>
            </div>
          </div>

          {/* Status & Priority */}
          <div className="flex flex-col gap-2 text-center">
            <Tag className="text-center" color={statusColors[task!.status]}>
              {task!.status}
            </Tag>
            <Tag className="text-center" color={priorityColors[task!.priority]}>
              {task!.priority}
            </Tag>
            {isOverdue(task!.due_date) && task!.status === "غير مكتمل" && (
              <Tag className="text-center" color="red">
                متأخر
              </Tag>
            )}
          </div>

          {/* Project Association */}
          <div>
            {task!.project ? (
              <Link
                to={`/projects/project/${task!.project.id}`}
                className="text-blue-700 hover:underline hover:text-blue-500"
              >
                مرتبط بـ {task!.project.name}
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
        items={items(task!)}
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
