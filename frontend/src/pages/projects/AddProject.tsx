import { Form, Input, Select, DatePicker, Button, Row, Col, Card } from "antd";
import dayjs from "dayjs";
import { Project } from "../../types/project";

const { Option } = Select;

const AddProject = ({
  initialValues,
  onSubmit,
}: {
  initialValues?: Project;
  onSubmit?: (values: Project) => void;
}) => {
  const [form] = Form.useForm();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">
        {initialValues ? "تعديل" : "إضافة"} مشروع
      </h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          ...initialValues,
          startDate: initialValues?.startDate
            ? dayjs(initialValues.startDate)
            : dayjs(),
          endDate: initialValues?.endDate ? dayjs(initialValues.endDate) : null,
        }}
        className="add-form"
      >
        {/* General Information Section */}
        <Card title="المعلومات العامة" className="mb-16">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="projectID"
                label="معرف المشروع (الكود)"
                rules={[{ required: true, message: "يرجى إدخال معرف المشروع" }]}
              >
                <Input placeholder="أدخل معرف المشروع" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="اسم المشروع"
                rules={[{ required: true, message: "يرجى إدخال اسم المشروع" }]}
              >
                <Input placeholder="أدخل اسم المشروع" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item name="client" label="العميل">
                <Input placeholder="أدخل اسم العميل" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="budget" label="الميزانية">
                <Input type="number" placeholder="أدخل الميزانية (اختياري)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item name="description" label="وصف المشروع">
                <Input.TextArea
                  rows={3}
                  placeholder="أدخل وصف المشروع (اختياري)"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Project Details Section */}
        <Card title="تفاصيل المشروع" style={{ marginBottom: 20 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="startDate"
                label="تاريخ البدء"
                rules={[{ required: true, message: "يرجى اختيار تاريخ البدء" }]}
              >
                <DatePicker format="YYYY-MM-DD" className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="endDate" label="تاريخ الانتهاء">
                <DatePicker format="YYYY-MM-DD" className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="حالة المشروع"
                rules={[{ required: true, message: "يرجى تحديد حالة المشروع" }]}
              >
                <Select placeholder="اختر حالة المشروع">
                  <Option value="قيد التنفيذ">قيد التنفيذ</Option>
                  <Option value="مكتمل">مكتمل</Option>
                  <Option value="متوقف">متوقف</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="teamMembers"
                label="أعضاء الفريق"
                rules={[
                  { required: true, message: "يرجى اختيار أعضاء الفريق" },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="اختر أعضاء الفريق"
                  allowClear
                >
                  {/* Dynamic team members list - Replace with actual employee names/IDs */}
                  <Option value="1">محمد</Option>
                  <Option value="2">أحمد</Option>
                  <Option value="3">سارة</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Submit Button */}
        <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
          <Button type="primary" htmlType="submit" size="large">
            {initialValues ? "تحديث المشروع" : "إضافة المشروع"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddProject;
