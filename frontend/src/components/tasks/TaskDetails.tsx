import React from "react";
import { Card, Descriptions, Tag } from "antd";
import { Task } from "../../types/task";

interface TaskDetailsProps {
  task: Task;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
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

  return (
    <Card className="shadow-md rounded-xl">
      <Descriptions title="تفاصيل المهمة" bordered column={1}>
        <Descriptions.Item label="الكود">{task.id}</Descriptions.Item>
        <Descriptions.Item label="الاسم">{task.title}</Descriptions.Item>
        <Descriptions.Item label="الوصف">{task.description}</Descriptions.Item>
        <Descriptions.Item label="القسم">{task.department}</Descriptions.Item>
        <Descriptions.Item label="الموعد النهائي">
          {task.dueDate}
        </Descriptions.Item>
        <Descriptions.Item label="فريق العمل">
          {task.assignedTo}
        </Descriptions.Item>
        <Descriptions.Item label="الحالة">
          <Tag color={statusColors[task.status]}>{task.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="الأولوية">
          <Tag color={priorityColors[task.priority]}>{task.priority}</Tag>
        </Descriptions.Item>
        {task.project && (
          <Descriptions.Item label="المشروع المرتبط">
            <Tag color="cyan">{task.project.name}</Tag>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
};

export default TaskDetails;
