import { removeTokens } from "@/utils/storage";
import { Button, Tag } from "antd";
import { useNavigate } from "react-router";
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";

const UserMenu = ({ role }: { role: string }) => {
  const navigate = useNavigate();
  const logout = () => {
    removeTokens();
    location.href = "/login";
  };

  const getRoleColor = () => {
    switch (role) {
      case "مطور":
        return { color: "purple", bg: "#f5f3ff" };
      case "مدير":
        return { color: "gold", bg: "#fefce8" };
      case "مشرف":
        return { color: "blue", bg: "#eff6ff" };
      default:
        return { color: "default", bg: "#f9fafb" };
    }
  };

  const roleColor = getRoleColor();

  return (
    <div>
      <div className="flex justify-center mb-3">
        <Tag color={roleColor.color} className="px-3 py-1 font-medium">
          {role}
        </Tag>
      </div>
      <div className="w-[80%] mx-auto my-2 h-[1px] bg-gray-300"></div>
      <div className="space-y-2 py-1">
        <div className="space-y-2">
          <Button
            className="
            flex w-full justify-center items-center h-9 text-gray-700 hover:bg-calypso-50
            hover:text-calypso font-medium"
            onClick={() => navigate("/settings")}
            icon={<SettingOutlined className="ml-1" />}
          >
            الإعدادات
          </Button>

          <Button
            className="
            flex w-full justify-center items-center h-9 text-red-600 hover:text-red-700
            hover:bg-red-50 font-medium border border-red-200 hover:border-red-400"
            onClick={logout}
            icon={<LogoutOutlined className="ml-1" />}
          >
            تسجيل خروج
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
