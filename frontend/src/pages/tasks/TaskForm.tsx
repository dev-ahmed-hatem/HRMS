import { Form, Input, Select, DatePicker, Button, Row, Col, Card } from "antd";
import dayjs from "dayjs";
import { Task } from "../../types/task";
import { Project } from "../../types/project";

const { Option } = Select;

const TaskForm = ({
  initialValues,
  onSubmit,
  project,
  projects = [],
}: {
  initialValues?: Task;
  onSubmit?: (values: Task) => void;
  project?: Project; // Optional project for task assignment
  projects?: Project[]; // List of all projects for selection
}) => {
  const [form] = Form.useForm();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">
        {initialValues ? "تعديل" : "إضافة"} مهمة
      </h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          ...initialValues,
          dueDate: initialValues?.due_date ? dayjs(initialValues.due_date) : null,
          projectId: project?.id, // Pre-fill project if provided
        }}
        className="add-form"
      >
        {/* General Task Details */}
        <Card title="تفاصيل المهمة" className="mb-16">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="title"
                label="اسم المهمة"
                rules={[{ required: true, message: "يرجى إدخال اسم المهمة" }]}
              >
                <Input placeholder="أدخل اسم المهمة" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="department" label="القسم">
                <Input placeholder="القسم المسؤول عن المهمة" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item name="description" label="وصف المهمة">
                <Input.TextArea
                  rows={3}
                  placeholder="أدخل وصف المهمة (اختياري)"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Task Assignment Details */}
        <Card title="إعدادات المهمة" className="mb-16">
          <Row gutter={[16, 16]}>
            {/* Project Selection (Optional) */}
            <Col xs={24} md={12}>
              <Form.Item name="projectId" label="المشروع (اختياري)">
                <Select
                  placeholder="اختر المشروع"
                  defaultValue={project?.id}
                  disabled={!!project} // Disable if a project is passed
                  allowClear
                >
                  {projects.map((proj) => (
                    <Option key={proj.id} value={proj.id}>
                      {proj.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Assigned Person */}
            <Col xs={24} md={12}>
              <Form.Item
                name="assignedTo"
                label="المسؤول عن المهمة"
                rules={[
                  { required: true, message: "يرجى اختيار المسؤول عن المهمة" },
                ]}
              >
                <Select placeholder="اختر المسؤول" mode="multiple">
                  <Option value="محمد">محمد</Option>
                  <Option value="أحمد">أحمد</Option>
                  <Option value="سارة">سارة</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {/* Task Priority */}
            <Col xs={24} md={12}>
              <Form.Item
                name="priority"
                label="أولوية المهمة"
                rules={[{ required: true, message: "يرجى اختيار الأولوية" }]}
              >
                <Select placeholder="اختر الأولوية">
                  <Option value="مرتفع">مرتفع</Option>
                  <Option value="متوسط">متوسط</Option>
                  <Option value="منخفض">منخفض</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Task Status */}
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="حالة المهمة"
                rules={[{ required: true, message: "يرجى اختيار حالة المهمة" }]}
              >
                <Select placeholder="اختر الحالة">
                  <Option value="غير مكتمل">غير مكتمل</Option>
                  <Option value="مكتمل">مكتمل</Option>
                  <Option value="متأخر">متأخر</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Due Date */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="dueDate"
                label="الموعد النهائي"
                rules={[
                  { required: true, message: "يرجى اختيار الموعد النهائي" },
                ]}
              >
                <DatePicker format="YYYY-MM-DD" className="w-full" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Submit Button */}
        <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
          <Button type="primary" htmlType="submit" size="large">
            {initialValues ? "تحديث المهمة" : "إضافة المهمة"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default TaskForm;
