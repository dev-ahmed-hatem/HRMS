import { useState } from "react";
import Navbar from "@/portal/components/navbar/Navbar";
import Menu from "../components/Menu";
import { Navigate, Outlet, useMatch } from "react-router";
import Footer from "@/components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import ErrorPage from "@/pages/ErrorPage";
import { useAppSelector } from "@/app/redux/hooks";
import NotAllowedPage from "@/pages/NotAllowedPage";
import PortalHome from "./pages/PortalHome";

const PortalBase = ({ error }: { error?: any }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const isHome = useMatch("/portal");

  const user = useAppSelector((state) => state.auth.user)!;
  const employee = useAppSelector((state) => state.employee.employee)!;

  if (isHome && employee === null) return <Navigate to={"/"} />;

  return !user.is_staff ? (
    <>
      <ScrollToTop />
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {error ? (
        // error display
        <ErrorPage />
      ) : isHome ? (
        // home page
        <PortalHome />
      ) : (
        // nested routes
        <div className="padding-container py-7">
          <Outlet />
        </div>
      )}
      <Footer />
    </>
  ) : (
    <NotAllowedPage />
  );
};

export default PortalBase;
