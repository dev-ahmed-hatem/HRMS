// Project Details Component
import { Card, Descriptions } from "antd";
import { Project } from "../../types/project";
import { Link } from "react-router";

const ProjectDetails = ({ project }: { project: Project }) => {
  return (
    <Card title="تفاصيل المشروع" className="shadow-lg rounded-xl">
      <Descriptions bordered column={1}>
        <Descriptions.Item label="اسم المشروع">
          {project.name}
        </Descriptions.Item>
        <Descriptions.Item label="العميل">
          {project.client}
        </Descriptions.Item>
        <Descriptions.Item label="الوصف">
          {project.description}
        </Descriptions.Item>
        <Descriptions.Item label="الميزانية">
          {project.budget}
        </Descriptions.Item>
        <Descriptions.Item label="تاريخ البدء">
          {project.start_date}
        </Descriptions.Item>
        <Descriptions.Item label="تاريخ الانتهاء">
          {project.end_date}
        </Descriptions.Item>
        <Descriptions.Item label="المشرفون">
          <div className="flex gap-2">
            {project.supervisors?.map((sup, index, array) => (
              <Link to={`/employees/employee-profile/${sup.id}`} className="underline">
                {sup.name}
                {index + 1 !== array.length && "،"}
              </Link>
            ))}
          </div>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ProjectDetails;
