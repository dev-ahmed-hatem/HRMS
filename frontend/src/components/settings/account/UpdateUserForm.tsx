import { Card, Form, Input, Button } from "antd";
import { useState, useEffect } from "react";
import { useNotification } from "@/providers/NotificationProvider";
import { axiosBaseQueryError } from "@/app/api/axiosBaseQuery";
import { useUserMutation } from "@/app/api/endpoints/users";
import { handleServerErrors } from "@/utils/handleForm";
import { UserOutlined, PhoneOutlined, IdcardOutlined } from "@ant-design/icons";
import { User } from "@/types/user";
import { useAppSelector } from "@/app/redux/hooks";

const UpdateUserForm = () => {
  const notification = useNotification();
  const [form] = Form.useForm();
  const [updateProfile, { isLoading, isError, isSuccess, error }] =
    useUserMutation();

  const user = useAppSelector((state) => state.auth.user);

  const handleSubmit = (values: Partial<User>) => {
    updateProfile({
      url: `users/users/${user?.id}/`,
      method: "PATCH",
      data: values,
    });
  };

  useEffect(() => {
    if (isError) {
      const err = error as axiosBaseQueryError;
      if (err.status === 400) {
        handleServerErrors({
          errorData: err.data as Record<string, string[]>,
          form,
        });
        notification.error({
          message: "أخطاء في البيانات المدخلة",
          // description: "يرجى التحقق من البيانات والمحاولة مرة أخرى",
        });
      } else if (err.status === 409) {
        if (err.data?.phone) {
          form.setFields([
            {
              name: "phone",
              errors: err.data.phone,
            },
          ]);
        }
        if (err.data?.national_id) {
          form.setFields([
            {
              name: "national_id",
              errors: err.data.national_id,
            },
          ]);
        }
      } else {
        notification.error({
          message: err.data?.detail ?? "حدث خطأ أثناء تحديث البيانات",
        });
      }
    }
  }, [isError, error, form, notification]);

  useEffect(() => {
    if (isSuccess) {
      notification.success({
        message: "تم تحديث البيانات بنجاح",
        // description: "تم حفظ التغييرات في الملف الشخصي",
      });
    }
  }, [isSuccess, notification]);

  // Validation rules
  const validationRules = {
    name: [
      { required: true, message: "يرجى إدخال الاسم" },
      { min: 2, message: "الاسم يجب أن يكون على الأقل حرفين" },
      { max: 100, message: "الاسم لا يمكن أن يتجاوز 100 حرف" },
    ],
    phone: [
      { required: true, message: "يرجى إدخال رقم الهاتف" },
      { pattern: /^[0-9+\-\s()]+$/, message: "يرجى إدخال رقم هاتف صحيح" },
      { min: 8, message: "رقم الهاتف يجب أن يكون على الأقل 8 أرقام" },
      { max: 20, message: "رقم الهاتف لا يمكن أن يتجاوز 20 رقم" },
    ],
    national_id: [
      { required: true, message: "يرجى إدخال الرقم القومي" },
      {
        pattern: /^[0-9]+$/,
        message: "الرقم القومي يجب أن يحتوي على أرقام فقط",
      },
      { min: 10, message: "الرقم القومي يجب أن يكون على الأقل 10 أرقام" },
      { max: 20, message: "الرقم القومي لا يمكن أن يتجاوز 20 رقم" },
    ],
  };

  return (
    <Card title="تحديث البيانات الشخصية" className="shadow-md">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ ...user }}
        className="space-y-6"
      >
        {/* Name Field */}
        <Form.Item
          label={
            <span className="font-medium text-gray-700">
              <UserOutlined className="mr-2" />
              الاسم الكامل
            </span>
          }
          name="name"
          rules={validationRules.name}
        >
          <Input
            placeholder="أدخل الاسم الكامل"
            size="large"
            className="rounded-lg"
            prefix={<UserOutlined className="text-gray-400" />}
          />
        </Form.Item>

        {/* Phone Field */}
        <Form.Item
          label={
            <span className="font-medium text-gray-700">
              <PhoneOutlined className="mr-2" />
              رقم الهاتف
            </span>
          }
          name="phone"
          rules={validationRules.phone}
        >
          <Input
            placeholder="أدخل رقم الهاتف"
            size="large"
            className="rounded-lg"
            prefix={<PhoneOutlined className="text-gray-400" />}
            type="tel"
          />
        </Form.Item>

        {/* National ID Field */}
        <Form.Item
          label={
            <span className="font-medium text-gray-700">
              <IdcardOutlined className="mr-2" />
              الرقم القومي
            </span>
          }
          name="national_id"
          rules={validationRules.national_id}
        >
          <Input
            placeholder="أدخل الرقم القومي"
            size="large"
            className="rounded-lg"
            prefix={<IdcardOutlined className="text-gray-400" />}
            type="text"
            inputMode="numeric"
          />
        </Form.Item>

        {/* Info Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                <span className="text-blue-600 text-sm font-bold">!</span>
              </div>
            </div>
            <div className="mr-3">
              <h4 className="text-sm font-medium text-blue-800">ملاحظة هامة</h4>
              <p className="mt-1 text-sm text-blue-700">
                بعد تحديث البيانات، قد تحتاج إلى إعادة تحميل الصفحة أو تسجيل
                الخروج والدخول مرة أخرى لرؤية التغييرات في جميع أجزاء النظام.
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <Button
            onClick={() => form.resetFields()}
            size="large"
            className="px-8"
            disabled={isLoading}
          >
            إعادة تعيين
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading}
            className="px-8"
            icon={<UserOutlined />}
          >
            {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default UpdateUserForm;
