import { Select, Button, Tag, Table } from "antd";
import { useState } from "react";
import { Task } from "../../types/task";
import { tablePaginationConfig } from "../../utils/antd";
import { useNavigate } from "react-router";

const { Option } = Select;

const ProjectTasks = ({ tasks }: { tasks: Task[] }) => {
  const navigate = useNavigate();
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);

  const handleFilter = () => {
    let filtered = tasks;
    if (filterStatus) {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }
    // if (filterDepartment) {
    //   filtered = filtered.filter(
    //     (task) => task.department === filterDepartment
    //   );
    // }
    setFilteredTasks(filtered);
  };

  const columns = [
    { title: "المهمة", dataIndex: "title", key: "title" },
    { title: "القسم", dataIndex: "department", key: "department" },
    {
      title: "تاريخ التسليم",
      dataIndex: "dueDate",
      key: "dueDate",
      //   sorter: (a, b) => a.dueDate.localeCompare(b.dueDate),
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "مكتمل" ? "green" : status === "متأخر" ? "red" : "gold"
          }
        >
          {status}
        </Tag>
      ),
    },
  ];
  return (
    <>
      <div className="flex gap-4 mb-4 flex-wrap">
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
      </div>
      <Table
        columns={columns}
        onRow={(record) => ({
          onClick: () => navigate(`/tasks/task/${record.id}`),
        })}
        dataSource={filteredTasks}
        rowKey="id"
        pagination={tablePaginationConfig()}
        className="clickable-table calypso-header"
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default ProjectTasks;
