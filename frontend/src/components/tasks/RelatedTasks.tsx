import React from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Task } from "../../types/task";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router";
import { tablePaginationConfig } from "../../utils/antd";

interface RelatedTasksProps {
  taskId: number | string;
}

const sampleTasks: Task[] = [];

const RelatedTasks: React.FC<RelatedTasksProps> = ({ taskId }) => {
  const navigate = useNavigate();

  // Get current task
  const currentTask = sampleTasks.find((task) => task.id === taskId);
  if (!currentTask || !currentTask.project) {
    return <p className="text-gray-500">هذه المهمة غير مرتبطة بمشروع.</p>;
  }

  // Filter tasks related to the same project
  const relatedTasks = sampleTasks.filter(
    (task) => task.project?.id === currentTask.project?.id && task.id !== taskId
  );

  if (relatedTasks.length === 0) {
    return <p className="text-gray-500">لا توجد مهام مرتبطة أخرى.</p>;
  }

  const columns: ColumnsType<Task> = [
    {
      title: "المهمة",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "القسم",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "الموعد النهائي",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      render: (status: Task["status"]) => {
        const colorMap: Record<Task["status"], string> = {
          مكتمل: "green",
          "غير مكتمل": "red",
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
  ];

  return (
    <Table
      columns={columns}
      onRow={(record) => ({
        onClick: () => navigate(`/tasks/task/${record.id}`),
      })}
      dataSource={relatedTasks}
      rowKey="id"
      pagination={tablePaginationConfig()}
      bordered
      className="calypso-header clickable-table"
      scroll={{ x: "max-content" }}
    />
  );
};

export default RelatedTasks;
