import { Card, Typography, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;

type Note = {
  id: string;
  title: string;
  body: string;
  date: string;
  author: string;
};

const exampleNote: Note = {
  id: "1",
  title: "ملاحظة حول الاجتماع القادم",
  body: `هذا تذكير بخصوص الاجتماع القادم مع فريق التقنية. يرجى تجهيز عرض مفصل عن التقدم في المشروع الحالي بالإضافة إلى التحديات التي تواجه الفريق.
  
  سنركز بشكل خاص على الأداء خلال الربع الأخير والخطط المستقبلية. الحضور إجباري لجميع أعضاء الفريق.`,
  date: "2025-04-15",
  author: "أحمد علي",
};

const NotePreview: React.FC<{ note?: Note; onBack?: () => void }> = ({
  note = exampleNote,
  onBack,
}) => {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Button
          onClick={onBack}
          icon={<ArrowRightOutlined />}
          className="flex items-center text-sm"
          type="text"
        >
          العودة
        </Button>
      </div>

      <Card className="shadow rounded-2xl border-none bg-white">
        <Title level={3}>{note.title}</Title>

        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <Text>تاريخ الإضافة: {dayjs(note.date).format("YYYY/MM/DD")}</Text>
          <Text>بواسطة: {note.author}</Text>
        </div>

        <Paragraph className="leading-loose whitespace-pre-line text-gray-700">
          {note.body}
        </Paragraph>
      </Card>
    </div>
  );
};

export default NotePreview;
