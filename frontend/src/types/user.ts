export type User = {
  id: number;
  name: string;
  username: string;
  phone: string;
  national_id: string;
  is_active: boolean;
  is_moderator: boolean;
  is_superuser: boolean;
  is_root: boolean;
  last_login?: string;
};
