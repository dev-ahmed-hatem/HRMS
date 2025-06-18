import { Button, Card, InputNumber, TimePicker } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { SaveOutlined } from "@ant-design/icons";

const OfficialTimes = () => {
  const [standardCheckIn, setStandardCheckIn] = useState("10:00");
  const [standardCheckOut, setStandardCheckOut] = useState("17:00");
  const [gracePeriod, setGracePeriod] = useState<number>(10);
  return (
    <Card title="المواعيد الرسمية" className="shadow-lg rounded-xl mb-8 pb-6">
      <div className="flex flex-wrap gap-6 md:gap-12 justify-between">
        <div className="flex flex-wrap gap-6 md:gap-12">
          <div className="flex gap-x-4 items-center">
            <span className="font-semibold">وقت الحضور الرسمي:</span>
            <TimePicker
              value={dayjs(standardCheckIn, "HH:mm")}
              format="HH:mm"
              onChange={(time) =>
                time && setStandardCheckIn(time.format("HH:mm"))
              }
            />
          </div>
          <div className="flex gap-x-4 items-center">
            <span className="font-semibold">وقت الانصراف الرسمي:</span>
            <TimePicker
              value={dayjs(standardCheckOut, "HH:mm")}
              format="HH:mm"
              onChange={(time) =>
                time && setStandardCheckOut(time.format("HH:mm"))
              }
            />
          </div>
          <div className="flex gap-x-4 items-center">
            <span className="font-semibold">فترة السماحية (دقائق):</span>
            <InputNumber
              min={0}
              value={gracePeriod}
              onChange={(value) => value !== null && setGracePeriod(value)}
            />
          </div>
        </div>
        <Button type="primary" icon={<SaveOutlined />}>
          حفظ
        </Button>
      </div>
    </Card>
  );
};

export default OfficialTimes;
