import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Avatar,
  Progress,
  List,
  Tag,
  Badge,
  Divider,
  Button,
  Tooltip,
  Space,
  Alert,
  Timeline,
} from "antd";
import {
  ProjectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  TrophyOutlined,
  BarChartOutlined,
  AlertOutlined,
  StarOutlined,
  RocketOutlined,
  CoffeeOutlined,
  BellOutlined,
  MailOutlined,
  ScheduleOutlined,
  HourglassOutlined,
  FireOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import Loading from "@/components/Loading";
import ErrorPage from "@/pages/Error";
import { useAppSelector } from "@/app/redux/hooks";
import type { Project } from "@/types/project";
import { Task } from "@/types/task";

const MOCK_DASHBOARD = {
  employee: {
    id: 1,
    name: "أحمد محمد",
    employee_id: "EMP-1024",
    position: "مهندس برمجيات",
    image: null,
    department: {
      id: 1,
      name: "تقنية المعلومات",
    },
    hire_date: "2022-03-15",
    tenure: 680,

    performance_score: 87,
    rank: 2,

    weekly_performance: 78,
    weekly_completed_tasks: 6,

    avg_completion_time: 18,
    quality_score: 92,
    collaboration_score: 88,

    unread_messages: 3,

    notifications: [
      {
        title: "مهمة جديدة",
        message: "تم إسناد مهمة جديدة لك",
        type: "info",
        link: "/tasks/1",
      },
      {
        title: "تأخير مشروع",
        message: "مشروع بوابة الموظفين يقترب من الموعد النهائي",
        type: "warning",
        link: "/projects/1",
      },
    ],

    tasks: {
      total: 12,
      completed: 8,

      today: [
        {
          id: 1,
          title: "مراجعة API",
          description: "مراجعة نقاط النهاية الخاصة بالمشاريع",
          status: "in_progress",
          priority: "high",
          due_date: dayjs().add(2, "hour").toISOString(),
          project: {
            id: 1,
            name: "بوابة الموظفين",
          },
        },
        {
          id: 2,
          title: "إصلاح خطأ تسجيل الدخول",
          description: "حل مشكلة token expiry",
          status: "completed",
          priority: "medium",
          due_date: dayjs().toISOString(),
          project: {
            id: 2,
            name: "نظام الصلاحيات",
          },
        },
      ],

      upcoming: [
        {
          id: 3,
          title: "تصميم لوحة التحكم",
          priority: "high",
          due_date: dayjs().add(1, "day").toISOString(),
          project: {
            id: 1,
            name: "بوابة الموظفين",
          },
        },
        {
          id: 4,
          title: "كتابة اختبارات الوحدة",
          priority: "medium",
          due_date: dayjs().add(3, "day").toISOString(),
          project: {
            id: 3,
            name: "نظام التقارير",
          },
        },
      ],
    },

    projects: {
      total: 5,
      active: 2,
      completed_tasks: 18,
      total_tasks: 25,

      active_projects: [
        {
          id: 1,
          name: "بوابة الموظفين",
          description: "منصة داخلية لإدارة الموظفين",
          status: "ongoing",
          progress: 72,
          end_date: dayjs().add(10, "day").toISOString(),
          team_size: 4,
        },
        {
          id: 2,
          name: "نظام التقارير",
          description: "تحسين تقارير الأداء",
          status: "ongoing",
          progress: 45,
          end_date: dayjs().add(20, "day").toISOString(),
          team_size: 3,
        },
      ],
    },
  },
};

const PortalHome: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"today" | "upcoming">("today");

  const dashboard = MOCK_DASHBOARD;
  const employee = dashboard.employee;
  
  const today = dayjs();
  const greeting = getGreeting();

  function getGreeting() {
    const hour = dayjs().hour();
    if (hour < 12) return "صباح الخير";
    if (hour < 18) return "مساء الخير";
    return "مساء الخير";
  }

  // Calculate performance metrics
  const completionRate = employee?.tasks?.total
    ? Math.round((employee.tasks.completed / employee.tasks.total) * 100)
    : 0;

  const projectProgress = employee?.projects?.active
    ? Math.round(
        (employee.projects?.completed_tasks || 0) /
          employee.projects?.total_tasks || 1
      ) * 100
    : 0;

  // Get priority tasks
  const highPriorityTasks =
    employee?.tasks?.upcoming?.filter((t) => t.priority === "high") || [];
  const overdueTasks =
    employee?.tasks?.upcoming?.filter((t) =>
      dayjs(t.due_date).isBefore(today, "day")
    ) || [];

  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* === Welcome Header with Profile === */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 md:p-8">
          <Row gutter={[24, 24]} align="middle">
            <Col
              xs={24}
              md={8}
              className="flex justify-center md:justify-start"
            >
              <div className="relative">
                <Avatar
                  size={120}
                  src={employee?.image}
                  icon={!employee?.image && <UserOutlined />}
                  className="border-4 border-white/20 shadow-2xl ring-4 ring-blue-500/20"
                />
                <Badge
                  status="success"
                  className="absolute -bottom-2 -right-2 border-4 border-gray-900"
                />
              </div>
            </Col>

            <Col xs={24} md={16}>
              <div className="text-center md:text-right">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {greeting}،{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    {employee?.name}
                  </span>
                  <CoffeeOutlined className="text-yellow-300 mr-3" />
                </h1>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
                  <Tag
                    color="blue"
                    icon={<TeamOutlined />}
                    className="text-lg px-4 py-1"
                  >
                    {employee?.position}
                  </Tag>
                  <Tag
                    color="purple"
                    icon={<TrophyOutlined />}
                    className="text-lg px-4 py-1"
                  >
                    {employee?.department?.name}
                  </Tag>
                  <Tag
                    color="green"
                    icon={<CalendarOutlined />}
                    className="text-lg px-4 py-1"
                  >
                    {employee?.hire_date
                      ? dayjs(employee.hire_date).format("DD/MM/YYYY")
                      : ""}
                  </Tag>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                    <div className="text-white text-sm mb-1">رقم الموظف</div>
                    <div className="text-white font-bold text-lg">
                      {employee?.employee_id}
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                    <div className="text-white text-sm mb-1">الأقدمية</div>
                    <div className="text-white font-bold text-lg">
                      {employee?.tenure || "0"} يوم
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                    <div className="text-white text-sm mb-1">معدل الإنجاز</div>
                    <div className="text-white font-bold text-lg">
                      {completionRate}%
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                    <div className="text-white text-sm mb-1">اليوم</div>
                    <div className="text-white font-bold text-lg">
                      {today.format("dddd، DD MMMM")}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* === Quick Stats Overview === */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card
            className="h-full rounded-2xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 
              bg-gradient-to-br from-blue-500 to-cyan-600 text-white"
            onClick={() => navigate("/tasks")}
          >
            <Statistic
              title={
                <span className="flex items-center gap-2 text-white">
                  <CheckCircleOutlined />
                  المهام المكتملة
                </span>
              }
              value={employee?.tasks?.completed || 0}
              suffix={`/ ${employee?.tasks?.total || 0}`}
              valueStyle={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "white",
              }}
            />
            <Progress
              percent={completionRate}
              strokeColor="#ffffff"
              trailColor="rgba(255,255,255,0.3)"
              size="small"
              className="mt-4"
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card
            className="h-full rounded-2xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 
              bg-gradient-to-br from-green-500 to-emerald-600 text-white"
            onClick={() => navigate("/projects")}
          >
            <Statistic
              title={
                <span className="flex items-center gap-2 text-white">
                  <ProjectOutlined />
                  المشاريع النشطة
                </span>
              }
              value={employee?.projects?.active || 0}
              suffix={`/ ${employee?.projects?.total || 0}`}
              valueStyle={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "white",
              }}
            />
            <Progress
              percent={projectProgress}
              strokeColor="#ffffff"
              trailColor="rgba(255,255,255,0.3)"
              size="small"
              className="mt-4"
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card
            className="h-full rounded-2xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 
              bg-gradient-to-br from-orange-500 to-amber-600 text-white"
            onClick={() => navigate("/tasks?priority=high")}
          >
            <Statistic
              title={
                <span className="flex items-center gap-2 text-white">
                  <AlertOutlined />
                  مهام عالية الأولوية
                </span>
              }
              value={highPriorityTasks.length}
              prefix={<FireOutlined />}
              valueStyle={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "white",
              }}
            />
            <div className="mt-4 text-white/90 text-sm">
              {overdueTasks.length} متأخرة
            </div>
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card
            className="h-full rounded-2xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 
              bg-gradient-to-br from-purple-500 to-violet-600 text-white"
            onClick={() => navigate("/performance")}
          >
            <Statistic
              title={
                <span className="flex items-center gap-2 text-white">
                  <StarOutlined />
                  نقاط الأداء
                </span>
              }
              value={employee?.performance_score || 85}
              suffix="/100"
              valueStyle={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "white",
              }}
            />
            <div className="mt-4 text-white/90 text-sm flex items-center gap-2">
              <TrophyOutlined />
              {employee?.rank ? `المرتبة ${employee.rank} في القسم` : "ممتاز"}
            </div>
          </Card>
        </Col>
      </Row>

      {/* === Today's Focus === */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <RocketOutlined className="text-blue-500 text-xl" />
            <span className="text-lg font-bold">تركيز اليوم</span>
            <Tag color="blue" className="mr-auto">
              {today.format("DD/MM/YYYY")}
            </Tag>
          </div>
        }
        className="rounded-2xl shadow-lg border-0"
        extra={
          <Space>
            <Button
              type={activeTab === "today" ? "primary" : "default"}
              onClick={() => setActiveTab("today")}
              size="small"
            >
              اليوم
            </Button>
            <Button
              type={activeTab === "upcoming" ? "primary" : "default"}
              onClick={() => setActiveTab("upcoming")}
              size="small"
            >
              القادمة
            </Button>
          </Space>
        }
      >
        {activeTab === "today" ? (
          <List
            dataSource={employee?.tasks?.today || []}
            renderItem={(task: Task) => (
              <List.Item
                className="cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors"
                onClick={() => navigate(`/tasks/${task.id}`)}
              >
                <List.Item.Meta
                  avatar={
                    <div
                      className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-white
                      ${
                        task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                          ? "bg-orange-500"
                          : "bg-green-500"
                      }
                    `}
                    >
                      {task.priority === "high" ? "!" : "✓"}
                    </div>
                  }
                  title={
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{task.title}</span>
                      <Tag
                        color={
                          task.status === "completed"
                            ? "success"
                            : task.status === "in_progress"
                            ? "processing"
                            : "default"
                        }
                      >
                        {task.status === "completed"
                          ? "مكتمل"
                          : task.status === "in_progress"
                          ? "قيد التنفيذ"
                          : "معلق"}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="space-y-2">
                      <div className="text-gray-600">{task.description}</div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>
                          <CalendarOutlined className="mr-1" />
                          {dayjs(task.due_date).format("hh:mm A")}
                        </span>
                        <span>
                          <ProjectOutlined className="mr-1" />
                          {task.project?.name}
                        </span>
                        {task.due_date &&
                          dayjs(task.due_date).isBefore(today, "day") && (
                            <Tag color="red" className="mr-auto">
                              متأخرة
                            </Tag>
                          )}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
            locale={{ emptyText: "لا توجد مهام لليوم - استمتع بيومك! ☕" }}
          />
        ) : (
          <Timeline
            items={employee?.tasks?.upcoming?.slice(0, 5).map((task) => ({
              color:
                task.priority === "high"
                  ? "red"
                  : task.priority === "medium"
                  ? "orange"
                  : "green",
              children: (
                <div
                  className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  onClick={() => navigate(`/tasks/${task.id}`)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{task.title}</span>
                    <Tag color="blue">
                      {dayjs(task.due_date).format("DD/MM")}
                    </Tag>
                  </div>
                  <div className="text-gray-600 text-sm mt-1">
                    {task.project?.name}
                  </div>
                </div>
              ),
            }))}
          />
        )}
      </Card>

      {/* === Active Projects & Quick Actions === */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <BarChartOutlined className="text-green-500 text-xl" />
                <span className="text-lg font-bold">المشاريع النشطة</span>
              </div>
            }
            className="rounded-2xl shadow-lg border-0 h-full"
          >
            <div className="space-y-4">
              {employee?.projects?.active_projects?.map((project: Project) => (
                <div
                  key={project.id}
                  className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-lg flex items-center gap-2">
                        <ProjectOutlined className="text-blue-500" />
                        {project.name}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {project.description}
                      </p>
                    </div>
                    <Badge
                      status={
                        project.status === "ongoing"
                          ? "processing"
                          : project.status === "pending"
                          ? "warning"
                          : "success"
                      }
                      text={project.status}
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>تقدم المشروع</span>
                        <span>{project.progress || 0}%</span>
                      </div>
                      <Progress
                        percent={project.progress || 0}
                        strokeColor="#10b981"
                        size="small"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarOutlined />
                        <span>ينتهي {dayjs(project.end_date).fromNow()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <TeamOutlined />
                        <span>{project.team_size || 1} عضو في الفريق</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(!employee?.projects?.active_projects ||
              employee.projects.active_projects.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <ProjectOutlined className="text-4xl mb-4 text-gray-300" />
                <div>لا توجد مشاريع نشطة حالياً</div>
                <Button
                  type="link"
                  className="mt-2"
                  onClick={() => navigate("/projects")}
                >
                  استعرض جميع المشاريع
                </Button>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <BellOutlined className="text-amber-500 text-xl" />
                <span className="text-lg font-bold">
                  الإشعارات والإجراءات السريعة
                </span>
              </div>
            }
            className="rounded-2xl shadow-lg border-0 h-full"
          >
            <Space direction="vertical" className="w-full">
              {employee?.notifications?.map((notification, index) => (
                <Alert
                  key={index}
                  message={notification.title}
                  description={notification.message}
                  type={notification.type as any}
                  showIcon
                  className="cursor-pointer hover:shadow-sm transition-shadow"
                  onClick={() =>
                    notification.link && navigate(notification.link)
                  }
                />
              ))}

              <Divider />

              <div className="space-y-3">
                <Button
                  type="primary"
                  block
                  size="large"
                  icon={<MailOutlined />}
                  onClick={() => navigate("/messages")}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0"
                >
                  الرسائل الجديدة ({employee?.unread_messages || 0})
                </Button>

                <Button
                  block
                  size="large"
                  icon={<ScheduleOutlined />}
                  onClick={() => navigate("/tasks/create")}
                >
                  إنشاء مهمة جديدة
                </Button>

                <Button
                  block
                  size="large"
                  icon={<HourglassOutlined />}
                  onClick={() => navigate("/attendance")}
                >
                  تسجيل الدخول/الخروج
                </Button>

                <Button
                  block
                  size="large"
                  icon={<UserOutlined />}
                  onClick={() => navigate("/profile")}
                >
                  تحديث الملف الشخصي
                </Button>
              </div>

              <Divider />

              <div className="text-center">
                <div className="text-gray-500 text-sm mb-2">
                  الأداء الأسبوعي
                </div>
                <Progress
                  type="circle"
                  percent={employee?.weekly_performance || 75}
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                  size={100}
                />
                <div className="mt-3 text-gray-600">
                  <CrownOutlined className="text-amber-500 mr-1" />
                  {employee?.weekly_completed_tasks || 0} مهمة هذا الأسبوع
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* === Performance Insights === */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <TrophyOutlined className="text-amber-500 text-xl" />
            <span className="text-lg font-bold">رؤى أدائية</span>
          </div>
        }
        className="rounded-2xl shadow-lg border-0"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {employee?.avg_completion_time || "24"}h
              </div>
              <div className="text-gray-600">متوسط وقت إنجاز المهمة</div>
              <Progress
                percent={85}
                size="small"
                className="mt-3"
                strokeColor="#3b82f6"
              />
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {employee?.quality_score || 92}%
              </div>
              <div className="text-gray-600">جودة العمل المنجز</div>
              <Progress
                percent={92}
                size="small"
                className="mt-3"
                strokeColor="#10b981"
              />
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {employee?.collaboration_score || 88}%
              </div>
              <div className="text-gray-600">التعاون مع الفريق</div>
              <Progress
                percent={88}
                size="small"
                className="mt-3"
                strokeColor="#8b5cf6"
              />
            </div>
          </Col>
        </Row>

        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl">
          <h4 className="font-bold mb-3">نصائح لتحسين الأداء:</h4>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircleOutlined className="text-green-500 mt-1" />
              <span>ركز على المهام عالية الأولوية أولاً</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleOutlined className="text-green-500 mt-1" />
              <span>قم بتحديث حالة المهام بشكل منتظم</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleOutlined className="text-green-500 mt-1" />
              <span>خطط لأسبوع العمل القادم كل يوم جمعة</span>
            </li>
          </ul>
        </div>
      </Card>

      {/* === Footer with Quick Links === */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">روابط سريعة</h3>
          <p className="text-gray-300">الوصول السريع للموارد المهمة</p>
        </div>

        <Row gutter={[16, 16]} justify="center">
          <Col xs={12} sm={6} md={4}>
            <Button
              type="link"
              className="text-white hover:text-blue-300 w-full"
              onClick={() => navigate("/calendar")}
            >
              <CalendarOutlined className="text-2xl mb-2 block mx-auto" />
              التقويم
            </Button>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Button
              type="link"
              className="text-white hover:text-blue-300 w-full"
              onClick={() => navigate("/documents")}
            >
              <FileOutlined className="text-2xl mb-2 block mx-auto" />
              المستندات
            </Button>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Button
              type="link"
              className="text-white hover:text-blue-300 w-full"
              onClick={() => navigate("/team")}
            >
              <TeamOutlined className="text-2xl mb-2 block mx-auto" />
              فريق العمل
            </Button>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Button
              type="link"
              className="text-white hover:text-blue-300 w-full"
              onClick={() => navigate("/reports")}
            >
              <BarChartOutlined className="text-2xl mb-2 block mx-auto" />
              التقارير
            </Button>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Button
              type="link"
              className="text-white hover:text-blue-300 w-full"
              onClick={() => navigate("/settings")}
            >
              <SettingOutlined className="text-2xl mb-2 block mx-auto" />
              الإعدادات
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

// Add these missing icons
const FileOutlined = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
  </svg>
);

const SettingOutlined = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
  >
    <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5A3.5 3.5 0 0 1 12 15.5zm0-5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm6.04-3.55l-1.42-1.41-2.12 2.12a5.003 5.003 0 0 0-1.5 0L9.5 5.54l-1.42 1.41 2.12 2.12a5.003 5.003 0 0 0 0 1.5L8.08 12.9l1.42 1.41 2.12-2.12a5.003 5.003 0 0 0 1.5 0l2.12 2.12 1.42-1.41-2.12-2.12a5.003 5.003 0 0 0 0-1.5l2.12-2.12z" />
  </svg>
);

export default PortalHome;
