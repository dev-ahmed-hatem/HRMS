import React from "react";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { Link } from "react-router";

const Breadcrumbs: React.FC = () => (
  <div className="mb-7">
    <Breadcrumb
      itemRender={(route, params, routes, pathes) => (
        <Link to={route.href!}>{route.title}</Link>
      )}
      items={[
        {
          href: "",
          title: <HomeOutlined />,
        },
        {
          href: "",
          title: (
            <>
              <UserOutlined />
              <span>Application List</span>
            </>
          ),
        },
        {
          title: "Application",
        },
      ]}
    />
  </div>
);

export default Breadcrumbs;
