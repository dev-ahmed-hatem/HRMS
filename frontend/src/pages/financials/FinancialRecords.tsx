import { Form, Input, Select, DatePicker, Button, Card } from "antd";
import dayjs from "dayjs";
import { Income } from "../../types/income";

const { Option } = Select;

const FinancialRecords
 = ({
  onSubmit,
  categories,
  initialValues,
  financialItem,
}: {
  onSubmit?: (values: Income) => void;
  categories?: string[];
  initialValues?: {};
  financialItem: "expense" | "income";
}) => {
  const [form] = Form.useForm();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">
        {initialValues ? "تعديل" : "إضافة"} إيراد
      </h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{ date: dayjs() }}
      >
        <Card title="بيانات الإيراد">
          <Form.Item
            name="amount"
            label="المبلغ"
            rules={[{ required: true, message: "يرجى إدخال المبلغ" }]}
          >
            <Input type="number" placeholder="أدخل المبلغ" />
          </Form.Item>

          <Form.Item
            name="category"
            label="الفئة"
            rules={[{ required: true, message: "يرجى اختيار الفئة" }]}
          >
            <Select placeholder="اختر فئة الإيراد">
              {categories?.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="التاريخ"
            rules={[{ required: true, message: "يرجى اختيار التاريخ" }]}
          >
            <DatePicker format="YYYY-MM-DD" className="w-full" />
          </Form.Item>

          <Form.Item name="description" label="الوصف">
            <Input.TextArea rows={3} placeholder="أدخل وصف الإيراد (اختياري)" />
          </Form.Item>
        </Card>

        <Form.Item className="text-center mt-5">
          <Button type="primary" htmlType="submit" size="large">
            {initialValues ? "تحديث الإيراد" : "إضافة الإيراد"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default FinancialRecords
;
