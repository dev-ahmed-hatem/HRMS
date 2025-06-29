import OfficialTimes from "./sections/OfficialTimes";
import WorkSchedules from "./sections/WorkSchedules";
import Holidays from "./sections/Holidays";
import EmergencyDays from "./sections/EmergencyDays";
import { createContext } from "react";
import { AttendanceSettings as AttendanceSettingsType } from "@/types/attendance";
import { useGetAttendanceSettingsQuery } from "@/app/api/endpoints/attendance";
import Error from "@/pages/Error";
import Loading from "@/components/Loading";

export const AttendanceContext = createContext<AttendanceSettingsType | undefined>(
  undefined
);

const AttendanceSettings = () => {
  const { data, isLoading, isError, isSuccess } =
    useGetAttendanceSettingsQuery();

  if (isLoading) return <Loading />;
  if (isError) {
    return (
      <Error subtitle={"حدث خطأ أثناء تحميل إعدادات الحضور"} reload={true} />
    );
  }
  return (
    <AttendanceContext.Provider value={data}>
      {/* Section 1: Official Times */}
      <OfficialTimes />

      {/* Section 2: Work Schedule */}
      <WorkSchedules />

      {/* Section 3: Holidays */}
      <Holidays />

      {/* Section 4: Emergency Attendance Days */}
      <EmergencyDays />
    </AttendanceContext.Provider>
  );
};

export default AttendanceSettings;
