import { Row, Col, Button } from "antd";
import { CalendarOutlined, TeamOutlined } from "@ant-design/icons";
import { IoSettingsOutline } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";
import { useNavigate } from "react-router";

const QuickAccess = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-calypso-950 rounded-2xl p-6 text-white shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2 text-orange">روابط سريعة</h3>
        <p className="text-gray-400 text-sm">الوصول السريع للموارد المختلفة</p>
      </div>

      <Row gutter={[16, 16]} justify="center">
        {[
          {
            label: "جدول المواعيد",
            icon: <CalendarOutlined />,
            path: "/portal/calendar",
          },
          {
            label: "المذكرات",
            icon: <LuNotebookPen />,
            path: "/portal/documents",
          },
          {
            label: "فريق العمل",
            icon: <TeamOutlined />,
            path: "/portal/team",
          },
          {
            label: "الإعدادات",
            icon: <IoSettingsOutline />,
            path: "/portal/settings",
          },
        ].map((item, index) => (
          <Col key={index} xs={12} sm={6} md={4}>
            <Button
              type="link"
              onClick={() => navigate(item.path)}
              className="w-full h-full flex flex-col items-center justify-center gap-2
                px-4 py-5 rounded-xl text-white bg-white/5 hover:bg-white/10
                hover:text-orange transition-all duration-300 focus:outline-none
                focus:ring-2 focus:ring-blue-400/50 font-bold"
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default QuickAccess;
