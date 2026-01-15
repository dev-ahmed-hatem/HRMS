import { useAppSelector } from "@/app/redux/hooks";
import ChangePassword from "./ChangePassword";
import UpdateUserForm from "./UpdateUserForm";

const AccountSettingsTab = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="space-y-6">
      {(user?.is_superuser || user?.is_moderator) && <UpdateUserForm />}
      <ChangePassword />
    </div>
  );
};

export default AccountSettingsTab;
