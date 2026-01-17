import { dayjs } from "@/utils/locale";
import { Row, Col, Avatar, Badge, Tag } from "antd";
import {
  ApartmentOutlined,
  ClockCircleOutlined,
  CoffeeOutlined,
  IdcardOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "@/app/redux/hooks";

const PortalBanner = ({ completionRate }: { completionRate?: number }) => {
  const employee = useAppSelector((state) => state.employee.employee)!;

  const today = dayjs();
  const greeting = getGreeting();

  function getGreeting() {
    const hour = dayjs().hour();
    if (hour < 12) return "صباح الخير";
    if (hour < 18) return "مساء الخير";
    return "مساء الخير";
  }

  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-6 md:p-8">
        <Row gutter={[24, 24]} align="middle">
          <Col
            xs={24}
            md={6}
            lg={5}
            className="flex justify-center md:justify-start"
          >
            <div className="relative">
              {/* Avatar */}
              {employee?.image ? (
                <Avatar
                  src={employee.image}
                  alt={employee.name}
                  className="size-[140px] md:size-[160px] lg:size-[200px]
                  border-4 border-white/20 shadow-2xl ring-4 ring-blue-500/30
                  transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <Avatar
                  icon={<UserOutlined />}
                  className="size-[140px] md:size-[160px] lg:size-[200px]
                  bg-gradient-to-br from-blue-500 to-purple-600 text-white border-4 border-white/20
                  shadow-2xl ring-4 ring-blue-500/30 flex items-center justify-center transition-transform duration-300
                  hover:scale-105"
                />
              )}

              {/* Status Badge */}
              <Badge
                status="success"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 scale-125"
              />
            </div>
          </Col>

          <Col xs={24} md={18} lg={19}>
            <div className="text-center md:text-right">
              {/* Greeting */}
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
                {greeting} ..{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent leading-relaxed">
                  {employee?.name}
                </span>
                <CoffeeOutlined className="text-orange-300 mr-1 align-middle" />
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap md:gap-2 lg:gap-3 justify-center md:justify-start mb-5">
                {employee?.position && (
                  <Tag
                    color="geekblue"
                    icon={<IdcardOutlined />}
                    className="text-sm md:text-base lg:text-lg px-3 lg:px-4 py-1 rounded-full"
                  >
                    {employee.position}
                  </Tag>
                )}

                {employee?.department && (
                  <Tag
                    color="cyan"
                    icon={<ApartmentOutlined />}
                    className="text-sm md:text-base lg:text-lg px-3 lg:px-4 py-1 rounded-full"
                  >
                    {employee.department}
                  </Tag>
                )}

                {employee?.hire_date && (
                  <Tag
                    color="gold"
                    icon={<ClockCircleOutlined />}
                    className="text-sm md:text-base lg:text-lg px-3 lg:px-4 py-1 rounded-full"
                  >
                    {dayjs(employee.hire_date).format("YYYY-MM-DD")}
                  </Tag>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[
                  {
                    label: "رقم الموظف",
                    value: employee?.employee_id,
                  },
                  {
                    label: "الأقدمية",
                    value: employee.tenure ? `${employee?.tenure} يوم` : "-",
                  },
                  {
                    label: "معدل الإنجاز",
                    value: completionRate ? `${completionRate}%` : "-",
                  },
                  {
                    label: "اليوم",
                    value: today.format("dddd، DD MMMM"),
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/15 transition"
                  >
                    <div className="text-white/70 text-sm mb-1">
                      {item.label}
                    </div>
                    <div className="text-white font-bold text-lg">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PortalBanner;
