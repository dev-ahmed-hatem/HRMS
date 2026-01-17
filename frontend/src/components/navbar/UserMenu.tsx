import { removeTokens } from "@/utils/storage";
import { Avatar, Button } from "antd";
import { useNavigate } from "react-router";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const logout = () => {
  removeTokens();
  location.href = "/login";
};

const UserMenu = ({
  photo,
  name,
  settingsUrl,
  close,
}: {
  photo?: string | null;
  name?: string | null;
  settingsUrl?: string;
  close?: Function;
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-col items-center mb-3">
        <Avatar
          size={100}
          src={photo || undefined}
          icon={!photo && <UserOutlined />}
          className="bg-gray-200 text-gray-600"
        />
        {name && <div className="mt-2 font-bold">{name}</div>}
      </div>

      {/* <div className="flex justify-center mb-3 font-bold">
        {name || <span className="text-red-500">بلا اسم</span>}
      </div> */}
      <div className="w-[80%] mx-auto my-2 h-[1px] bg-gray-300"></div>
      <div className="space-y-2 py-1">
        <div className="space-y-2">
          <Button
            className="
            flex w-full justify-center items-center h-9 text-gray-700 hover:bg-calypso-50
            hover:text-calypso font-medium"
            onClick={() => {
              navigate(settingsUrl ?? "/settings");
              if (close) close();
            }}
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
