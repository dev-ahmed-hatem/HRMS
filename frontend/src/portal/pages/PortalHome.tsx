import dayjs from "dayjs";
import Banner from "../components/home/PortalBanner";
import QuickAccess from "../components/home/QuickAccess";
import DashboardData from "../components/home/DashboardData";

const MOCK_DASHBOARD = {
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
};

const PortalHome = () => {
  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Employee Welcome Header */}
      <Banner />

      {/* Dashboard Data */}
      <DashboardData data={MOCK_DASHBOARD} />

      {/* quick access */}
      <QuickAccess />
    </div>
  );
};

export default PortalHome;
