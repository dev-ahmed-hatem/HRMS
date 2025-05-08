import { Form, Input, Select, DatePicker, Button, Row, Col, Card } from "antd";
import dayjs from "dayjs";
import { Employee } from "../../types/employee";
import UploadImage from "../../components/employee/UploadImage";
import { useState } from "react";

const { Option } = Select;

const AddEmployee = ({
  initialValues,
  onSubmit,
}: {
  initialValues?: Employee;
  onSubmit?: (values: Employee) => void;
}) => {
  const [form] = Form.useForm();
  const [image, setImage] = useState<File | null>(null);

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">
        {initialValues ? "تعديل" : "إضافة"} موظف
      </h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          ...initialValues,
          birth_date: initialValues?.birth_date
            ? dayjs(initialValues.birth_date)
            : dayjs(1970 - 1 - 1),
          hire_date: initialValues?.hire_date
            ? dayjs(initialValues.hire_date)
            : dayjs(),
        }}
        className="add-form"
      >
        {/* Personal Details Section */}
        <Card title="البيانات الشخصية" className="mb-16">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="الاسم"
                rules={[{ required: true, message: "يرجى إدخال الاسم" }]}
              >
                <Input placeholder="أدخل الاسم" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="gender"
                label="الجنس"
                rules={[{ required: true, message: "يرجى تحديد الجنس" }]}
              >
                <Select placeholder="اختر الجنس">
                  <Option value="ذكر">ذكر</Option>
                  <Option value="أنثى">أنثى</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="البريد الإلكتروني"
                rules={[
                  { type: "email", message: "البريد الإلكتروني غير صالح" },
                ]}
              >
                <Input placeholder="example@email.com" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="رقم الهاتف"
                rules={[{ required: true, message: "يرجى إدخال رقم الهاتف" }]}
              >
                <Input placeholder="أدخل رقم الهاتف" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item name="address" label="العنوان">
                <Input placeholder="أدخل العنوان" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="age"
                label="العمر"
                rules={[{ required: true, message: "يرجى إدخال العمر" }]}
              >
                <Input type="number" placeholder="أدخل العمر" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item name="birthDate" label="تاريخ الميلاد">
                <DatePicker
                  format="YYYY-MM-DD"
                  className="w-full"
                  placeholder="اختر تاريخ الميلاد"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="nationalId"
                label="الرقم القومي"
                rules={[{ required: true, message: "يرجى إدخال الرقم القومي" }]}
              >
                <Input placeholder="أدخل الرقم القومي" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="maritalStatus"
                label="الحالة الاجتماعية"
                rules={[
                  { required: true, message: "يرجى تحديد الحالة الاجتماعية" },
                ]}
              >
                <Select placeholder="اختر الحالة الاجتماعية">
                  <Option value="أعزب">أعزب</Option>
                  <Option value="متزوج">متزوج</Option>
                  <Option value="مطلق">مطلق</Option>
                  <Option value="أرمل">أرمل</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="picture" label="الصورة">
                <UploadImage setFile={setImage} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Job Details Section */}
        <Card title="تفاصيل الوظيفة" style={{ marginBottom: 20 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="employeeID"
                label="معرف الموظف (الكود)"
                rules={[{ required: true, message: "يرجى إدخال معرف الموظف" }]}
              >
                <Input placeholder="أدخل معرف الموظف" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="position"
                label="المسمى الوظيفي"
                rules={[
                  { required: true, message: "يرجى إدخال المسمى الوظيفي" },
                ]}
              >
                <Input placeholder="أدخل المسمى الوظيفي" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="department"
                label="القسم"
                rules={[{ required: true, message: "يرجى إدخال القسم" }]}
              >
                <Input placeholder="أدخل القسم" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="hireDate" label="تاريخ التوظيف">
                <DatePicker
                  format="YYYY-MM-DD"
                  className="w-full"
                  placeholder="اختر تاريخ التوظيف"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="mode"
                label="وضع العمل"
                rules={[{ required: true, message: "يرجى تحديد وضع العمل" }]}
              >
                <Select placeholder="اختر وضع العمل">
                  <Option value="عن بُعد">عن بُعد</Option>
                  <Option value="من المقر">من المقر</Option>
                  <Option value="هجين">هجين</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Submit Button */}
        <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
          <Button type="primary" htmlType="submit" size="large">
            {initialValues ? "تحديث البيانات" : "إضافة الموظف"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddEmployee;
