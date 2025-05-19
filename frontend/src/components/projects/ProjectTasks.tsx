import { Tag, Table, Space } from "antd";
import { priorityColors, statusColors, Task } from "../../types/task";
import { tablePaginationConfig } from "../../utils/antd";
import { Link, useNavigate } from "react-router";
import { ColumnsType } from "antd/lib/table";
import { isOverdue } from "@/utils";
import { dayjs } from "@/utils/locale";

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
    filterOnClose: false,
    onFilter: (value, record) => {
      return value === "متأخر"
        ? isOverdue(record.due_date)
        : record.status === value;
    },
    render: (status: Task["status"], record) => (
      <div className="flex gap-2">
        <Tag color={statusColors[status]}>{status}</Tag>
        {isOverdue(record.due_date) && record.status === "غير مكتمل" && (
          <Tag color="red">متأخر</Tag>
        )}
      </div>
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
    filterOnClose: false,
    onFilter: (value, record) => record.priority === value,
    render: (priority: Task["priority"]) => (
      <Tag color={priorityColors[priority]}>{priority}</Tag>
    ),
  },
  {
    title: "تاريخ الاستحقاق",
    dataIndex: "due_date",
    key: "due_date",
    sorter: (a, b) => dayjs(a.due_date).unix() - dayjs(b.due_date).unix(),
    render: (date) => dayjs(date).format("YYYY-MM-DD"),
  },
];

const ProjectTasks = ({ tasks }: { tasks: Task[] }) => {
  const navigate = useNavigate();
  return (
    <>
      {/* <div className="flex gap-4 mb-4 flex-wrap">
        <Select
          placeholder="تصفية حسب القسم"
          onChange={setFilterDepartment}
          allowClear
        >
          <Option value="تحليل">تحليل</Option>
          <Option value="تطوير">تطوير</Option>
          <Option value="اختبار">اختبار</Option>
        </Select>
        <Select
          placeholder="تصفية حسب الحالة"
          onChange={setFilterStatus}
          allowClear
        >
          <Option value="مكتمل">مكتمل</Option>
          <Option value="قيد التنفيذ">قيد التنفيذ</Option>
          <Option value="غير مكتمل">غير مكتمل</Option>
          <Option value="متأخر">متأخر</Option>
        </Select>
        <Button type="primary" onClick={handleFilter}>
          تطبيق التصفية
        </Button>
      </div> */}
      <Table
        columns={columns}
        onRow={(record) => ({
          onClick: () => navigate(`/tasks/task/${record.id}`),
        })}
        dataSource={tasks}
        rowKey="id"
        pagination={tablePaginationConfig()}
        className="clickable-table calypso-header"
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default ProjectTasks;
