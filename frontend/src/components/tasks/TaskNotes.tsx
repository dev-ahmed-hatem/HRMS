import { Task } from "@/types/task";
import { textify } from "@/utils";
import { Card } from "antd";

const TaskNotes = ({ task }: { task: Task }) => {
  return (
    <Card title="الملاحظات" className="mb-6">
      {textify(task?.notes) ? (
        <p className="text-gray-700 whitespace-pre-line">{task.notes}</p>
      ) : (
        <p className="text-gray-400 italic">لا توجد ملاحظات</p>
      )}
    </Card>
  );
};

export default TaskNotes;
