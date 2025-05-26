import React, { useEffect } from "react";
import { Card, Avatar, Tabs, Button, Tag, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getInitials, isOverdue } from "@/utils";
import TaskDetails from "@/components/tasks/TaskDetails";
import RelatedTasks from "@/components/tasks/RelatedTasks";
import { statusColors, priorityColors, Task } from "@/types/task";
import { Link, useNavigate, useParams } from "react-router";
import { useNotification } from "@/providers/NotificationProvider";
import { useGetTaskQuery, useTaskMutation } from "@/app/api/endpoints/tasks";
import Loading from "@/components/Loading";
import { axiosBaseQueryError } from "@/app/api/axiosBaseQuery";
import Error from "@/pages/Error";

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

  const [
    deleteTask,
    { isError: deleteError, isLoading: deleting, isSuccess: deleted },
  ] = useTaskMutation();

  const handleDelete = () => {
    deleteTask({ url: `projects/tasks/${task_id}/`, method: "DELETE" });
  };

  useEffect(() => {
    if (deleteError) {
      notification.error({
        message: "حدث خطأ أثناء حذف المهمة ! برجاء إعادة المحاولة",
      });
    }
  }, [deleteError]);

  useEffect(() => {
    if (deleted) {
      notification.success({
        message: "تم حذف المهمة بنجاح",
      });

      navigate("/tasks");
    }
  }, [deleted]);

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
                {task!.departments.map((dep) => dep.name).join("، ")}
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

      <div className="flex justify-between mt-2 flex-wrap gap-2">
        {/* Meta Data */}
        <div className="flex gap-1 flex-col text-sm">
          <div>
            <span className="font-medium text-gray-700" dir="rtl">
              تاريخ الإضافة:{" "}
            </span>
            {task!.created_at}
          </div>
          <div>
            <span className="font-medium text-gray-700">بواسطة: </span>
            {task!.created_by || "غير مسجل"}
          </div>
        </div>

        {/* Action Button */}
        <div className="btn-wrapper flex md:justify-end mt-4 flex-wrap gap-4">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              navigate(`/tasks/edit/${task_id}`);
            }}
          >
            تعديل المهمة
          </Button>
          <Popconfirm
            title="هل أنت متأكد من حذف هذا المهمة؟"
            onConfirm={handleDelete}
            okText="نعم"
            cancelText="لا"
          >
            <Button
              className="enabled:bg-red-500 enabled:border-red-500 enabled:shadow-[0_2px_0_rgba(0,58,58,0.31)]
                  enabled:hover:border-red-400 enabled:hover:bg-red-400 enabled:text-white"
              icon={<DeleteOutlined />}
              loading={deleting}
            >
              حذف المهمة
            </Button>
          </Popconfirm>
        </div>
      </div>
    </>
  );
};

export default TaskProfilePage;
