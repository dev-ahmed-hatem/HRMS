import { Descriptions } from "antd";
import { Employee } from "../../types/employee";

const JopDetails = ({ employee }: { employee: Employee }) => {
  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="الكود">
        {employee.employeeID}
      </Descriptions.Item>
      <Descriptions.Item label="الوظيفة">
        {employee.position}
      </Descriptions.Item>
      <Descriptions.Item label="القسم">{employee.department}</Descriptions.Item>
      <Descriptions.Item label="تاريخ التوظيف">
        {employee.hireDate}
      </Descriptions.Item>
      <Descriptions.Item label="نوع العمل">
        {employee.mode}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default JopDetails;
