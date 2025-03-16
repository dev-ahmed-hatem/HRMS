import { TablePaginationConfig } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";

// default antd table pagination config
export const tablePaginationConfig: (
  pageSize?: number
) => TablePaginationConfig = (pageSize = 20) => ({
  pageSize,
  itemRender(page, type, element) {
    if (type === "prev") {
      return (
        <button className="ant-pagination-item-link">
          <RightOutlined />
        </button>
      );
    }
    if (type === "next") {
      return (
        <button className="ant-pagination-item-link">
          <LeftOutlined />
        </button>
      );
    }
    return element;
  },
});
