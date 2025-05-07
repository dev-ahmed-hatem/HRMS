import { useLogoutMutation } from "@/app/api/endpoints/auth";
import { Button } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast, Bounce } from "react-toastify";

const UserMenu = ({ role }: { role: string }) => {
  const navigate = useNavigate();
  const [logout, { isLoading, isSuccess, isError }] = useLogoutMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error("حدث خطأ! برجاء إعادة المحاولة", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
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
