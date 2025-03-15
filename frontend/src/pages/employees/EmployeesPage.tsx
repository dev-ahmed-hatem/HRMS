import { useState } from "react";
import {
  Table,
  Input,
  Button,
  Avatar,
  Space,
  ConfigProvider,
  Badge,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Outlet, useMatch, useNavigate } from "react-router";
import { getInitials } from "../../utils";

const employees = [
  {
    id: 1,
    name: "هانا أرندت",
    position: "مدير",
    hireDate: "16 يونيو 2014",
    assignments: 9,
    img: "https://randomuser.me/api/portraits/women/72.jpg",
  },
  {
    id: 2,
    name: "توماس فاغنر",
    position: "مدير حسابات",
    hireDate: "7 أغسطس 2019",
    assignments: 12,
  },
  {
    id: 3,
    name: "محمد علي",
    position: "مدير الحسابات",
    hireDate: "5 سبتمبر 1997",
    assignments: 0,
  },
  {
    id: 4,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 5,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 6,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 7,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 8,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 9,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 10,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 11,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 12,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 13,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 14,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 15,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 16,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 17,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 18,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 19,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 20,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 21,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 22,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 23,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 24,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 25,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 26,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 27,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
  {
    id: 28,
    name: "اسلام فوزي",
    position: "مدير تسويق",
    hireDate: "12 يناير 2011",
    assignments: 4,
  },
];

const EmployeesPage = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const isEmployees = useMatch("/employees");

  if (!isEmployees) return <Outlet />;

  // Search Function
  const onSearch = (value: string) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "اسم الموظف",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Space>
          {record.img ? (
            <Avatar src={record.img} />
          ) : (
            <Avatar className="bg-orange-700 text-white font-semibold">
              {getInitials(record.name)}
            </Avatar>
          )}
          <span className="flex flex-col">
            <div className="name text-base">{text}</div>
            <div className="id text-xs text-gray-400">#{record.id}</div>
          </span>
        </Space>
      ),
    },
    {
      title: "الوظيفة",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "تاريخ التعيين",
      dataIndex: "hireDate",
      key: "hireDate",
      // sorter: (a, b) => a.hireDate
    },
    {
      title: "التكليفات الجارية",
      dataIndex: "assignments",
      key: "assignments",
      render: (assignments: number) => {
        return assignments ? (
          <Badge color="#f3760d" count={assignments} />
        ) : null;
      },
      // sorter: (a, b) => a.assignments - b.assignments,
    },
  ];

  return (
    <div className="p-7">
      <h1 className="mb-6 text-2xl md:text-3xl text-centr font-bold">
        الموظفين
      </h1>
      {/* Search Input */}
      <div className="flex justify-between flex-wrap mb-4">
        <Input
          placeholder="ابحث عن موظف..."
          prefix={<SearchOutlined />}
          onChange={(e) => onSearch(e.target.value)}
          className="mb-4 w-full max-w-md h-10"
        />

        {/* Add Button */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="shadow-sm hover:shadow-lg h-10
           bg-green-700 hover:bg-green-600"
        >
          إضافة موظف
        </Button>
      </div>
      {/* Table */}
      <ConfigProvider
        theme={{
          components: { Table: { headerBg: "#105569", headerColor: "white" } },
        }}
      >
        <Table
          dataSource={employees.filter((e) => e.name.includes(searchText))}
          columns={columns}
          onRow={(record) => ({
            onClick: () => navigate(`employee-profile/${record.id}`),
          })}
          rowKey="id"
          pagination={{
            pageSize: 20,
            itemRender(page, type, element) {
              if (type === "prev") {
                return (
                  <button className="ant-pagination-item-link">
                    <RightOutlined />
                  </button>
                );
              }
              if (type === "next") {
                return (
                  <button className="ant-pagination-item-link">
                    <LeftOutlined />
                  </button>
                );
              }
              return element;
            },
          }}
          bordered
          scroll={{ x: "max-content" }}
        />
      </ConfigProvider>
    </div>
  );
};

export default EmployeesPage;
