import { Button, Card, TimePicker } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { SaveOutlined } from "@ant-design/icons";

const AttendanceSettings = () => {
  const [standardCheckIn, setStandardCheckIn] = useState("10:00");
  const [standardCheckOut, setStandardCheckOut] = useState("17:00");
  return (
    <Card title="إعدادات الحضور والانصراف" className="shadow-lg rounded-xl">
      <div className="flex gap-6 md:gap-12 mb-4 flex-wrap mt-8">
        <div className="flex gap-x-4 items-center flex-wrap">
          <span className="font-semibold">وقت الحضور الرسمي:</span>
          <TimePicker
            value={dayjs(standardCheckIn, "HH:mm")}
            format="HH:mm"
            onChange={(time) => setStandardCheckIn(time.format("HH:mm"))}
          />
        </div>
        <div className="flex gap-x-4 items-center flex-wrap">
          <span className="font-semibold">وقت الانصراف الرسمي:</span>
          <TimePicker
            value={dayjs(standardCheckOut, "HH:mm")}
            format="HH:mm"
            onChange={(time) => setStandardCheckOut(time.format("HH:mm"))}
          />
        </div>
      </div>
      <div className="mt-10">
        <Button type="primary" icon={<SaveOutlined />}>
          حفظ
        </Button>
      </div>
    </Card>
  );
};

export default AttendanceSettings;
