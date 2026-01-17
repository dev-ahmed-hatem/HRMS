import Banner from "../components/home/PortalBanner";
import QuickAccess from "../components/home/QuickAccess";
import DashboardData from "../components/home/DashboardData";

const PortalHome = () => {
  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Employee Welcome Header */}
      <Banner />

      {/* Dashboard Data */}
      <DashboardData />

      {/* quick access */}
      <QuickAccess />
    </div>
  );
};

export default PortalHome;
