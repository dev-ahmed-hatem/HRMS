import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Popconfirm,
  Card,
  Tag,
  Input,
  Space,
  Avatar,
  Tooltip,
  Badge,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  TeamOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  useDepartmentMutation,
  useGetPaginatedDepartmentsQuery,
} from "@/app/api/endpoints/employees";
import ErrorPage from "@/pages/Error";
import Loading from "@/components/Loading";
import { useNotification } from "@/providers/NotificationProvider";
import { axiosBaseQueryError } from "@/app/api/axiosBaseQuery";
import type { Department } from "@/types/department";
import DepartmentForm from "./DepartmentForm";
import { tablePaginationConfig } from "@/utils/antd";

const { Search } = Input;

const DepartmentsManager = () => {
  const notification = useNotification();
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [message, setMessage] = useState<string>("");

  const {
    data: departments,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPaginatedDepartmentsQuery({
    search,
    page,
    page_size: pageSize,
  });

  const [
    handleDepartment,
    {
      isLoading: handlingDepartment,
      isError: departmentIsError,
      isSuccess: departmentIsSuccess,
      error: departmentError,
    },
  ] = useDepartmentMutation();

  const handleAdd = (department: Department) => {
    setMessage("جاري إضافة القسم...");
    handleDepartment({ data: department });
  };

  const handleEdit = (updated: Department) => {
    setMessage("جاري تحديث القسم...");
    handleDepartment({
      data: updated,
      method: "PATCH",
      url: `employees/departments/${updated.id}/`,
    });
  };

  const handleDelete = (id: number) => {
    setMessage("جاري حذف القسم...");
    handleDepartment({
      method: "DELETE",
      url: `employees/departments/${id}/`,
    });
  };

  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => (
        <Badge
          count={index + 1}
          style={{ backgroundColor: "#0E6B81" }}
          className="min-w-[32px]"
        />
      ),
    },
    {
      title: "اسم القسم",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <div className="flex items-center gap-3">
          <Avatar
            size="small"
            className="bg-blue-100 text-calypso"
            icon={<TeamOutlined />}
          />
          <span className="font-medium text-gray-800">{name}</span>
        </div>
      ),
    },
    {
      title: "عدد الموظفين",
      key: "employee_count",
      dataIndex: "employee_count",
      width: 120,
      render: (text: string) => (
        <Tag color="blue" className="font-medium">
          {text}
        </Tag>
      ),
    },
    {
      title: "الإجراءات",
      key: "actions",
      width: 150,
      render: (_: any, record: Department) => (
        <Space size="small">
          <Tooltip title="تعديل">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined className="text-calypso-700" />}
              onClick={() => {
                setEditingDepartment(record);
                setIsModalOpen(true);
              }}
              className="hover:bg-blue-50"
            />
          </Tooltip>

          <Tooltip title="حذف">
            <Popconfirm
              title={
                <div>
                  <div className="font-semibold mb-2">حذف القسم</div>
                  <p className="text-gray-600">
                    هل أنت متأكد من حذف قسم "{record.name}"؟
                    <br />
                    <span className="text-red-500 text-sm">
                      تحذير: قد يؤثر هذا على الموظفين المرتبطين بهذا القسم.
                    </span>
                  </p>
                </div>
              }
              onConfirm={() => handleDelete(record.id)}
              okText="نعم، احذف"
              cancelText="إلغاء"
              okType="danger"
              icon={<DeleteOutlined className="text-red-500" />}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                className="hover:bg-red-50"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (departmentIsError) {
      const error = departmentError as axiosBaseQueryError;
      const errorMessage = error.data?.detail || "خطأ في تنفيذ الإجراء!";
      notification.error({
        message: errorMessage,
      });
    }
  }, [departmentIsError, departmentError, notification]);

  useEffect(() => {
    if (departmentIsSuccess) {
      notification.success({
        message: "تمت العملية بنجاح",
      });
      refetch();
      setIsModalOpen(false);
      setEditingDepartment(null);
    }
  }, [departmentIsSuccess, message, notification, refetch]);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorPage />;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة الأقسام</h1>
      </div>

      {/* Main Card */}
      <Card
        className="shadow-xl border-0 rounded-2xl overflow-hidden"
        styles={{ body: { padding: 0 } }}
      >
        <div className="p-6 bg-gradient-to-r from-blue-50 to-gray-50 border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <TeamOutlined className="text-calypso" />
                قائمة الأقسام
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {departments?.data.length || 0} قسم
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Search
                placeholder="ابحث عن قسم..."
                allowClear
                size="large"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                prefix={<SearchOutlined className="text-gray-400" />}
                className="w-full sm:w-64"
              />

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingDepartment(null);
                  setIsModalOpen(true);
                }}
                loading={handlingDepartment}
                size="large"
                className=" bg-gradient-to-r  from-calypso-800  to-calypso-700  hover:from-calypso-900
                hover:to-calypso-800  border-0  shadow-lg  hover:shadow-xl transition-all duration-300 whitespace-nowrap"
              >
                إضافة قسم جديد
              </Button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="p-6">
          {departments && departments.data.length > 0 ? (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={departments.data}
              pagination={tablePaginationConfig({
                total: departments?.data.length,
                current: departments?.page,
                showQuickJumper: true,
                pageSize,
                onChange(page, pageSize) {
                  setPage(page);
                  setPageSize(pageSize);
                },
              })}
              loading={isFetching}
              className="ant-table-striped"
              rowClassName={(_, index) => (index % 2 === 0 ? "bg-gray-50" : "")}
              size="middle"
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="لا توجد أقسام لعرضها"
                  />
                ),
              }}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-center">
                  <p className="text-gray-500 text-lg mb-4">
                    {search
                      ? "لم يتم العثور على أقسام تطابق البحث"
                      : "لا توجد أقسام مضافة بعد"}
                  </p>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                  >
                    إضافة أول قسم
                  </Button>
                </div>
              }
              className="py-16"
            />
          )}
        </div>

        {/* Stats Footer */}
        <div className="p-4 bg-gray-50 border-t text-center">
          <div className="flex flex-wrap justify-end gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-calypso-700">
                {departments?.count || 0}
              </div>
              <div className="text-gray-500 text-sm">إجمالي الأقسام</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Department Form Modal */}
      <DepartmentForm
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDepartment(null);
        }}
        onSubmit={editingDepartment ? handleEdit : handleAdd}
        initialValues={editingDepartment || undefined}
        loading={handlingDepartment}
      />
    </div>
  );
};

export default DepartmentsManager;
