import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Card,
  Descriptions,
  Tag,
  Avatar,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Employee } from "@/types/employee";
import UploadImage from "@/components/file-handling/UploadImage";
import { useEffect, useState } from "react";
import {
  useEmployeeMutation,
  useGetAllDepartmentsQuery,
} from "@/app/api/endpoints/employees";
import Error from "@/pages/Error";
import Loading from "@/components/Loading";
import { calculateAge } from "@/utils";
import UploadFile from "@/components/file-handling/UploadFile";
import { useNotification } from "@/providers/NotificationProvider";
import { handleServerErrors } from "@/utils/handleForm";
import { axiosBaseQueryError } from "@/app/api/axiosBaseQuery";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
  CalendarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { IoBriefcase } from "react-icons/io5";

const { Option } = Select;

type EmployeeDataValues = Omit<Employee, "image" | "cv"> & {
  image?: File | null;
  cv?: File | null;
  birth_date: Dayjs;
};

const EmployeeDataForm = ({
  initialValues,
}: {
  initialValues?: Omit<Employee, "mode"> & {mode?: "on-site" | "remote" | "hybrid"};
}) => {
  const [form] = Form.useForm();
  const [image, setImage] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const notification = useNotification();

  const {
    data: departments,
    isFetching,
    isError,
  } = useGetAllDepartmentsQuery();

  const [
    updateEmployee,
    {
      data: empData,
      isLoading: empLoad,
      isError: empIsError,
      isSuccess: empDone,
      error: empError,
    },
  ] = useEmployeeMutation();

  const handleSubmit = (values: EmployeeDataValues) => {
    const data = {
      ...values,
      birth_date: values.birth_date.format("YYYY-MM-DD"),
    };
    if (image) data.image = image;
    if (cv) data.cv = cv;

    // Remove read-only fields that shouldn't be sent
    const {
      name,
      employee_id,
      position,
      department,
      hire_date,
      mode,
      ...submitData
    } = data;

    updateEmployee({
      data: submitData as Employee,
      method: "PATCH",
      url: `/employees/employees/${initialValues!.id}/`,
    });
  };

  useEffect(() => {
    if (empIsError) {
      const error = empError as axiosBaseQueryError;
      if (error.status == 400) {
        handleServerErrors({
          errorData: error.data as Record<string, string[]>,
          form,
        });
      }
      notification.error({ message: "خطأ في تحديث البيانات!" });
    }
  }, [empIsError]);

  useEffect(() => {
    if (empDone) {
      notification.success({
        message: `تم تحديث البيانات بنجاح`,
      });
    }
  }, [empDone]);

  if (isFetching) return <Loading />;
  if (isError) return <Error />;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">إعدادات الموظف</h1>
        <p className="text-gray-600 mt-2">تحديث المعلومات الشخصية</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={(changed) => {
          if (changed.birth_date) {
            const age = calculateAge(
              dayjs(changed.birth_date).format("YYYY-MM-DD")
            );
            form.setFieldsValue({ age });
          }
        }}
        initialValues={{
          age: calculateAge(initialValues?.birth_date || "1970-01-01"),
          ...initialValues,
          birth_date: initialValues?.birth_date
            ? dayjs(initialValues.birth_date)
            : dayjs("1970-01-01"),
        }}
        className="settings-form"
      >
        <Card className="mb-8 border-0 shadow-sm bg-gradient-to-r from-blue-50 to-gray-50">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              {initialValues?.image ? (
                <Avatar
                  src={initialValues.image}
                  size={120}
                  className="border-4 border-white shadow-lg"
                />
              ) : (
                <Avatar
                  size={120}
                  className="bg-blue-100 text-blue-600 border-4 border-white shadow-lg flex items-center justify-center"
                  icon={<UserOutlined className="text-4xl" />}
                />
              )}
              <div className="absolute top-1/2 -translate-y-[70px]">
                <Button
                  size="small"
                  type="link"
                  className="bg-white shadow-md rounded-full p-2 hover:bg-gray-50"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  <UploadImage setFile={setImage} />
                </Button>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-right">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {initialValues?.name || "بدون اسم"}
              </h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <Tag color="blue" className="py-2 px-3 text-base">
                  <span className="flex gap-2 items-center">
                    <IdcardOutlined />
                    {initialValues?.employee_id || "بدون رقم"}
                  </span>
                </Tag>
                <Tag color="green" className="py-2 px-3 text-base">
                  <span className="flex gap-2 items-center">
                    <IoBriefcase />
                    {initialValues?.position || "بدون مسمى"}
                  </span>
                </Tag>
                <Tag color="purple" className="py-2 px-3 text-base">
                  <span className="flex gap-2 items-center">
                    <TeamOutlined />
                    {departments?.find(
                      (d) => d.id === parseInt(initialValues!.department)
                    )?.name || "بدون قسم"}
                  </span>
                </Tag>
              </div>
            </div>
          </div>
        </Card>

        {/* Personal Details */}
        <Card
          title={
            <span className="flex items-center gap-2">
              <UserOutlined className="text-blue-500" />
              المعلومات الشخصية
            </span>
          }
          className="mb-8 shadow-sm"
        >
          <Row gutter={[24, 16]}>
            {/* name is for view only */}
            <Col xs={24} md={12} className="mb-2">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <UserOutlined className="text-gray-500" />
                  <span className="text-gray-600 font-medium">
                    الاسم الكامل
                  </span>
                </div>
                <p className="text-gray-800 text-lg font-semibold">
                  {initialValues?.name || "بدون اسم"}
                </p>
              </div>
            </Col>

            {/* Email */}
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label={
                  <span className="flex items-center gap-2">
                    <MailOutlined />
                    البريد الإلكتروني
                  </span>
                }
                rules={[
                  { type: "email", message: "البريد الإلكتروني غير صالح" },
                  { required: true, message: "يرجى إدخال البريد الإلكتروني" },
                ]}
              >
                <Input
                  placeholder="example@email.com"
                  size="large"
                  prefix={<MailOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            {/* Phone */}
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label={
                  <span className="flex items-center gap-2">
                    <PhoneOutlined />
                    رقم الهاتف
                  </span>
                }
                rules={[
                  { required: true, message: "يرجى إدخال رقم الهاتف" },
                  {
                    pattern: /^\d+$/,
                    message: "رقم الهاتف يجب أن يحتوي على أرقام فقط",
                  },
                ]}
              >
                <Input
                  placeholder="أدخل رقم الهاتف"
                  size="large"
                  prefix={<PhoneOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>

            {/* National ID */}
            <Col xs={24} md={12}>
              <Form.Item
                name="national_id"
                label={
                  <span className="flex items-center gap-2">
                    <IdcardOutlined />
                    الرقم القومي
                  </span>
                }
                rules={[
                  { required: true, message: "يرجى إدخال الرقم القومي" },
                  {
                    pattern: /^\d+$/,
                    message: "الرقم القومي يجب أن يحتوي على أرقام فقط",
                  },
                ]}
              >
                <Input
                  placeholder="أدخل الرقم القومي"
                  size="large"
                  prefix={<IdcardOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            {/* Address */}
            <Col xs={24} md={12}>
              <Form.Item
                name="address"
                label={
                  <span className="flex items-center gap-2">
                    <HomeOutlined />
                    العنوان
                  </span>
                }
              >
                <Input
                  placeholder="أدخل العنوان"
                  size="large"
                  prefix={<HomeOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>

            {/* Birth Date */}
            <Col xs={24} md={12}>
              <Form.Item
                name="birth_date"
                label={
                  <span className="flex items-center gap-2">
                    <CalendarOutlined />
                    تاريخ الميلاد
                  </span>
                }
                rules={[
                  { required: true, message: "يرجى إدخال تاريخ الميلاد" },
                ]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  className="w-full"
                  placeholder="اختر تاريخ الميلاد"
                  maxDate={dayjs()}
                  allowClear={false}
                  size="large"
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            {/* Age - Auto Calculated */}
            <Col xs={24} md={12}>
              <Form.Item name="age" label="العمر">
                <Input
                  type="number"
                  disabled
                  size="large"
                  className="bg-gray-50"
                />
              </Form.Item>
            </Col>

            {/* Marital Status */}
            <Col xs={24} md={12}>
              <Form.Item
                name="marital_status"
                label="الحالة الاجتماعية"
                rules={[
                  { required: true, message: "يرجى تحديد الحالة الاجتماعية" },
                ]}
              >
                <Select placeholder="اختر الحالة الاجتماعية" size="large">
                  <Option value="single">أعزب</Option>
                  <Option value="married">متزوج</Option>
                  <Option value="divorced">مطلق</Option>
                  <Option value="widowed">أرمل</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* CV Upload */}
          <div className="mt-6">
            <Form.Item label="السيرة الذاتية">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <UploadFile setFile={setCv} />
                {initialValues?.cv && (
                  <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
                    <span className="text-blue-700 font-medium">
                      السيرة الذاتية الحالية:
                    </span>
                    <a
                      href={initialValues.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      عرض الملف
                    </a>
                  </div>
                )}
              </div>
            </Form.Item>
          </div>
        </Card>

        {/* Job Information - Read Only */}
        <Card
          title={
            <span className="flex items-center gap-2">
              <IoBriefcase className="text-green-500" />
              المعلومات الوظيفية
            </span>
          }
          className="mb-8 shadow-sm border border-gray-200"
        >
          <div className="bg-gray-50 p-4 rounded-lg">
            <Descriptions
              column={{ xs: 1, sm: 2, md: 3 }}
              bordered
              size="small"
              className="bg-white"
            >
              <Descriptions.Item label="الرقم الوظيفي" span={1}>
                <div className="flex items-center gap-2">
                  <IdcardOutlined className="text-blue-500" />
                  <span className="font-semibold">
                    {initialValues?.employee_id || "بدون"}
                  </span>
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="المسمى الوظيفي" span={1}>
                <div className="flex items-center gap-2">
                  <IoBriefcase className="text-green-500" />
                  <span className="font-semibold">
                    {initialValues?.position || "بدون"}
                  </span>
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="القسم" span={1}>
                <div className="flex items-center gap-2">
                  <TeamOutlined className="text-purple-500" />
                  <span className="font-semibold">
                    {departments?.find(
                      (d) => d.id === parseInt(initialValues!.department)
                    )?.name || "بدون"}
                  </span>
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="تاريخ التوظيف" span={1}>
                <div className="flex items-center gap-2">
                  <CalendarOutlined className="text-orange-500" />
                  <span className="font-semibold">
                    {initialValues?.hire_date
                      ? dayjs(initialValues.hire_date).format("DD/MM/YYYY")
                      : "بدون"}
                  </span>
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="وضع العمل" span={1}>
                <div className="flex items-center gap-2">
                  <EnvironmentOutlined className="text-red-500" />
                  <span className="font-semibold">
                    {initialValues?.mode === "on-site"
                      ? "من المقر"
                      : initialValues?.mode === "remote"
                      ? "عن بُعد"
                      : initialValues?.mode === "hybrid"
                      ? "هجين"
                      : "بدون"}
                  </span>
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="حالة التوظيف" span={1}>
                <Tag color={initialValues?.is_active ? "success" : "error"}>
                  {initialValues?.is_active ? "نشط" : "غير نشط"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Card>

        {/* Form Actions */}
        <Card className="border-0 shadow-none bg-transparent">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm">
              آخر تحديث: {dayjs().format("DD/MM/YYYY HH:mm")}
            </div>

            <div className="flex gap-3">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={empLoad}
                className="px-6"
                icon={<UserOutlined />}
              >
                حفظ التغييرات
              </Button>
            </div>
          </div>
        </Card>
      </Form>

      {/* Success message when update completes */}
      {empDone && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">✓</span>
            </div>
            <div>
              <p className="font-semibold">تم التحديث بنجاح</p>
              <p className="text-sm">سيتم توجيهك إلى صفحة الموظف...</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeDataForm;
