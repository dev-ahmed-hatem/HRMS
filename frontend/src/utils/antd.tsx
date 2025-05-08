import { TablePaginationConfig } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";

// default antd table pagination config
export const tablePaginationConfig: ({
  pageSize,
  total,
  current,
}: {
  pageSize?: number;
  total?: number;
  current?: number;
  onChange?: TablePaginationConfig["onChange"];
}) => TablePaginationConfig = ({ pageSize, total, current, onChange }) => ({
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
  total,
  current,
  onChange,
  showTotal: (total, range) => (
    <span className="text-sm text-gray-600 text-wrap">
      عرض <span className="font-semibold text-black mx-1">{range[0]}</span> :{" "}
      <span className="font-semibold text-black mx-1">{range[1]}</span> من
      إجمالي <span className="font-semibold text-black mx-1">{total}</span>{" "}
    </span>
  ),
});
