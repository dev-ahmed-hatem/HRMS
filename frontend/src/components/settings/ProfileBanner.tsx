import { Card, Avatar, Tag, Badge } from "antd";
import {
  UserOutlined,
  IdcardOutlined,
  TeamOutlined,
  SafetyOutlined,
  SettingOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { User } from "../../types/user";
import { Employee } from "@/types/employee";

interface ProfileBannerProps {
  user: User;
  employee: Employee | null;
}

const StatItem = ({ label, value, icon }: any) => (
  <div className="text-center">
    <div className="text-gray-300 text-xs mb-1">{label}</div>
    <div className="text-white font-semibold flex items-center justify-center gap-1">
      {icon} {value}
    </div>
  </div>
);

const RowItem = ({ label, children }: any) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-300">{label}</span>
    {children}
  </div>
);

const ProfileBanner = ({ user, employee }: ProfileBannerProps) => {
  const getUserRole = () => {
    if (user.is_superuser) {
      return {
        color: "#EF4444", // red-500
        icon: <SafetyOutlined />,
        label: "مدير",
        level: 3,
      };
    }
    if (user.is_moderator) {
      return {
        color: "#3B82F6", // blue-500
        icon: <TeamOutlined />,
        label: "مشرف",
        level: 2,
      };
    }
    return {
      color: "#10B981", // emerald-500
      icon: <UserOutlined />,
      label: "موظف",
      level: 1,
    };
  };

  const role = getUserRole();

  return (
    <Card className="rounded-2xl border-0 overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 shadow-2xl relative">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-blue-500/10 rounded-full -translate-y-24 translate-x-24 sm:-translate-y-32 sm:translate-x-32" />
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-emerald-500/10 rounded-full translate-y-16 -translate-x-16 sm:translate-y-24 sm:-translate-x-24" />

      <div className="relative z-10">
        <div className="flex flex-col xl:flex-row gap-10">
          {/* LEFT SECTION */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full">
            {/* Avatar */}
            <div className="relative shrink-0">
              {employee?.image ? (
                <Avatar
                  src={employee.image}
                  size={120}
                  className="sm:size-[140] border-4 border-white/20 shadow-2xl ring-4 ring-blue-500/20"
                />
              ) : (
                <Avatar
                  size={120}
                  className="sm:size-[140] bg-gradient-to-br from-blue-500 to-purple-600 text-white border-4 border-white/20 shadow-2xl ring-4 ring-blue-500/20 flex items-center justify-center"
                  icon={<UserOutlined className="text-4xl sm:text-5xl" />}
                />
              )}

              <Badge
                status={user.is_active ? "success" : "error"}
                className="absolute -bottom-2 -right-2 rounded-full"
              />
            </div>

            {/* User Info */}
            <div className="text-center sm:text-right w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {employee?.name || user.name || "بدون اسم"}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 mb-4">
                {employee?.position && (
                  <Tag className="text-sm sm:text-lg px-3 py-1 bg-blue-500/20 text-blue-200 border-0">
                    <SettingOutlined /> {employee.position}
                  </Tag>
                )}

                <Tag
                  className="text-sm sm:text-lg px-3 py-1 bg-white/10 text-white border-0 flex items-center gap-2"
                  icon={getUserRole().icon}
                >
                  {getUserRole().label}
                </Tag>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 bg-white/5 rounded-xl p-4">
                <StatItem
                  label="المستخدم"
                  value={employee?.name || user.username}
                />
                <StatItem
                  label="الهاتف"
                  value={employee?.phone || user.phone || "غير محدد"}
                  icon={<PhoneOutlined />}
                />
                <StatItem
                  label="الرقم القومي"
                  value={
                    employee?.national_id || user.national_id || "غير محدد"
                  }
                />
                <StatItem
                  label="رقم الموظف"
                  value={employee?.employee_id || "غير محدد"}
                  icon={<IdcardOutlined />}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="w-full xl:max-w-[380px] bg-white/10 rounded-2xl p-5 sm:p-6 border border-white/20 shadow-xl">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-6 pb-3 border-b border-white/20 flex items-center gap-3">
              <MailOutlined className="text-blue-300" />
              تفاصيل الحساب
            </h3>

            <div className="space-y-4 text-sm sm:text-base">
              <RowItem label="حالة الحساب">
                <Tag color={user.is_active ? "success" : "error"}>
                  {user.is_active ? "نشط" : "معطل"}
                </Tag>
              </RowItem>

              <RowItem label="آخر دخول">
                <span className="text-white">{user.last_login}</span>
              </RowItem>

              {(user.is_superuser || user.is_moderator) && (
                <div>
                  <h4 className="text-gray-300 mb-2">الصلاحيات:</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.is_superuser && <Tag color="gold">التحكم الكامل</Tag>}
                    {user.is_moderator && <Tag color="red">الإشراف</Tag>}
                  </div>
                </div>
              )}

              {employee?.department && (
                <RowItem label="القسم">
                  <span className="text-white">{employee.department}</span>
                </RowItem>
              )}
            </div>

            {/* <button
              className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition"
              onClick={() => (window.location.href = "/settings/profile")}
            >
              <SettingOutlined /> تعديل الملف الشخصي
            </button> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 text-sm text-gray-400 flex flex-wrap gap-2 items-center">
          <span className="text-white font-medium">معرف المستخدم:</span>
          <code className="bg-white/10 px-3 py-1 rounded-lg">{user.id}</code>
        </div>
      </div>
    </Card>
  );
};

export default ProfileBanner;
