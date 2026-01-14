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
  message,
  Space,
  Switch,
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

interface EmployeeAccountProps {
  employee: Employee;
}

const EmployeeAccount: React.FC<EmployeeAccountProps> = ({ employee }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [user, setUser] = useState<User | undefined>(employee.user);

  // Generate default username based on employee info
  const generateDefaultUsername = (): string => {
    const nameParts = employee.name.split(" ");
    const firstName = nameParts[0]?.toLowerCase() || "";
    const lastName = nameParts[nameParts.length - 1]?.toLowerCase() || "";
    return (
      `${firstName}.${lastName}`.replace(/\s+/g, "") ||
      employee.employee_id.toLowerCase()
    );
  };

  // Mock function to create user account linked to employee
  const mockCreateAccount = async (values: any) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      // id: Date.now().toString(), // Temporary ID
      name: employee.name,
      username: values.username,
      phone: employee.phone,
      national_id: employee.national_id,
      is_active: true,
      is_moderator: values.is_moderator || false,
      is_superuser: false,
      is_root: false,
      last_login: undefined,
    };

    setUser(newUser);
    setLoading(false);
    setIsModalVisible(false);
    form.resetFields();
    message.success("تم إنشاء حساب المستخدم بنجاح");

    console.log("Created user account:", newUser);
    // In real app, you would call API to create user and link to employee
  };

  // Mock function to change password
  const mockChangePassword = async (values: any) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setIsModalVisible(false);
    form.resetFields();
    message.success("تم تغيير كلمة المرور بنجاح");
    console.log("Changed password for user:", user?.username);
  };

  // Mock function to toggle user active status
  const mockToggleUserStatus = async (active: boolean) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    setUser((prev) =>
      prev
        ? {
            ...prev,
            is_active: active,
          }
        : prev
    );

    setLoading(false);
    message.success(
      active ? "تم تفعيل حساب المستخدم" : "تم تعطيل حساب المستخدم"
    );
  };

  // Mock function to assign moderator role
  const mockToggleModeratorRole = async (isModerator: boolean) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    setUser((prev) =>
      prev
        ? {
            ...prev,
            is_moderator: isModerator,
          }
        : prev
    );

    setLoading(false);
    message.success(
      isModerator ? "تم منح صلاحية المشرف" : "تم إزالة صلاحية المشرف"
    );
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
          onFinish={mockCreateAccount}
          initialValues={{
            username: generateDefaultUsername(),
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
                help="يمكن استخدام الأحرف الإنجليزية والأرقام والنقاط والشرطة السفلية"
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
                help="يمكن تغييرها فيما بعد"
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="أدخل كلمة المرور الابتدائية"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="confirmPassword"
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
              loading={loading}
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

  // If user account exists, show account details and management options
  return (
    <>
      <Card
        title={
          <span>
            <UserOutlined /> حساب نظام الموظف
          </span>
        }
        className="account-management-card"
      >
        <Spin spinning={loading}>
          <Descriptions
            title="معلومات حساب النظام"
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="اسم المستخدم">
              <strong>{user.username}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="الاسم الكامل">
              {user.name}
            </Descriptions.Item>
            <Descriptions.Item label="البريد الإلكتروني">
              {employee.email}
            </Descriptions.Item>
            <Descriptions.Item label="رقم الهاتف">
              {user.phone}
            </Descriptions.Item>
            <Descriptions.Item label="الرقم القومي">
              {user.national_id}
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
            <Descriptions.Item label="حالة الحساب">
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
            </Descriptions.Item>
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
        <Form form={form} layout="vertical" onFinish={mockChangePassword}>
          <Form.Item
            name="newPassword"
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
            name="confirmNewPassword"
            label="تأكيد كلمة المرور الجديدة"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "يرجى تأكيد كلمة المرور الجديدة" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
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
            <Button type="primary" htmlType="submit" loading={loading}>
              تغيير كلمة المرور
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EmployeeAccount;
