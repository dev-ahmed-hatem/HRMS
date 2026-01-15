import { Divider, Tabs } from "antd";
import { useAppSelector } from "@/app/redux/hooks";
import ProfileBanner from "@/components/settings/ProfileBanner";
import ChangePassword from "@/components/settings/account/ChangePassword";
import AccountSettingsTab from "@/components/settings/account/AccountSettingsTab";
// import AccountSettingsTab from "@/components/settings/account/AccountSettingsTab";
// import ProfileBanner from "@/components/settings/account/ProfileBanner";
// import SupervisorSettingsTab from "@/components/settings/supervisors/SupervisorSettingsTab";
// import ManagerSettingsTab from "@/components/settings/managers/ManagerSettingsTab";

const SettingsPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const employee = useAppSelector((state) => state.employee.employee);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="mb-6 text-2xl font-bold">الإعدادات</h1>

      <ProfileBanner user={user!} employee={employee} />

      <Divider />

      <Tabs
        renderTabBar={(props, DefaultTabBar) => (
          <DefaultTabBar {...props} className="md:ps-2" />
        )}
        direction="rtl"
        defaultActiveKey="account"
        items={[
          {
            key: "account",
            label: "الحساب",
            children: <AccountSettingsTab />,
          },
        ]}
      />
    </div>
  );
};

export default SettingsPage;
