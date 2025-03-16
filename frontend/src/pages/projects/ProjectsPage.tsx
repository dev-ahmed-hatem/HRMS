import ProjectsOverview from "../../components/projects/ProjectOverview";
import { Input, Table, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import { Project } from "../../types/project";
import { tablePaginationConfig } from "../../utils/antd";
import { Outlet, useMatch, useNavigate } from "react-router";

const sampleProjects: Project[] = [
  {
    id: "P001",
    name: "مشروع تطوير الموقع",
    status: "قيد التنفيذ",
    startDate: "2024-03-01",
    endDate: "2024-06-01",
    assignedTeam: "فريق التطوير",
  },
  {
    id: "P002",
    name: "تحليل بيانات السوق",
    status: "مكتمل",
    startDate: "2023-10-10",
    endDate: "2024-01-10",
    assignedTeam: "قسم التحليل",
  },
  {
    id: "P003",
    name: "تحديث البنية التحتية",
    status: "قيد الموافقة",
    startDate: "2024-04-15",
    endDate: "2024-08-15",
    assignedTeam: "فريق التكنولوجيا",
  },
];

const ProjectsPage = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const isProjects = useMatch("/projects");

  const [projects, setProjects] = useState<Project[]>(sampleProjects);

  // Search Function
  const onSearch = (value: string) => {
    setSearchText(value);
  };

  // Status Color Mapping
  const statusColors: Record<Project["status"], string> = {
    "قيد التنفيذ": "blue",
    مكتمل: "green",
    "قيد الموافقة": "gold",
    متوقف: "red",
  };

  // Define table columns
  const columns: ColumnsType<Project> = [
    {
      title: "اسم المشروع",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "قيد التنفيذ", value: "قيد التنفيذ" },
        { text: "مكتمل", value: "مكتمل" },
        { text: "قيد الموافقة", value: "قيد الموافقة" },
        { text: "متوقف", value: "متوقف" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: Project["status"]) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: "تاريخ البدء",
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a, b) => dayjs(a.startDate).unix() - dayjs(b.startDate).unix(),
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "تاريخ الانتهاء",
      dataIndex: "endDate",
      key: "endDate",
      sorter: (a, b) => dayjs(a.endDate).unix() - dayjs(b.endDate).unix(),
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "الفريق المسؤول",
      dataIndex: "assignedTeam",
      key: "assignedTeam",
    },
  ];

  if (!isProjects) return <Outlet />;
  return (
    <div>
      <ProjectsOverview />
      <h1 className="my-6 text-2xl md:text-3xl text-centr font-bold">
        المشاريع
      </h1>
      <div className="flex justify-between flex-wrap mb-4">
        <Input
          placeholder="ابحث عن مشروع..."
          prefix={<SearchOutlined />}
          onChange={(e) => onSearch(e.target.value)}
          className="mb-4 w-full max-w-md h-10"
        />
      </div>
      <Table
        columns={columns}
        onRow={(record) => ({
          onClick: () => navigate(`project-details/${record.id}`),
        })}
        dataSource={projects.filter((p) => p.name.includes(searchText))}
        rowKey="id"
        pagination={tablePaginationConfig()}
        bordered
        scroll={{ x: "max-content" }}
        className="clickable-table calypso-header"
      />
    </div>
  );
};

export default ProjectsPage;
