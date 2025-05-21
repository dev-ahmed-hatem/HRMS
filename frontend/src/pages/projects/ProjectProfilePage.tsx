import React, { useEffect } from "react";
import { Card, Avatar, Tabs, Button, Popconfirm, Tag, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getInitials, isOverdue } from "../../utils";
import ProjectDetails from "../../components/projects/ProjectDetails";
import TasksOverview from "../../components/tasks/TasksOverview";
import { Project, ProjectStatus } from "../../types/project";
import { Task } from "../../types/task";
import ProjectTasks from "../../components/projects/ProjectTasks";
import { useNavigate, useParams } from "react-router";
import { useNotification } from "@/providers/NotificationProvider";
import {
  projectsEndpoints,
  useGetProjectQuery,
  useSwitchProjectStatusMutation,
} from "@/app/api/endpoints/projects";
import Loading from "@/components/Loading";
import { axiosBaseQueryError } from "@/app/api/axiosBaseQuery";
import Error from "../Error";
import { useAppDispatch } from "@/app/redux/hooks";

const tasks: Task[] = [
  {
    id: 1,
    title: "تحليل المتطلبات",
    description: "جمع وتحليل متطلبات المشروع وتوثيقها.",
    departments: [{ name: "تحليل", id: 1 }],
    status: "مكتمل",
    priority: "مرتفع",
    due_date: "2024-02-10",
    assigned_to: [{ name: "أحمد علي", id: 1 }],
  },
  {
    id: 2,
    title: "تصميم قاعدة البيانات",
    description: "تصميم قاعدة البيانات بما يتناسب مع احتياجات المشروع.",
    status: "غير مكتمل",
    priority: "مرتفع",
    due_date: "2024-03-15",
    departments: [{ name: "تحليل", id: 1 }],
    assigned_to: [{ name: "أحمد علي", id: 1 }],
  },
  {
    id: 3,
    title: "تطوير الواجهة الأمامية",
    description: "تنفيذ التصميمات وبناء الواجهة الأمامية للموقع.",
    status: "غير مكتمل",
    priority: "متوسط",
    due_date: "2024-04-20",
    departments: [{ name: "تحليل", id: 1 }],
    assigned_to: [{ name: "أحمد علي", id: 1 }],
  },
  {
    id: 4,
    title: "اختبار النظام",
    description: "إجراء اختبارات على النظام والتأكد من جودته.",
    status: "غير مكتمل",
    priority: "منخفض",
    due_date: "2024-05-30",
    departments: [{ name: "تحليل", id: 1 }],
    assigned_to: [{ name: "أحمد علي", id: 1 }],
  },
];

const items = (project: Project) => [
  {
    label: "نظرة عامة على المهام",
    key: "1",
    children: <TasksOverview stats={project.stats} />,
  },
  {
    label: "تفاصيل المشروع",
    key: "2",
    children: <ProjectDetails project={project} />,
  },
  {
    label: "المهام",
    key: "3",
    children: <ProjectTasks tasks={project.tasks} />,
  },
];

type StatusOption = {
  text: ProjectStatus;
  value: string;
  color: string;
};

const statusOptions: StatusOption[] = [
  { value: "ongoing", text: "قيد التنفيذ", color: "blue" },
  { value: "pending-approval", text: "قيد الموافقة", color: "orange" },
  { value: "paused", text: "متوقف", color: "red" },
];

const ProjectProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const notification = useNotification();
  const { project_id } = useParams();
  const dispatch = useAppDispatch();

  const {
    data: project,
    isFetching,
    isError,
    error: projectError,
  } = useGetProjectQuery({
    id: project_id as string,
    format: "detailed",
  });

  const [
    changeState,
    { data: switchRes, isLoading: switchingState, isError: switchError },
  ] = useSwitchProjectStatusMutation();

  const isProjectOverdue =
    isOverdue(project?.end_date!) &&
    !["مكتمل", "قيد الموافقة"].includes(project?.status as string);

  const handleStatusChange = (value: string) => {
    changeState({ id: project_id!, status: value });
  };

  useEffect(() => {
    if (switchError) {
      notification.error({
        message: "حدث خطأ في تغيير الحالة ! برجاء إعادة المحاولة",
      });
    }
  }, [switchError]);

  useEffect(() => {
    if (switchRes) {
      dispatch(
        projectsEndpoints.util.updateQueryData(
          "getProject",
          { id: project_id as string, format: "detailed" },
          (draft: Project) => {
            draft.status = switchRes.status;
          }
        )
      );
      notification.success({
        message: "تم تغيير الحالة بنجاح",
      });
    }
  }, [switchRes]);

  if (isFetching) return <Loading />;
  if (isError) {
    const error_title =
      (projectError as axiosBaseQueryError).status === 404
        ? "مشروع غير موجود! تأكد من كود الموظف المدخل."
        : undefined;

    return <Error subtitle={error_title} reload={error_title === undefined} />;
  }
  return (
    <>
      {/* Project Header */}
      <Card
        className={`shadow-lg rounded-xl ${
          isProjectOverdue && "border-red-500"
        }`}
      >
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
            {isProjectOverdue && (
              <Tag color="red" className="w-[80px] text-center p-1">
                متأخر
              </Tag>
            )}
            {project?.status === "مكتمل" ? (
              <Tag color="green">مكتمل</Tag>
            ) : (
              <Select
                value={project!.status}
                onChange={(value) => {
                  handleStatusChange(value);
                }}
                style={{ minWidth: 150 }}
                optionLabelProp="label"
                loading={switchingState}
                disabled={switchingState}
              >
                {statusOptions.map((opt) => (
                  <Select.Option
                    key={opt.value}
                    value={opt.value}
                    label={opt.text}
                  >
                    <Tag color={opt.color} className="w-full text-center">
                      {opt.text}
                    </Tag>
                  </Select.Option>
                ))}
              </Select>
            )}
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
