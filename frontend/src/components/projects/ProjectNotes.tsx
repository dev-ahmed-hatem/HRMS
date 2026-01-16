import { Project } from "@/types/project";
import { textify } from "@/utils";
import { Card } from "antd";

const ProjectNotes = ({ project }: { project: Project }) => {
  return (
    <Card title="الملاحظات" className="mb-6">
      {textify(project?.notes) ? (
        <p className="text-gray-700 whitespace-pre-line">{project.notes}</p>
      ) : (
        <p className="text-gray-400 italic">لا توجد ملاحظات</p>
      )}
    </Card>
  );
};

export default ProjectNotes;
