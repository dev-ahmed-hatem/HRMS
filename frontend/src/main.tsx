import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import routes from "./app/routerConfig";
import { arEG } from "./utils/locale";
import { ConfigProvider } from "antd";
import "./styles/tables.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0E6B81",
          fontFamily: "cairo",
        },
      }}
      locale={arEG}
    >
      <RouterProvider router={createBrowserRouter(routes)} />
    </ConfigProvider>
  </StrictMode>
);
