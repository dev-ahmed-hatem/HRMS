import {
  Descriptions,
  Card,
  Row,
  Col,
  Badge,
  List,
  Tag,
  Progress,
  Tooltip,
} from "antd";
import { Employee } from "../../types/employee";
import {
  ProjectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  BarChartOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ar";
dayjs.extend(relativeTime);

interface PerformanceProps {
  employee: Employee;
}

const Performance = ({ employee }: PerformanceProps) => {
  const calculatePerformanceMetrics = () => {
    const projects = employee.projects || [];
    const assignedTasks = employee.tasks || [];

    // Calculate metrics
    const totalProjects = projects.length;
    const activeProjects = projects.filter(
      (project) => project.status === "قيد التنفيذ"
    ).length;

    const totalAssignments = assignedTasks.length;
    const activeAssignments = assignedTasks.filter(
      (task) => task.status === "غير مكتمل"
    ).length;

    // Calculate completion rate for tasks
    const completedTasks = assignedTasks.filter(
      (task) => task.status === "مكتمل"
    ).length;
    const taskCompletionRate =
      totalAssignments > 0
        ? Math.round((completedTasks / totalAssignments) * 100)
        : 0;

    // Calculate project completion rate
    const completedProjects = projects.filter(
      (project) => project.status === "مكتمل"
    ).length;
    const projectCompletionRate =
      totalProjects > 0
        ? Math.round((completedProjects / totalProjects) * 100)
        : 0;

    // Get overdue tasks
    const overdueTasks = assignedTasks.filter(
      (task) =>
        task.status === "غير مكتمل" &&
        dayjs(task.due_date).isBefore(dayjs(), "day")
    ).length;

    // Get high priority tasks
    const highPriorityTasks = assignedTasks.filter(
      (task) => task.priority === "مرتفع" && task.status === "غير مكتمل"
    ).length;

    return {
      totalProjects,
      activeProjects,
      totalAssignments,
      activeAssignments,
      completedTasks,
      taskCompletionRate,
      completedProjects,
      projectCompletionRate,
      overdueTasks,
      highPriorityTasks,
      assignedTasks,
      projects,
    };
  };

  const metrics = calculatePerformanceMetrics();

  // Helper to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ongoing":
        return <Badge status="processing" text="قيد التنفيذ" />;
      case "completed":
        return <Badge status="success" text="مكتمل" />;
      case "pending-approval":
        return <Badge status="warning" text="قيد الموافقة" />;
      case "paused":
        return <Badge status="default" text="متوقف" />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  // Helper to get priority tag
  const getPriorityTag = (priority: string) => {
    switch (priority) {
      case "high":
        return <Tag color="red">مرتفع</Tag>;
      case "medium":
        return <Tag color="orange">متوسط</Tag>;
      case "low":
        return <Tag color="green">منخفض</Tag>;
      default:
        return <Tag>{priority}</Tag>;
    }
  };

  return (
    <div className="performance-container">
      <Row gutter={[16, 16]}>
        {/* Summary Cards */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            title={
              <span>
                <ProjectOutlined /> المشاريع
              </span>
            }
            className="performance-card"
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 32, fontWeight: "bold", marginBottom: 8 }}
              >
                {metrics.totalProjects}
              </div>
              <div style={{ color: "#666" }}>
                <CheckCircleOutlined
                  style={{ color: "#52c41a", marginLeft: 4 }}
                />
                {metrics.completedProjects} مكتمل
              </div>
              <div style={{ marginTop: 8 }}>
                <Progress
                  percent={metrics.projectCompletionRate}
                  size="small"
                  strokeColor="#1890ff"
                />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            title={
              <span>
                <ClockCircleOutlined /> المهام
              </span>
            }
            className="performance-card"
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 32, fontWeight: "bold", marginBottom: 8 }}
              >
                {metrics.totalAssignments}
              </div>
              <div style={{ color: "#666" }}>
                <CheckCircleOutlined
                  style={{ color: "#52c41a", marginLeft: 4 }}
                />
                {metrics.completedTasks} مكتمل
              </div>
              <div style={{ marginTop: 8 }}>
                <Progress
                  percent={metrics.taskCompletionRate}
                  size="small"
                  strokeColor="#52c41a"
                />
              </div>
            </div>
          </Card>
        </Col>

        {/* Active Projects List */}
        <Col xs={24}>
          <Card
            title={
              <span>
                <BarChartOutlined /> المشاريع الحالية
              </span>
            }
            className="performance-detail-card"
          >
            {metrics.activeProjects > 0 ? (
              <List
                dataSource={metrics.projects.filter(
                  (p) => p.status === "قيد التنفيذ"
                )}
                renderItem={(project) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <ProjectOutlined
                          style={{ fontSize: 20, color: "#1890ff" }}
                        />
                      }
                      title={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span>{project.name}</span>
                          {getStatusBadge(project.status)}
                        </div>
                      }
                      description={
                        <div>
                          <div>{project.description}</div>
                          <div
                            style={{
                              marginTop: 8,
                              display: "flex",
                              gap: 16,
                              flexWrap: "wrap",
                            }}
                          >
                            <span>
                              <CalendarOutlined /> تاريخ البدء:{" "}
                              {dayjs(project.start_date).format("DD/MM/YYYY")}
                            </span>
                            {project.end_date && (
                              <span>
                                تاريخ الانتهاء:{" "}
                                {dayjs(project.end_date).format("DD/MM/YYYY")}
                              </span>
                            )}
                            <span>
                              الميزانية: {project.budget.toLocaleString()} ر.س
                            </span>
                            {project.client && (
                              <span>العميل: {project.client}</span>
                            )}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
                <ProjectOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>لا توجد مشاريع حالية</div>
              </div>
            )}
          </Card>
        </Col>

        {/* Active Tasks List */}
        <Col xs={24}>
          <Card
            title={
              <span>
                <TrophyOutlined /> المهام الحالية
              </span>
            }
            className="performance-detail-card"
          >
            {metrics.activeAssignments > 0 ? (
              <List
                dataSource={metrics.assignedTasks.filter(
                  (t) => t.status === "غير مكتمل"
                )}
                renderItem={(task) => {
                  const isOverdue = dayjs(task.due_date).isBefore(
                    dayjs(),
                    "day"
                  );
                  return (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              backgroundColor: isOverdue
                                ? "#ff4d4f"
                                : task.priority === "مرتفع"
                                ? "#ff4d4f"
                                : task.priority === "متوسط"
                                ? "#fa8c16"
                                : "#52c41a",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: 16,
                            }}
                          >
                            {task.priority === "مرتفع" ? "!" : "✓"}
                          </div>
                        }
                        title={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>{task.title}</span>
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                              }}
                            >
                              {getPriorityTag(task.priority)}
                              {isOverdue && <Tag color="volcano">متأخرة</Tag>}
                            </div>
                          </div>
                        }
                        description={
                          <div>
                            <div>{task.description}</div>
                            <div
                              style={{
                                marginTop: 8,
                                display: "flex",
                                gap: 16,
                                flexWrap: "wrap",
                              }}
                            >
                              <Tooltip title="تاريخ الاستحقاق">
                                <span>
                                  <CalendarOutlined />
                                  {dayjs(task.due_date).format("DD/MM/YYYY")}
                                  {isOverdue && (
                                    <span
                                      style={{
                                        color: "#ff4d4f",
                                        marginRight: 4,
                                      }}
                                    >
                                      (متأخرة{" "}
                                      {dayjs(task.due_date).fromNow(true)})
                                    </span>
                                  )}
                                </span>
                              </Tooltip>
                              {task.project && (
                                <span>المشروع: {task.project.name}</span>
                              )}
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
                <TrophyOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>لا توجد مهام حالية</div>
              </div>
            )}
          </Card>
        </Col>

        {/* Detailed Statistics */}
        <Col xs={24}>
          <Card title="الإحصائيات التفصيلية">
            <Descriptions
              bordered
              column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="إجمالي المشاريع">
                <span className="text-lg font-semibold">
                  {metrics.totalProjects}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="المشاريع النشطة">
                <Badge
                  count={metrics.activeProjects}
                  style={{ backgroundColor: "#1890ff" }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="معدل إنجاز المشاريع">
                <Progress
                  percent={metrics.projectCompletionRate}
                  size="small"
                  style={{ width: 150 }}
                />
              </Descriptions.Item>

              <Descriptions.Item label="إجمالي المهام">
                <span className="text-lg font-semibold">
                  {metrics.totalAssignments}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="المهام النشطة">
                <Badge
                  count={metrics.activeAssignments}
                  style={{ backgroundColor: "#fa8c16" }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="معدل إنجاز المهام">
                <Progress
                  percent={metrics.taskCompletionRate}
                  size="small"
                  style={{ width: 150 }}
                />
              </Descriptions.Item>

              <Descriptions.Item label="المهام المتأخرة">
                <Tag color="volcano">{metrics.overdueTasks}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="مهام عالية الأولوية">
                <Tag color="red">{metrics.highPriorityTasks}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Performance;
