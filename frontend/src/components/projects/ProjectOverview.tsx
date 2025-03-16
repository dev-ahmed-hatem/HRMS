import { Card, Row, Col, Statistic } from "antd";
import {
  ProjectOutlined,
  CheckCircleOutlined,
  HourglassOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const ProjectsOverview = () => {
  const totalProjects = 120;
  const ongoingProjects = 45;
  const completedProjects = 60;
  const pendingApproval = 15;

  return (
    <Card className="shadow-lg rounded-lg">
      <Row gutter={[16, 16]}>
        {/* Total Projects Section */}
        <Col xs={24} md={6}>
          <Card className="bg-calypso-800 text-white">
            <Statistic
              title={
                <span className="text-white text-base">إجمالي المشاريع</span>
              }
              value={totalProjects}
              valueStyle={{ color: "#fff" }}
              prefix={<ProjectOutlined />}
            />
          </Card>
        </Col>

        {/* Ongoing Projects */}
        <Col xs={24} sm={12} md={6}>
          <Card className="border border-gray-200">
            <Statistic
              title="المشاريع الجارية"
              value={ongoingProjects}
              valueStyle={{ color: "#1890ff" }}
              prefix={<SyncOutlined />}
            />
          </Card>
        </Col>

        {/* Completed Projects */}
        <Col xs={24} sm={12} md={6}>
          <Card className="border border-gray-200">
            <Statistic
              title="المشاريع المكتملة"
              value={completedProjects}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>

        {/* Pending Approval */}
        <Col xs={24} sm={12} md={6}>
          <Card className="border border-gray-200">
            <Statistic
              title="قيد الموافقة"
              value={pendingApproval}
              valueStyle={{ color: "#faad14" }}
              prefix={<HourglassOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default ProjectsOverview;
