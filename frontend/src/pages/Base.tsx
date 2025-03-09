import { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Menu from "../components/Menu";
import { Button } from "antd";

const Base = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  return (
    <>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="font-bold text-xl padding-container pt-10">الرئيسية</div>
    </>
  );
};

export default Base;
