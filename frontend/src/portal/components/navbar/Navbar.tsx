import Logo from "@/components/Logo";
import { RxAvatar } from "react-icons/rx";
import { Popover, Tag } from "antd";
import { useState } from "react";
import UserMenu from "@/components/navbar/UserMenu";
import { NavLink } from "react-router";
import { useAppSelector } from "@/app/redux/hooks";

const Navbar = ({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: Function;
}) => {
  const [open, setOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const employee = useAppSelector((state) => state.employee.employee);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const role = user?.is_root
    ? "مطور"
    : user?.is_superuser
    ? "مدير"
    : user?.is_moderator
    ? "مشرف"
    : "موظف";

  const getRoleColor = () => {
    switch (role) {
      case "مطور":
        return { color: "purple", bg: "#f5f3ff" };
      case "مدير":
        return { color: "gold", bg: "#fefce8" };
      case "مشرف":
        return { color: "blue", bg: "#eff6ff" };
      case "موظف":
        return { color: "green", bg: "#f0fdf4" };
      default:
        return { color: "default", bg: "#f9fafb" };
    }
  };

  const roleColor = getRoleColor();

  return (
    <div className="padding-container flex justify-between items-center bg-orange py-2">
      {/* <IoMenu
        className="text-calypso-900 hover:text-calypso-950 text-4xl md:text-5xl cursor-pointer"
        onClick={() => {
          setMenuOpen(!menuOpen);
        }}
      /> */}
      <div className="logo h-12 md:h-16">
        <NavLink to={"/"}>
          <Logo className="fill-calypso-900 hover:fill-calypso-950" />
        </NavLink>
      </div>
      <div className="user">
        <Popover
          content={
            <UserMenu
              name={employee?.name ?? user?.name}
              photo={employee?.image}
              settingsUrl={user?.is_staff ? "/settings" : "/portal/settings"}
              close={() => setOpen(false)}
            />
          }
          title={
            <Tag color={roleColor.color} className="px-3 py-1 font-medium">
              {role}
            </Tag>
          }
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
        >
          <RxAvatar className="text-4xl md:text-5xl text-calypso-900 hover:text-calypso-950 cursor-pointer" />
        </Popover>
      </div>
    </div>
  );
};

export default Navbar;
