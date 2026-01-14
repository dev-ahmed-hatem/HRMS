import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Alert,
  Descriptions,
  Tag,
  Divider,
  Modal,
  Space,
  Spin,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  CheckCircleOutlined,
  KeyOutlined,
  PhoneOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Employee } from "@/types/employee";
import { User } from "@/types/user";
import {
  useChangeEmployeeAccountPasswordMutation,
  useCreateEmployeeAccountMutation,
} from "@/app/api/endpoints/employees";
import { useNotification } from "@/providers/NotificationProvider";
import { handleServerErrors } from "@/utils/handleForm";

interface EmployeeAccountProps {
  employee: Employee;
}

const EmployeeAccount: React.FC<EmployeeAccountProps> = ({ employee }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [user, setUser] = useState<User | undefined>(employee.user);
  const notification = useNotification();

  // redux queries
  const [createAccount, { isLoading: creating }] =
    useCreateEmployeeAccountMutation();
  const [changePassword, { isLoading: changing }] =
    useChangeEmployeeAccountPasswordMutation();

  // Generate default username based on employee info (not used currently)
  const generateDefaultUsername = (): string => {
    const nameParts = employee.name.split(" ");
    const firstName = nameParts[0]?.toLowerCase() || "";
    const lastName = nameParts[nameParts.length - 1]?.toLowerCase() || "";
    return (
      `${firstName}.${lastName}`.replace(/\s+/g, "") ||
      employee.employee_id.toLowerCase()
    );
  };

  const handleSubmit = async (values: any) => {
    try {
      const data = {
        id: employee.id,
        username: values.username,
        password: values.password,
        password2: values.password2,
      };

      const result = await createAccount(data).unwrap();
      setUser(result);

      notification.success({ message: "تم إنشاء حساب الموظف بنجاح" });

      form.resetFields();
    } catch (error: any) {
      handleServerErrors({
        errorData: error.data as Record<string, string[]>,
        form,
      });
      notification.error({ message: "خطأ في إضافة الموظف!" });
    }
  };

  // change password handler
  const handleChangePassword = async (values: any) => {
    try {
      const data = {
        id: employee.id,
        new_password: values.password,
        confirm_new_password: values.password2,
      };

      await changePassword(data).unwrap();

      notification.success({ message: "تم تغيير كلمة مرور الحساب بنجاح" });

      form.resetFields();

      handleCancel();
    } catch (error: any) {
      handleServerErrors({
        errorData: error.data as Record<string, string[]>,
        form,
      });
      notification.error({ message: "خطأ في العميلة!" });
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // If no user account exists, show create account form
  if (!user) {
    return (
      <Card
        title={
          <span>
            <UserOutlined /> حساب الموظف
          </span>
        }
        className="account-management-card"
      >
        <Alert
          message="حساب الموظف غير موجود"
          description="هذا الموظف لا يملك حساب بعد. يمكنك إنشاء حساب له للوصول إلى النظام."
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />

        <div style={{ marginBottom: 24 }}>
          <Descriptions bordered={true} column={{ xs: 1 }}>
            <Descriptions.Item label="الموظف">
              <strong>{employee.name}</strong> ({employee.employee_id})
            </Descriptions.Item>
            <Descriptions.Item label="البريد الإلكتروني">
              {employee.email}
            </Descriptions.Item>
            <Descriptions.Item label="رقم الهاتف">
              {employee.phone}
            </Descriptions.Item>
            <Descriptions.Item label="الرقم القومي">
              {employee.national_id}
            </Descriptions.Item>
            <Descriptions.Item label="الوظيفة">
              {employee.position}
            </Descriptions.Item>
            <Descriptions.Item label="القسم">
              {employee.department}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider>إنشاء حساب جديد</Divider>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            // username: generateDefaultUsername(),
            phone: employee.phone,
            national_id: employee.national_id,
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="username"
                label="اسم المستخدم"
                rules={[
                  { required: true, message: "يرجى إدخال اسم المستخدم" },
                  {
                    min: 3,
                    message: "يجب أن يكون اسم المستخدم 3 أحرف على الأقل",
                  },
                  { max: 20, message: "يجب أن لا يتجاوز اسم المستخدم 20 حرف" },
                  {
                    pattern: /^[a-zA-Z0-9._]+$/,
                    message:
                      "اسم المستخدم يمكن أن يحتوي على أحرف إنجليزية وأرقام ونقاط وشرطة سفلية فقط",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="أدخل اسم المستخدم"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}></Col>
          </Row>

          <Row gutter={16} className="my-4">
            <Col xs={24} md={12}>
              <Form.Item
                name="password"
                label="كلمة المرور الابتدائية"
                rules={[
                  { required: true, message: "يرجى إدخال كلمة المرور" },
                  {
                    min: 8,
                    message: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="أدخل كلمة المرور الابتدائية"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="password2"
                label="تأكيد كلمة المرور"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "يرجى تأكيد كلمة المرور" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("كلمات المرور غير متطابقة")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="أكد كلمة المرور"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="رقم الهاتف"
                rules={[{ required: true, message: "يرجى إدخال رقم الهاتف" }]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="رقم الهاتف"
                  disabled
                  suffix={<Tag color="blue">مأخوذ من بيانات الموظف</Tag>}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="national_id"
                label="الرقم القومي"
                rules={[{ required: true, message: "يرجى إدخال الرقم القومي" }]}
              >
                <Input
                  prefix={<IdcardOutlined />}
                  placeholder="الرقم القومي"
                  disabled
                  suffix={<Tag color="blue">مأخوذ من بيانات الموظف</Tag>}
                />
              </Form.Item>
            </Col>
          </Row>

          <Alert
            message="ملاحظة هامة"
            description="سيتم إنشاء حساب مستخدم مرتبط بهذا الموظف. يمكن للموظف استخدام اسم المستخدم وكلمة المرور للدخول إلى النظام."
            type="warning"
            showIcon
            className="my-4"
          />

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={creating}
              icon={<CheckCircleOutlined />}
              size="large"
            >
              إنشاء حساب المستخدم
            </Button>
            <Button
              style={{ marginRight: 8 }}
              onClick={() => form.resetFields()}
              size="large"
            >
              إعادة تعيين
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }

  return (
    <>
      <Card
        title={
          <span>
            <UserOutlined /> حساب الموظف
          </span>
        }
        className="account-management-card"
      >
        <Spin spinning={changing}>
          <Descriptions
            title="معلومات حساب النظام"
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="اسم المستخدم">
              <strong>{user.username}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="الاسم الكامل">
              {employee.name}
            </Descriptions.Item>
            <Descriptions.Item label="البريد الإلكتروني">
              {employee.email}
            </Descriptions.Item>
            <Descriptions.Item label="رقم الهاتف">
              {employee.phone}
            </Descriptions.Item>
            <Descriptions.Item label="الرقم القومي">
              {employee.national_id}
            </Descriptions.Item>
            <Descriptions.Item label="آخر دخول">
              {user.last_login ? (
                <Tag color="green">
                  {dayjs(user.last_login).format("DD/MM/YYYY HH:mm")}
                </Tag>
              ) : (
                <Tag color="orange">لم يسجل دخول بعد</Tag>
              )}
            </Descriptions.Item>
            {/* <Descriptions.Item label="حالة الحساب">
              <Space>
                <Switch
                  checked={user.is_active}
                  onChange={mockToggleUserStatus}
                  checkedChildren="مفعل"
                  unCheckedChildren="معطل"
                />
                <Tag color={user.is_active ? "green" : "red"}>
                  {user.is_active ? "نشط" : "معطل"}
                </Tag>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="صلاحية المشرف">
              <Space>
                <Switch
                  checked={user.is_moderator}
                  onChange={mockToggleModeratorRole}
                  checkedChildren="نعم"
                  unCheckedChildren="لا"
                />
                {user.is_moderator && <Tag color="orange">مشرف</Tag>}
              </Space>
            </Descriptions.Item> */}
          </Descriptions>

          <Divider>إجراءات إدارة الحساب</Divider>

          <Space wrap style={{ marginBottom: 20 }}>
            <Button
              type="primary"
              icon={<KeyOutlined />}
              onClick={() => showModal()}
            >
              تغيير كلمة المرور
            </Button>
          </Space>

          {user.is_moderator && (
            <Alert
              message="ملاحظة"
              description="هذا المستخدم لديه صلاحيات المشرف ويمكنه الوصول إلى لوحة التحكم وإدارة بعض الإعدادات."
              type="info"
              showIcon
              style={{ marginBottom: 20 }}
            />
          )}
        </Spin>
      </Card>

      {/* Modal for various actions */}
      <Modal
        title={"تغيير كلمة المرور"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            name="password"
            label="كلمة المرور الجديدة"
            rules={[
              { required: true, message: "يرجى إدخال كلمة المرور الجديدة" },
              { min: 8, message: "يجب أن تكون كلمة المرور 8 أحرف على الأقل" },
            ]}
            help="كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل"
          >
            <Input.Password placeholder="أدخل كلمة المرور الجديدة" />
          </Form.Item>

          <Form.Item
            name="password2"
            label="تأكيد كلمة المرور الجديدة"
            dependencies={["password"]}
            rules={[
              { required: true, message: "يرجى تأكيد كلمة المرور الجديدة" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("كلمات المرور غير متطابقة"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="أكد كلمة المرور الجديدة" />
          </Form.Item>

          <Form.Item style={{ textAlign: "left" }}>
            <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
              إلغاء
            </Button>
            <Button type="primary" htmlType="submit" loading={changing}>
              تغيير كلمة المرور
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EmployeeAccount;
