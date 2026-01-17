import { Empty } from "antd";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
};

const EmptyState = ({ icon, title, description, actions }: EmptyStateProps) => (
  <div className="py-10">
    <Empty
      image={icon}
      styles={{ image: { fontSize: 68, color: "#94a3b8" } }}
      description={
        <div className="text-center space-y-3">
          <div className="font-medium text-gray-700">{title}</div>

          {description && (
            <div className="text-sm text-gray-500">{description}</div>
          )}

          {actions && (
            <div className="pt-2 flex justify-center gap-2">{actions}</div>
          )}
        </div>
      }
    />
  </div>
);

export default EmptyState;
