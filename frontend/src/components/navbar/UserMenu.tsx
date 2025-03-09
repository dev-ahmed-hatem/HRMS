import { Button, Splitter } from "antd";

const UserMenu = () => {
  return (
    <div>
      <span>مشرف</span>
      <div className="w-[80%] mx-auto my-2 h-[1px] bg-gray-300"></div>
      <Button className="flex my-3 w-full bg-orange font-bold !outline-none
      hover:!text-orange hover:!border-orange hover:!bg-transparent">
        تسجيل خروج
      </Button>
    </div>
  );
};

export default UserMenu;
