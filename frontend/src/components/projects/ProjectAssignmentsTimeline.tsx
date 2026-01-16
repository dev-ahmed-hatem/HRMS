import React, { useState } from "react";
import {
  Timeline,
  Card,
  Avatar,
  Tag,
  Button,
  Tooltip,
  Divider,
  Badge,
  Space,
  Input,
  Select,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  HistoryOutlined,
  CrownOutlined,
  CommentOutlined,
  EyeOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import type { ProjectAssignment } from "@/types/assignments";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { statusColors } from "@/types/project";

dayjs.locale("ar");

const { Search } = Input;
const { Option } = Select;

// Generate random pastel colors for assignments
const getRandomColor = (seed: string): string => {
  const colors = [
    "bg-blue-100 border-blue-300 text-blue-700",
    "bg-green-100 border-green-300 text-green-700",
    "bg-purple-100 border-purple-300 text-purple-700",
    "bg-pink-100 border-pink-300 text-pink-700",
    "bg-indigo-100 border-indigo-300 text-indigo-700",
    "bg-teal-100 border-teal-300 text-teal-700",
    "bg-orange-100 border-orange-300 text-orange-700",
    "bg-cyan-100 border-cyan-300 text-cyan-700",
  ];
  const index =
    seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

// Mock data for project assignments
const mockAssignments: ProjectAssignment[] = [
  {
    id: 1,
    project: "مشروع تطوير النظام",
    status: "قيد التنفيذ",
    assigned_at: "2024-01-15T10:30:00Z",
    assigned_by: "أحمد محمد",
    assigned_by_employee: true,
  },
  {
    id: 2,
    project: "مشروع تطوير النظام",
    status: "قيد الموافقة",
    notes: "تمت الموافقة الأولية على خطة المشروع من قبل الإدارة",
    assigned_at: "2024-01-10T14:20:00Z",
    assigned_by: "المدير العام",
    assigned_by_employee: false,
  },
  {
    id: 3,
    project: "مشروع تطوير النظام",
    status: "مكتمل",
    notes: "تم الانتهاء من مرحلة التخطيط والتحليل",
    assigned_at: "2024-01-05T09:15:00Z",
    assigned_by: "سارة عبدالله",
    assigned_by_employee: true,
  },
  {
    id: 4,
    project: "مشروع تطوير النظام",
    status: "متوقف",
    notes: "توقف مؤقت بسبب مشاكل في الميزانية",
    assigned_at: "2023-12-28T16:45:00Z",
    assigned_by: "مدير المشاريع",
    assigned_by_employee: false,
  },
  {
    id: 5,
    project: "مشروع تطوير النظام",
    status: "قيد التنفيذ",
    notes: "بدء مرحلة التطوير الفعلي للمشروع",
    assigned_at: "2023-12-20T11:00:00Z",
    assigned_by: "محمد علي",
    assigned_by_employee: true,
  },
  {
    id: 6,
    project: "مشروع تطوير النظام",
    status: "قيد التنفيذ",
    notes: "تعيين فريق الجودة للاختبارات",
    assigned_at: "2023-12-15T13:30:00Z",
    assigned_by: "خالد فهد",
    assigned_by_employee: true,
  },
  {
    id: 7,
    project: "مشروع تطوير النظام",
    status: "مكتمل",
    notes: "إغلاق المرحلة الأولى بنجاح",
    assigned_at: "2023-12-10T08:45:00Z",
    assigned_by: "المشرف العام",
    assigned_by_employee: false,
  },
];

const ProjectAssignmentsTimeline: React.FC = () => {
  const [assignments, setAssignments] =
    useState<ProjectAssignment[]>(mockAssignments);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assignedByFilter, setAssignedByFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline");

  // Filter assignments based on search and filters
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.notes?.toLowerCase().includes(searchText.toLowerCase()) ||
      assignment.assigned_by.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || assignment.status === statusFilter;
    const matchesAssignedBy =
      assignedByFilter === "all" ||
      (assignedByFilter === "employee" && assignment.assigned_by_employee) ||
      (assignedByFilter === "staff" && !assignment.assigned_by_employee);

    return matchesSearch && matchesStatus && matchesAssignedBy;
  });

  // Timeline items
  const timelineItems = filteredAssignments.map((assignment) => {
    const bgColorClass = getRandomColor(assignment.id.toString());
    const timeFromNow = dayjs(assignment.assigned_at).fromNow();
    const formattedDate = dayjs(assignment.assigned_at).format(
      "YYYY-MM-DD h:mm A"
    );

    return {
      color: statusColors[assignment.status] || "gray",
      dot: (
        <div className="relative">
          <Avatar
            size={40}
            className={`${bgColorClass} border-2 border-white shadow-md`}
            icon={
              assignment.assigned_by_employee ? (
                <UserOutlined />
              ) : (
                <CrownOutlined />
              )
            }
          />
        </div>
      ),
      children: (
        <Card
          className={`mt-2 mr-10 border-0 shadow-sm hover:shadow-md transition-shadow duration-300 ${bgColorClass}`}
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <Tag
                    color={statusColors[assignment.status]}
                    className="font-medium px-3 py-1"
                  >
                    {assignment.status}
                  </Tag>
                  <Tooltip title="تاريخ الإسناد">
                    <span className="text-gray-600 text-sm flex items-center gap-1">
                      <CalendarOutlined />
                      {formattedDate}
                    </span>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  {assignment.assigned_by_employee ? (
                    <Tag
                      color="blue"
                      icon={<UserOutlined />}
                      className="font-medium"
                    >
                      إسناد موظف
                    </Tag>
                  ) : (
                    <Tag
                      color="gold"
                      icon={<CrownOutlined />}
                      className="font-medium"
                    >
                      إسناد إداري
                    </Tag>
                  )}
                </div>
              </div>

              {/* Assigned By */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-white/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium">المسند:</span>
                  <span className="font-bold text-gray-800">
                    {assignment.assigned_by}
                  </span>
                </div>
                <Divider type="vertical" />
                <div className="text-gray-500 text-sm flex items-center gap-1">
                  <ClockCircleOutlined />
                  <span>منذ {timeFromNow}</span>
                </div>
              </div>

              {/* Notes */}
              {assignment.notes && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <CommentOutlined />
                    <span className="font-medium">ملاحظات الإسناد:</span>
                  </div>
                  <p className="text-gray-800 bg-white/70 p-3 rounded-lg border border-gray-200">
                    {assignment.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      ),
    };
  });

  // List view component
  const ListView = () => (
    <div className="space-y-4">
      {filteredAssignments.map((assignment) => {
        const bgColorClass = getRandomColor(assignment.id.toString());
        const formattedDate = dayjs(assignment.assigned_at).format(
          "YYYY-MM-DD h:mm A"
        );

        return (
          <Card
            key={assignment.id}
            className={`border-0 shadow-sm hover:shadow-md transition-all duration-300 ${bgColorClass}`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <Avatar
                  size={48}
                  className={`border-2 border-white shadow-md ${bgColorClass}`}
                  icon={
                    assignment.assigned_by_employee ? (
                      <UserOutlined />
                    ) : (
                      <CrownOutlined />
                    )
                  }
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h4 className="font-bold text-gray-800">
                      {assignment.assigned_by}
                    </h4>
                    <Tag
                      color={statusColors[assignment.status]}
                      className="font-medium"
                    >
                      {assignment.status}
                    </Tag>
                    {assignment.assigned_by_employee ? (
                      <Tag
                        color="blue"
                        icon={<UserOutlined />}
                        className="font-medium"
                      >
                        إسناد موظف
                      </Tag>
                    ) : (
                      <Tag
                        color="gold"
                        icon={<CrownOutlined />}
                        className="font-medium"
                      >
                        إسناد إداري
                      </Tag>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{assignment.notes}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <CalendarOutlined />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <ClockCircleOutlined />
                      {dayjs(assignment.assigned_at).fromNow()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  // Stats
  const employeeAssignments = assignments.filter(
    (a) => a.assigned_by_employee
  ).length;
  const staffAssignments = assignments.filter(
    (a) => !a.assigned_by_employee
  ).length;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <HistoryOutlined className="text-blue-500" />
            سجل إسنادات المشروع
          </h2>
          <p className="text-gray-600">
            عرض جميع عمليات الإسناد المرتبطة بهذا المشروع
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Assignments Count */}
          <Tag color="blue" className="px-3 py-1 text-sm">
            {assignments.length}
          </Tag>

          {/* Timeline View */}
          <Tooltip title="مخطط زمني">
            <Button
              type={viewMode === "timeline" ? "primary" : "default"}
              shape="circle"
              icon={<HistoryOutlined />}
              onClick={() => setViewMode("timeline")}
              className={
                viewMode === "timeline"
                  ? "shadow-md"
                  : "opacity-70 hover:opacity-100"
              }
            />
          </Tooltip>

          {/* List/Grid View */}
          <Tooltip title="قائمة">
            <Button
              type={viewMode === "list" ? "primary" : "default"}
              shape="circle"
              icon={<TeamOutlined />}
              onClick={() => setViewMode("list")}
              className={
                viewMode === "list"
                  ? "shadow-md"
                  : "opacity-70 hover:opacity-100"
              }
            />
          </Tooltip>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {assignments.length}
            </div>
            <div className="text-blue-800 font-medium">إجمالي الإسنادات</div>
          </div>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {employeeAssignments}
            </div>
            <div className="text-green-800 font-medium">إسنادات موظفين</div>
          </div>
        </Card>
        <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">
              {staffAssignments}
            </div>
            <div className="text-amber-800 font-medium">إسنادات إدارية</div>
          </div>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {dayjs(assignments[0]?.assigned_at).format("YYYY-MM-DD")}
            </div>
            <div className="text-purple-800 font-medium">آخر إسناد</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-0">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full md:w-auto">
            <Search
              placeholder="ابحث في الملاحظات أو المسندين..."
              allowClear
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined className="text-gray-400" />}
              className="w-full"
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Select
              placeholder="حالة الإسناد"
              size="large"
              value={statusFilter}
              onChange={setStatusFilter}
              className="min-w-[150px]"
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">جميع الحالات</Option>
              <Option value="مكتمل">مكتمل</Option>
              <Option value="قيد الموافقة">قيد الموافقة</Option>
              <Option value="متوقف">متوقف</Option>
            </Select>

            <Select
              placeholder="نوع المسند"
              size="large"
              value={assignedByFilter}
              onChange={setAssignedByFilter}
              className="min-w-[150px]"
            >
              <Option value="all">الجميع</Option>
              <Option value="employee">موظفين</Option>
              <Option value="staff">إداريين</Option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Content */}
      {filteredAssignments.length === 0 ? (
        <Card className="text-center py-12 border-dashed">
          <div className="text-gray-400 mb-4">
            <TeamOutlined className="text-5xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            لا توجد إسنادات
          </h3>
          <p className="text-gray-500">
            لم يتم إجراء أي إسنادات لهذا المشروع بعد
          </p>
        </Card>
      ) : viewMode === "timeline" ? (
        <Timeline
          items={timelineItems}
          mode="left"
          className="project-assignments-timeline"
        />
      ) : (
        <ListView />
      )}

      {/* Legend */}
      <Card className="border-0 bg-gray-50">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <Avatar
              size={24}
              icon={<UserOutlined />}
              className="bg-blue-100 text-blue-600"
            />
            <span className="text-gray-700">إسناد موظف</span>
          </div>
          <div className="flex items-center gap-2">
            <Avatar
              size={24}
              icon={<CrownOutlined />}
              className="bg-amber-100 text-amber-600"
            />
            <span className="text-gray-700">إسناد إداري</span>
          </div>
          <Divider type="vertical" />
          <div className="flex items-center gap-2">
            <Tag color="blue">قيد التنفيذ</Tag>
            <Tag color="green">مكتمل</Tag>
            <Tag color="orange">قيد الموافقة</Tag>
            <Tag color="red">متوقف</Tag>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProjectAssignmentsTimeline;
