// Task Overview Component
import { Card, Progress, Statistic, Row, Col } from "antd";
import { Task } from "../../types/task";

const TasksOverview = ({ tasks }: { tasks: Task[] }) => {
  const completedTasks = tasks.filter((t) => t.status === "مكتمل").length;
  const incompleteTasks = tasks.filter((t) => t.status === "غير مكتمل").length;
  const lateTasks = tasks.filter((t) => t.status === "متأخر").length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card title="نظرة عامة على المهام" className="shadow-lg rounded-xl">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Statistic title="إجمالي المهام" value={totalTasks} />
        </Col>
        <Col xs={24} md={8}>
          <Statistic title="المهام المكتملة" value={completedTasks} />
        </Col>
        <Col xs={24} md={8}>
          <Statistic
            title="المهام المتأخرة"
            value={lateTasks}
            valueStyle={{ color: "#cf1322" }}
          />
        </Col>
      </Row>
      <Progress
        percent={completionRate}
        status={completionRate === 100 ? "success" : "active"}
        className="mt-4"
      />
    </Card>
  );
};

export default TasksOverview;
