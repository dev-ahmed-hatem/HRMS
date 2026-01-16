import { useEffect } from "react";
import { Input, Modal, Form } from "antd";
import { TeamOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import type { Department } from "@/types/department";
import { FaBuilding } from "react-icons/fa6";

interface DepartmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: Department;
  loading: boolean;
}

const DepartmentForm = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  loading,
}: DepartmentFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    onSubmit(initialValues ? { ...initialValues, ...values } : values);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FaBuilding className="text-calypso" />
          {initialValues ? "تعديل القسم" : "إضافة قسم جديد"}
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={form.submit}
      confirmLoading={loading}
      okText={initialValues ? "تعديل" : "إضافة"}
      cancelText="إلغاء"
      width={500}
      destroyOnClose
      okButtonProps={{
        icon: <CheckOutlined />,
      }}
      cancelButtonProps={{
        icon: <CloseOutlined />,
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="mt-6"
      >
        <Form.Item
          name="name"
          label="اسم القسم"
          rules={[
            { required: true, message: "يرجى إدخال اسم القسم" },
            { min: 2, message: "يجب أن يكون الاسم على الأقل حرفين" },
            { max: 100, message: "لا يمكن أن يتجاوز الاسم 100 حرف" },
          ]}
        >
          <Input
            placeholder="اسم القسم كما سيظهر في النظام"
            size="large"
            prefix={<TeamOutlined className="text-gray-400" />}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DepartmentForm;
