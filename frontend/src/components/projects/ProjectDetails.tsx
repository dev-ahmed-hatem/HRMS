// Project Details Component
import { Card, Descriptions } from "antd";
import { Project } from "../../types/project";

const ProjectDetails = ({ project }: { project: Project }) => {
  return (
    <Card title="تفاصيل المشروع" className="shadow-lg rounded-xl">
      <Descriptions bordered column={1}>
        <Descriptions.Item label="اسم المشروع">
          {project.name}
        </Descriptions.Item>
        <Descriptions.Item label="الوصف">
          {project.description}
        </Descriptions.Item>
        <Descriptions.Item label="تاريخ البدء">
          {project.startDate}
        </Descriptions.Item>
        <Descriptions.Item label="تاريخ الانتهاء">
          {project.endDate}
        </Descriptions.Item>
        <Descriptions.Item label="الفريق المسؤول">
          {project.teamMembers.join(", ")}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ProjectDetails;
