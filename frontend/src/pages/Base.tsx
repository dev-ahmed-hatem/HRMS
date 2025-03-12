import { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Menu from "../components/Menu";
import { Outlet, useMatch } from "react-router";
import Home from "./Home";
import Footer from "../components/Footer";

const Base = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const isHome = useMatch("/");
  return (
    <>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {isHome ? <Home /> : <Outlet />}
      <Footer />
    </>
  );
};

export default Base;
