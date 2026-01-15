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
  Alert,
  Button,
  Spin,
} from "antd";
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
import { badgeStatus } from "@/types/project";
import { priorityColors } from "@/types/task";
import { useGetEmployeePerformanceQuery } from "@/app/api/endpoints/employees";
import { MdAlarm } from "react-icons/md";
import { useNavigate } from "react-router";
dayjs.extend(relativeTime);

interface PerformanceProps {
  employeeId: number;
}

const Performance = ({ employeeId }: PerformanceProps) => {
  const navigate = useNavigate();
  const { data, isFetching, isError, refetch } =
    useGetEmployeePerformanceQuery(employeeId);

  const projects = data?.projects || [];
  const assignedTasks = data?.tasks || [];

  const calculatePerformanceMetrics = () => {
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
      projects,
      assignedTasks,
    };
  };

  const metrics = calculatePerformanceMetrics();

  if (isFetching)
    return (
      <Card title="الأداء الوظيفي">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 300,
          }}
        >
          <Spin
            size="large"
            tip="جاري تحميل بيانات الأداء..."
            style={{ color: "#1890ff" }}
          />
        </div>
      </Card>
    );

  if (isError)
    return (
      <Card title="الأداء الوظيفي" className="w-full">
        <div className="flex justify-center items-center p-4 md:p-8 lg:p-12 xl:p-16">
          <Alert
            message="خطأ في تحميل البيانات"
            description="حدث خطأ أثناء تحميل بيانات الأداء الوظيفي. يرجى المحاولة مرة أخرى."
            type="error"
            showIcon
            className="w-full max-w-2xl"
            action={
              <Button
                type="primary"
                onClick={() => refetch()}
                loading={isFetching}
                className="mt-4 md:mt-0 md:mr-4"
              >
                إعادة المحاولة
              </Button>
            }
          />
        </div>
      </Card>
    );

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
                  <List.Item
                    className="cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-50 hover:border-blue-100
                     hover:shadow-sm active:bg-blue-100 rounded-lg border-b border-gray-100 last:border-b-0 px-2"
                    onClick={() => {
                      navigate(`/projects/project/${project.id}`);
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <ProjectOutlined className="text-blue-500 text-xl" />
                      }
                      title={
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span className="font-medium text-gray-800 hover:text-blue-600">
                            {project.name}
                          </span>
                          <Badge
                            status={badgeStatus[project.status]}
                            text={project.status}
                            className="self-start sm:self-center"
                          />
                        </div>
                      }
                      description={
                        <div className="mt-2">
                          <div className="text-gray-600 mb-3 line-clamp-2">
                            {project.description}
                          </div>
                          <div className="flex flex-col sm:flex-row flex-wrap gap-3 text-sm text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <CalendarOutlined />
                              <span className="font-medium">تاريخ البدء:</span>
                              {dayjs(project.start_date).format("DD/MM/YYYY")}
                            </span>
                            {project.end_date && (
                              <span className="inline-flex items-center gap-1">
                                <span className="font-medium">
                                  تاريخ الانتهاء:
                                </span>
                                {dayjs(project.end_date).format("DD/MM/YYYY")}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              <span className="font-medium">الميزانية:</span>
                              {project.budget.toLocaleString()} ر.س
                            </span>
                            {project.client && (
                              <span className="inline-flex items-center gap-1">
                                <span className="font-medium">العميل:</span>
                                {project.client}
                              </span>
                            )}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-center py-10 text-gray-400">
                <ProjectOutlined className="text-5xl mb-4" />
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
                    <List.Item
                      className="cursor-pointer transition-all duration-200 ease-in-out hover:bg-orange-50 hover:border-orange-100
                          hover:shadow-sm active:bg-orange-100 rounded-lg border-b border-gray-100 last:border-b-0 px-2"
                      onClick={() => {
                        navigate(`/tasks/task/${task.id}`);
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
                            ${
                              isOverdue
                                ? "bg-red-700" // dark red
                                : task.priority === "مرتفع"
                                ? "bg-red-500" // red
                                : task.priority === "متوسط"
                                ? "bg-amber-500" // amber
                                : "bg-green-500" // green
                            }
                          `}
                          >
                            {isOverdue ? (
                              <MdAlarm className="text-white" />
                            ) : task.priority === "مرتفع" ? (
                              "!"
                            ) : task.priority === "متوسط" ? (
                              "•"
                            ) : (
                              "✓"
                            )}
                          </div>
                        }
                        title={
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <span className="font-medium text-gray-800 hover:text-orange-600">
                              {task.title}
                            </span>
                            <div className="flex flex-wrap gap-2 self-start sm:self-center">
                              <Tag color={priorityColors[task.priority]}>
                                {task.priority}
                              </Tag>
                              {isOverdue && <Tag color="volcano">متأخرة</Tag>}
                            </div>
                          </div>
                        }
                        description={
                          <div className="mt-2">
                            <div className="text-gray-600 mb-3 line-clamp-2">
                              {task.description}
                            </div>
                            <div className="flex flex-col sm:flex-row flex-wrap gap-3 text-sm text-gray-500">
                              <Tooltip title="تاريخ الاستحقاق">
                                <span className="inline-flex items-center gap-1">
                                  <CalendarOutlined />
                                  <span className="font-medium">
                                    تاريخ الاستحقاق:
                                  </span>
                                  {dayjs(task.due_date).format("DD/MM/YYYY")}
                                  {isOverdue && (
                                    <span className="text-red-500 mr-2">
                                      (متأخرة{" "}
                                      {dayjs(task.due_date).fromNow(true)})
                                    </span>
                                  )}
                                </span>
                              </Tooltip>
                              {task.project && (
                                <span className="inline-flex items-center gap-1">
                                  <span className="font-medium">المشروع:</span>
                                  {task.project.name}
                                </span>
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
              <div className="text-center py-10 text-gray-400">
                <TrophyOutlined className="text-5xl mb-4" />
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
