import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  List,
  Tag,
  Badge,
  Divider,
  Button,
  Space,
  Alert,
  Timeline,
  Tooltip,
} from "antd";
import {
  ProjectOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
  TrophyOutlined,
  BarChartOutlined,
  AlertOutlined,
  StarOutlined,
  BellOutlined,
  ScheduleOutlined,
  FireOutlined,
  CrownOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { IoSettingsOutline } from "react-icons/io5";
import { logout } from "@/components/navbar/UserMenu";
import { LuNotebookPen } from "react-icons/lu";
import { MdAssignment } from "react-icons/md";
import Banner from "../components/home/PortalBanner";

const MOCK_DASHBOARD = {
  employee: {
    performance_score: 87,
    rank: 2,

    weekly_performance: 78,
    weekly_completed_tasks: 6,

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

      today_focus: [
        {
          id: 1,
          title: "مراجعة API",
          description: "مراجعة نقاط النهاية الخاصة بالمشاريع",
          status: "in_progress",
          priority: "high",
          due_date: dayjs().toISOString(), // today
          project: {
            id: 1,
            name: "بوابة الموظفين",
          },
        },
        {
          id: 5,
          title: "إصلاح مشكلة الأداء",
          status: "in_progress",
          priority: "high",
          due_date: dayjs().subtract(2, "day").toISOString(), // overdue
          project: {
            id: 2,
            name: "نظام التقارير",
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
        {
          id: 3,
          name: "نظام التقارير",
          description: "تحسين تقارير الأداء",
          status: "ongoing",
          progress: 45,
          end_date: dayjs().add(20, "day").toISOString(),
          team_size: 3,
        },
        {
          id: 4,
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

const PortalHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"today" | "upcoming">("today");

  const dashboard = MOCK_DASHBOARD;
  const employee = dashboard.employee;

  const today = dayjs();

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

  const renderTaskDate = (dueDate: string) => {
    const date = dayjs(dueDate);

    if (date.isSame(today, "day")) {
      return <Tag color="blue">اليوم</Tag>;
    }

    if (date.isBefore(today, "day")) {
      return <Tag color="red">متأخرة · {date.format("DD/MM")}</Tag>;
    }

    return <Tag color="default">{date.format("DD/MM")}</Tag>;
  };

  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Welcome Header */}
      <Banner />

      {/* Stats Overview*/}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={6}>
          <Card
            className="group h-full cursor-pointer rounded-2xl border border-white/5
            bg-gradient-to-bl from-slate-800 via-slate-800 to-blue-700
            shadow-lg hover:shadow-xl transition-all duration-300
            hover:-translate-y-1"
            onClick={() => navigate("/tasks")}
          >
            <Statistic
              title={
                <span className="flex items-center gap-2 text-white/80">
                  <CheckCircleOutlined />
                  المهام المكتملة
                </span>
              }
              value={employee?.tasks?.completed || 0}
              suffix={`/ ${employee?.tasks?.total || 0}`}
              valueStyle={{
                fontSize: "2rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.95)",
              }}
            />

            <Progress
              percent={completionRate}
              strokeColor="rgba(59,130,246,0.9)"
              trailColor="rgba(255,255,255,0.12)"
              size="small"
              className="mt-4"
            />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card
            className="group h-full cursor-pointer rounded-2xl border border-white/5
        bg-gradient-to-bl from-slate-800 via-slate-900 to-emerald-800
        shadow-lg hover:shadow-xl transition-all duration-300
        hover:-translate-y-1"
            onClick={() => navigate("/projects")}
          >
            <Statistic
              title={
                <span className="flex items-center gap-2 text-white/80">
                  <ProjectOutlined />
                  المشاريع النشطة
                </span>
              }
              value={employee?.projects?.active || 0}
              suffix={`/ ${employee?.projects?.total || 0}`}
              valueStyle={{
                fontSize: "2rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.95)",
              }}
            />

            <Progress
              percent={projectProgress}
              strokeColor="rgba(16,185,129,0.9)"
              trailColor="rgba(255,255,255,0.12)"
              size="small"
              className="mt-4"
            />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card
            className="group h-full cursor-pointer rounded-2xl border border-white/5
        bg-gradient-to-bl from-slate-900 via-slate-900 to-amber-950
        shadow-lg hover:shadow-xl transition-all duration-300
        hover:-translate-y-1"
            onClick={() => navigate("/tasks?priority=high")}
          >
            <Statistic
              title={
                <span className="flex items-center gap-2 text-white/80">
                  <AlertOutlined />
                  مهام عالية الأولوية
                </span>
              }
              value={highPriorityTasks.length}
              prefix={<FireOutlined className="text-amber-400" />}
              valueStyle={{
                fontSize: "2rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.95)",
              }}
            />

            <div className="mt-4 text-sm text-white/60">
              {overdueTasks.length} متأخرة
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card
            className="group h-full cursor-pointer rounded-2xl border border-white/5
        bg-gradient-to-bl from-slate-900 via-slate-900 to-violet-950
        shadow-lg hover:shadow-xl transition-all duration-300
        hover:-translate-y-1"
            onClick={() => navigate("/performance")}
          >
            <Statistic
              title={
                <span className="flex items-center gap-2 text-white/80">
                  <StarOutlined />
                  نقاط الأداء
                </span>
              }
              value={employee?.performance_score || 85}
              suffix="/100"
              valueStyle={{
                fontSize: "2rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.95)",
              }}
            />

            <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
              <TrophyOutlined className="text-violet-400" />
              {employee?.rank ? `المرتبة ${employee.rank} في القسم` : "ممتاز"}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Today's tasks */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <MdAssignment className="text-blue-500 text-xl" />
            <span className="text-lg font-bold">
              {activeTab === "today" ? "مهام اليوم" : "المهام القادمة"}
            </span>
            <Tag color="blue" className="mr-auto">
              {today.format("YYYY-MM-DD")}
            </Tag>
          </div>
        }
        className="rounded-2xl shadow-lg border-0"
        extra={
          <Space size="small">
            <Tooltip title="مهام اليوم">
              <Button
                shape="circle"
                size="middle"
                icon={<CalendarOutlined />}
                type={activeTab === "today" ? "primary" : "default"}
                onClick={() => setActiveTab("today")}
                className={
                  activeTab === "today"
                    ? "shadow-md"
                    : "text-gray-500 hover:text-blue-500"
                }
              />
            </Tooltip>

            <Tooltip title="المهام القادمة">
              <Button
                shape="circle"
                size="middle"
                icon={<ScheduleOutlined />}
                type={activeTab === "upcoming" ? "primary" : "default"}
                onClick={() => setActiveTab("upcoming")}
                className={
                  activeTab === "upcoming"
                    ? "shadow-md"
                    : "text-gray-500 hover:text-blue-500"
                }
              />
            </Tooltip>
          </Space>
        }
      >
        {activeTab === "today" ? (
          <List
            dataSource={employee.tasks.today_focus}
            renderItem={(task) => (
              <List.Item
                className="cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors"
                onClick={() => navigate(`/tasks/${task.id}`)}
              >
                <List.Item.Meta
                  avatar={
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white
                ${
                  task.priority === "high"
                    ? "bg-red-500"
                    : task.priority === "medium"
                    ? "bg-orange-500"
                    : "bg-green-500"
                }`}
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
                      {task.description && (
                        <div className="text-gray-600">{task.description}</div>
                      )}

                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarOutlined />
                          {renderTaskDate(task.due_date)}
                        </span>

                        {task.project && (
                          <span className="flex items-center gap-1">
                            <ProjectOutlined />
                            {task.project.name}
                          </span>
                        )}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
            locale={{ emptyText: "لا توجد مهام حالياً 🎯" }}
          />
        ) : (
          <Timeline
            items={employee.tasks.upcoming.map((task) => ({
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
                    {renderTaskDate(task.due_date)}
                  </div>

                  {task.project && (
                    <div className="text-gray-600 text-sm mt-1">
                      {task.project.name}
                    </div>
                  )}
                </div>
              ),
            }))}
          />
        )}
      </Card>

      {/* Projects & Quick Actions */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16} className="h-fit">
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
              {employee?.projects?.active_projects?.map((project) => (
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

        <Col xs={24} lg={8} className="h-fit">
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
                  block
                  size="large"
                  type="primary"
                  icon={<LogoutOutlined className="text-xl" />}
                  className="bg-red-600/90 hover:bg-red-500 border-0 flex"
                  onClick={logout}
                >
                  تسجيل خروج
                </Button>

                <Button
                  block
                  size="large"
                  type="primary"
                  icon={<EditOutlined />}
                  className="bg-red/10 text-red hover:bg-red/20 border border-red/20"
                  onClick={() => navigate("/portal/settings")}
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

      {/* footer with navigation */}
      <div className="bg-calypso-950 rounded-2xl p-6 text-white shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2 text-orange">روابط سريعة</h3>
          <p className="text-gray-400 text-sm">
            الوصول السريع للموارد المختلفة
          </p>
        </div>

        <Row gutter={[16, 16]} justify="center">
          {[
            {
              label: "جدول المواعيد",
              icon: <CalendarOutlined />,
              path: "/portal/calendar",
            },
            {
              label: "المذكرات",
              icon: <LuNotebookPen />,
              path: "/portal/documents",
            },
            {
              label: "فريق العمل",
              icon: <TeamOutlined />,
              path: "/portal/team",
            },
            {
              label: "الإعدادات",
              icon: <IoSettingsOutline />,
              path: "/portal/settings",
            },
          ].map((item, index) => (
            <Col key={index} xs={12} sm={6} md={4}>
              <Button
                type="link"
                onClick={() => navigate(item.path)}
                className="w-full h-full flex flex-col items-center justify-center gap-2
                px-4 py-5 rounded-xl text-white bg-white/5 hover:bg-white/10
                hover:text-orange transition-all duration-300 focus:outline-none
                focus:ring-2 focus:ring-blue-400/50 font-bold"
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Button>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default PortalHome;
