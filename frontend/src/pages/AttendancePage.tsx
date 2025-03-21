import { Card, Tabs } from "antd";
import AttendanceRecords from "../components/attendance/AttendanceRecords";

const AttendancePage: React.FC = () => {
  const tabItems = [
    {
      key: "1",
      label: "دفتر الحضور",
      children: <AttendanceRecords />,
    },
    {
      key: "2",
      label: "ملخص الحضور",
      children: <Card>ملخص الحضور سيتم إضافته قريبًا</Card>,
    },
    {
      key: "3",
      label: "إعدادات",
      children: <Card>إعدادات النظام سيتم إضافتها لاحقًا</Card>,
    },
  ];

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">الحضور والانصراف</h1>
      <Tabs defaultActiveKey="1" items={tabItems} direction="rtl" />
    </>
  );
};

export default AttendancePage;
