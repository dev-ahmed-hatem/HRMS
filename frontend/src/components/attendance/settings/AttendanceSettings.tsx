import OfficialTimes from "./sections/OfficialTimes";
import WorkSchedules from "./sections/WorkSchedules";
import Holidays from "./sections/Holidays";
import EmergencyDays from "./sections/EmergencyDays";

const AttendanceSettings = () => {
  return (
    <>
      {/* Section 1: Official Times */}
      <OfficialTimes />

      {/* Section 2: Work Schedule */}
      <WorkSchedules />

      {/* Section 3: Holidays */}
      <Holidays />

      {/* Section 4: Emergency Attendance Days */}
      <EmergencyDays />
    </>
  );
};

export default AttendanceSettings;
