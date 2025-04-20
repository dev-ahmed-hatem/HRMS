import { Button } from "antd";
import { useNavigate } from "react-router";

const UserMenu = () => {
  const navigate = useNavigate();
  return (
    <div>
      <span>مشرف</span>
      <div className="w-[80%] mx-auto my-2 h-[1px] bg-gray-300"></div>
      <Button
        className="flex my-3 w-full bg-orange font-bold !outline-none
       hover:!border-orange-200 hover:!bg-orange-200 hover:!text-black"
        onClick={() => navigate("login")}
      >
        تسجيل خروج
      </Button>
    </div>
  );
};

export default UserMenu;
