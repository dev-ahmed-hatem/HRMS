import { Drawer, MenuProps, Menu as AntdMenu } from "antd";
import Logo from "./Logo";
import { FaMoneyBill, FaUser } from "react-icons/fa";
import {
  FaCalendarCheck,
  FaCalendarDays,
  FaDiagramProject,
  FaFile,
} from "react-icons/fa6";
import { MdAssignment } from "react-icons/md";
import { GiMoneyStack, GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import "../styles/menu.css";
import { NavLink, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { LuNotebookPen } from "react-icons/lu";

const items: MenuProps["items"] = [
  {
    key: "/employees",
    icon: <FaUser />,
    label: <NavLink to="/employees">الموظفين</NavLink>,
  },
  {
    key: "/projects",
    icon: <FaDiagramProject />,
    label: <NavLink to="/projects">المشاريع</NavLink>,
  },
  {
    key: "/tasks",
    icon: <MdAssignment />,
    label: <NavLink to="/tasks">التكليفات</NavLink>,
  },
  {
    key: "/attendance",
    icon: <FaCalendarCheck />,
    label: <NavLink to="/attendance">الحضور والانصراف</NavLink>,
  },
  {
    key: "financials",
    icon: <FaMoneyBill />,
    label: "الماليات",
    children: [
      {
        key: "/incomes",
        icon: <GiReceiveMoney />,
        label: <NavLink to="/incomes">الإيرادات</NavLink>,
      },
      {
        key: "/expenses",
        icon: <GiPayMoney />,
        label: <NavLink to="/expenses">المصروفات</NavLink>,
      },
      {
        key: "/salaries",
        icon: <GiMoneyStack />,
        label: <NavLink to="/salaries">المرتبات</NavLink>,
      },
    ],
  },
  {
    key: "/schedules",
    icon: <FaCalendarDays />,
    label: <NavLink to="/schedules">جدول المواعيد</NavLink>,
  },
  {
    key: "/notes",
    icon: <LuNotebookPen />,
    label: <NavLink to="/notes">المذكرات</NavLink>,
  },
  {
    key: "/files",
    icon: <FaFile />,
    label: <NavLink to="/files">الملفات</NavLink>,
  },
];

const Menu = ({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: Function;
}) => {
  const onClose = () => {
    setMenuOpen(false);
  };
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    const activeSubMenu = items.find((item: any) =>
      item!.children?.some((child: any) => child.key === location.pathname)
    );
    setOpenKeys(activeSubMenu ? [activeSubMenu.key as string] : []);
  }, [location.pathname]);

  useEffect(() => {
    setTimeout(() => {
      document.querySelector(`.ant-menu-item-selected`)?.scrollIntoView();
    }, 200);
  }, [menuOpen]);

  return (
    <>
      <Drawer title="القائمة" onClose={onClose} open={menuOpen}>
        <NavLink
          to={"/"}
          className="logo h-20 flex items-center justify-center rounded-lg mb-10"
          onClick={() => setMenuOpen(false)}
        >
          <Logo className="fill-calypso-900 hover:fill-calypso-950 h-full rounded-lg" />
        </NavLink>

        <AntdMenu
          selectedKeys={[location.pathname]}
          defaultOpenKeys={openKeys}
          mode="inline"
          items={items}
          onClick={() => setMenuOpen(false)}
          className="text-base"
        />
      </Drawer>
    </>
  );
};

export default Menu;
