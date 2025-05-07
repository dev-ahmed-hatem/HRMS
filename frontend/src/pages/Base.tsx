import { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Menu from "../components/Menu";
import { Outlet, useMatch } from "react-router";
import Home from "./Home";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/BreadCrumbs";
import ScrollToTop from "../components/ScrollToTop";
import { Button } from "antd";
import { ToastContainer } from "react-toastify";

const Base = ({ error }: { error?: any }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const isHome = useMatch("/");
  return (
    <>
      <ScrollToTop />
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {error ? (
        // error display
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 min-h-96">
          <h1 className="text-4xl font-bold text-red-600 mb-4">حدث خطأ!</h1>
          <p className="text-lg text-gray-700 mb-4">
            حدث خطأ غير متوقع. الرجاء إعادة المحاولة.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Button
              type="primary"
              htmlType="button"
              size="large"
              onClick={() => window.location.reload()}
            >
              إعادة تحميل الصفحة
            </Button>

            <Button
              type="primary"
              htmlType="button"
              size="large"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              العودة للرئيسية
            </Button>
          </div>
        </div>
      ) : isHome ? (
        // home page
        <Home />
      ) : (
        // nested routes
        <div className="padding-container py-7">
          <Breadcrumbs />
          <Outlet />
        </div>
      )}
      <Footer />
      <ToastContainer />
    </>
  );
};

export default Base;
