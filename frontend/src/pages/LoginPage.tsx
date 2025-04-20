import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const LoginPage = () => {
  const onFinish = (values: any) => {
    console.log("Login data:", values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-md overflow-hidden flex flex-col md:flex-row w-full max-w-md md:max-w-4xl">
        {/* Left: Logo */}
        <div className="md:w-1/2 max-md:h-52 bg-calypso flex items-center justify-center">
          <img
            src="/kaffo.jpeg" // Replace with your logo path
            alt="Logo"
            className="h-full object-cover"
          />
        </div>

        {/* Right: Form */}
        <div className="md:w-1/2 w-full p-6 sm:p-10 flex flex-col justify-center text-right border-t-4 md:border-t-0 md:border-e-4 border-calypso">
          <h2 className="text-2xl font-bold mb-8">تسجيل دخول</h2>

          <Form
            layout="vertical"
            onFinish={onFinish}
            className="rtl text-right"
          >
            <Form.Item
              label="اسم المستخدم:"
              name="username"
              rules={[{ required: true, message: "يرجى إدخال اسم المستخدم" }]}
            >
              <Input
                size="large"
                placeholder="اسم المستخدم"
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              label="كلمة المرور:"
              name="password"
              rules={[{ required: true, message: "يرجى إدخال كلمة المرور" }]}
            >
              <Input.Password
                size="large"
                placeholder="كلمة المرور"
                prefix={<LockOutlined />}
              />
            </Form.Item>

            <Form.Item className="text-center mt-10">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="text-white w-full"
              >
                تسجيل دخول
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
