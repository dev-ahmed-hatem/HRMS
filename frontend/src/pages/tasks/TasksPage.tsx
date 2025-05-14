import { Input, Space, Table, Tag } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import { Task } from "../../types/task";
import { tablePaginationConfig } from "../../utils/antd";
import { Link, Outlet, useMatch, useNavigate } from "react-router";
import TasksOverview from "../../components/tasks/TasksOverview";

const sampleTasks: Task[] = [
  {
    id: 1,
    title: "تحليل المتطلبات",
    description: "جمع وتحليل المتطلبات من العميل",
    department: "تحليل",
    status: "مكتمل",
    priority: "مرتفع",
    dueDate: "2024-02-10",
    assigned_to: "أحمد علي",
    project: { id: "P001", name: "مشروع تطوير الموقع" },
  },
  {
    id: 2,
    title: "تصميم قاعدة البيانات",
    description: "إنشاء وتصميم مخطط قاعدة البيانات",
    department: "تطوير",
    status: "متأخر",
    priority: "مرتفع",
    dueDate: "2024-03-15",
    assigned_to: "خالد إبراهيم",
    project: { id: "P001", name: "مشروع تطوير الموقع" },
  },
  {
    id: 3,
    title: "تطوير الواجهة الأمامية",
    description: "بناء واجهة المستخدم باستخدام React",
    department: "تطوير",
    status: "غير مكتمل",
    priority: "متوسط",
    dueDate: "2024-04-20",
    assigned_to: "سارة محمد",
    project: null, // Task is not associated with any project
  },
  {
    id: 4,
    title: "اختبار النظام",
    description: "إجراء اختبارات لضمان جودة المنتج",
    department: "اختبار",
    status: "غير مكتمل",
    priority: "منخفض",
    dueDate: "2024-05-30",
    assigned_to: "ليلى سمير",
    project: { id: "P002", name: "تحليل بيانات السوق" },
  },
];

const TasksPage = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const isTasks = useMatch("/tasks");

  const [tasks, setTasks] = useState<Task[]>(sampleTasks);

  // Search Function
  const onSearch = (value: string) => {
    setSearchText(value);
  };

  // Status & Priority Color Mapping
  const statusColors: Record<Task["status"], string> = {
    مكتمل: "green",
    "غير مكتمل": "gold",
    متأخر: "red",
  };

  const priorityColors: Record<Task["priority"], string> = {
    منخفض: "blue",
    متوسط: "orange",
    مرتفع: "red",
  };

  const columns: ColumnsType<Task> = [
    {
      title: "اسم المهمة",
      dataIndex: "title",
      key: "title",
      render: (value, record) => (
        <Space>
          <span className="flex flex-col">
            <div className="name text-base">{value}</div>
            <div className="id text-xs text-gray-400">#{record.id}</div>
          </span>
        </Space>
      ),
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "مكتمل", value: "مكتمل" },
        { text: "غير مكتمل", value: "غير مكتمل" },
        { text: "متأخر", value: "متأخر" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: Task["status"]) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: "الأولوية",
      dataIndex: "priority",
      key: "priority",
      filters: [
        { text: "منخفض", value: "منخفض" },
        { text: "متوسط", value: "متوسط" },
        { text: "مرتفع", value: "مرتفع" },
      ],
      onFilter: (value, record) => record.priority === value,
      render: (priority: Task["priority"]) => (
        <Tag color={priorityColors[priority]}>{priority}</Tag>
      ),
    },
    {
      title: "المشروع المرتبط",
      dataIndex: "project",
      key: "project",
      render: (project) =>
        project ? (
          <Link
            to={`/projects/project/${project.id}`}
            className="text-blue-600"
          >
            {project.name}
          </Link>
        ) : (
          <Tag color="gray">غير مرتبط</Tag>
        ),
    },
    {
      title: "تاريخ الاستحقاق",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a, b) => dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix(),
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
  ];

  if (!isTasks) return <Outlet />;
  return (
    <div>
      <TasksOverview tasks={tasks} />
      <h1 className="my-6 text-2xl md:text-3xl font-bold">المهام</h1>

      <div className="flex justify-between flex-wrap mb-4">
        <Input
          placeholder="ابحث عن مهمة..."
          prefix={<SearchOutlined />}
          onChange={(e) => onSearch(e.target.value)}
          className="mb-4 w-full max-w-md h-10"
        />

        {/* Add Button */}
        <Link
          to={"/tasks/add"}
          className="h-10 px-6 flex items-center text-white gap-2 rounded-lg
         bg-green-700 hover:bg-green-600 shadow-[0_2px_0_rgba(0,58,58,0.31)]"
        >
          <PlusOutlined />
          <span>إضافة مهمة</span>
        </Link>
      </div>

      <Table
        columns={columns}
        onRow={(record) => ({
          onClick: () => navigate(`task/${record.id}`),
        })}
        dataSource={tasks.filter((t) => t.title.includes(searchText))}
        rowKey="id"
        pagination={tablePaginationConfig()}
        bordered
        scroll={{ x: "max-content" }}
        className="clickable-table calypso-header"
      />
    </div>
  );
};

export default TasksPage;
