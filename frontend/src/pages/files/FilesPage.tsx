import {
  Card,
  Input,
  Button,
  Upload,
  message,
  Breadcrumb,
  Empty,
  Modal,
} from "antd";
import {
  FolderOpenOutlined,
  FileOutlined,
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";

type FileItem = {
  id: string;
  name: string;
  type: "file";
};

type FolderItem = {
  id: string;
  name: string;
  type: "folder";
  files: FileItem[];
};

type Item = FileItem | FolderItem;

const mockData: Item[] = [
  {
    id: "f1",
    name: "شؤون الموظفين",
    type: "folder",
    files: [
      { id: "f1-1", name: "تفاصيل أحمد.pdf", type: "file" },
      { id: "f1-2", name: "السجل المالي.xlsx", type: "file" },
    ],
  },
  {
    id: "f2",
    name: "الاجتماعات",
    type: "folder",
    files: [],
  },
  {
    id: "a1",
    name: "سياسات العمل.pdf",
    type: "file",
  },
];

const FilesPage = () => {
  const [currentFolder, setCurrentFolder] = useState<FolderItem | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [searchText, setSearchText] = useState("");

  const itemsToShow = currentFolder ? currentFolder.files : mockData;

  const handleOpenFolder = (folder: FolderItem) => setCurrentFolder(folder);
  const handleBack = () => setCurrentFolder(null);
  const handlePreview = (file: FileItem) => setPreviewFile(file);

  // Search Function
  const onSearch = (value: string) => {
    setSearchText(value);
  };

  return (
    <>
      <h1 className="mb-6 text-2xl md:text-3xl font-bold">الملفات</h1>

      {/* Controls */}

      <div className="flex justify-between flex-wrap mb-4">
        <Input
          placeholder="ابحث عن ملف أو مجلد..."
          prefix={<SearchOutlined />}
          onChange={(e) => onSearch(e.target.value)}
          className="mb-4 w-full max-w-md h-10"
        />

        {/* Add Button */}

        <Upload
          beforeUpload={() => {
            message.success("تم رفع الملف (وهميًا)");
            return false;
          }}
          multiple
        >
          <Button icon={<UploadOutlined />} className="bg-blue-600 text-white" size="large">
            رفع ملف
          </Button>
        </Upload>
      </div>

      {/* Breadcrumb */}
      {currentFolder && (
        <div className="text-right">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="mb-4"
          >
            الرجوع للمجلدات
          </Button>
          <Breadcrumb className="text-sm">
            <Breadcrumb.Item>الملفات</Breadcrumb.Item>
            <Breadcrumb.Item>{currentFolder.name}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      )}

      {/* Files and Folders Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {itemsToShow.length === 0 && (
          <div className="col-span-full">
            <Empty description="لا توجد ملفات حالياً" />
          </div>
        )}

        {itemsToShow.map((item) =>
          item.type === "folder" ? (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-md text-center"
              onClick={() => handleOpenFolder(item as FolderItem)}
            >
              <FolderOpenOutlined className="text-4xl text-yellow-500 mb-2" />
              <p className="font-semibold">{item.name}</p>
            </Card>
          ) : (
            <Card
              key={item.id}
              className="relative group text-center"
              actions={[
                <EyeOutlined key="view" onClick={() => handlePreview(item)} />,
                <DeleteOutlined key="delete" />,
              ]}
            >
              <FileOutlined className="text-4xl text-gray-500 mb-2" />
              <p className="font-semibold truncate">{item.name}</p>
            </Card>
          )
        )}
      </div>

      {/* File Preview Modal */}
      <Modal
        open={!!previewFile}
        onCancel={() => setPreviewFile(null)}
        footer={null}
        title={previewFile?.name}
      >
        <p>هنا يمكن عرض محتوى الملف أو رابط للتحميل.</p>
      </Modal>
    </>
  );
};

export default FilesPage;
