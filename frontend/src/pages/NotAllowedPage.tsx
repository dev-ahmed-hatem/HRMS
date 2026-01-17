import { Button } from "antd";
import { LockOutlined, HomeOutlined, ReloadOutlined } from "@ant-design/icons";

const NotAllowedPage = ({
  title,
  subtitle,
  showHomeButton = true,
  showReload = false,
  customAction,
}: {
  title?: string;
  subtitle?: string;
  showHomeButton?: boolean;
  showReload?: boolean;
  customAction?: React.ReactNode;
}) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center p-8 min-h-96">
      {/* Icon */}
      <div className="mb-6 text-red-500">
        <LockOutlined className="text-6xl" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {title || "غير مسموح بالوصول"}
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        {subtitle || "عذرًا .. ليس لديك الصلاحية للوصول إلى هذه الصفحة."}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        {showReload && (
          <Button
            type="default"
            size="large"
            icon={<ReloadOutlined />}
            onClick={() => window.location.reload()}
            className="border-gray-300"
          >
            إعادة تحميل
          </Button>
        )}

        {showHomeButton && (
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={() => {
              window.location.href = "/";
            }}
          >
            العودة للرئيسية
          </Button>
        )}

        {customAction}
      </div>
    </div>
  );
};

export default NotAllowedPage;
