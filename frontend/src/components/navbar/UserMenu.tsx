import { useLogoutMutation } from "@/app/api/endpoints/auth";
import { useNotification } from "@/providers/NotificationProvider";
import { Button } from "antd";
import { useEffect } from "react";

const UserMenu = ({ role }: { role: string }) => {
  const [logout, { isLoading, isSuccess, isError }] = useLogoutMutation();
  const notification = useNotification();

  useEffect(() => {
    if (isSuccess) {
      location.href = "/login";
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      notification.error({ message: "حدث خطأ! برجاء إعادة المحاولة" });
    }
  }, [isError]);

  return (
    <div>
      <span>{role}</span>
      <div className="w-[80%] mx-auto my-2 h-[1px] bg-gray-300"></div>
      <Button
        className="flex my-3 w-full bg-orange font-bold !outline-none
       hover:!border-orange-200 hover:!bg-orange-200 hover:!text-black"
        onClick={() => {
          logout();
        }}
        loading={isLoading}
      >
        تسجيل خروج
      </Button>
    </div>
  );
};

export default UserMenu;
