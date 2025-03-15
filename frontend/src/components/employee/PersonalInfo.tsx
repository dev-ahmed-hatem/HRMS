import { Employee } from "../../types/employee";
import { Descriptions } from "antd";

const PersonalInfo = ({ employee }: { employee: Employee }) => {
  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="الاسم">{employee.name}</Descriptions.Item>
      <Descriptions.Item label="الجنس">{employee.gender}</Descriptions.Item>
      <Descriptions.Item label="البريد الإلكتروني">
        {employee.email}
      </Descriptions.Item>
      <Descriptions.Item label="رقم الهاتف">{employee.phone}</Descriptions.Item>
      <Descriptions.Item label="العنوان">{employee.address}</Descriptions.Item>
      <Descriptions.Item label="العمر">{employee.age} سنة</Descriptions.Item>
      <Descriptions.Item label="تاريخ الميلاد">
        {employee.birthDate}
      </Descriptions.Item>
      <Descriptions.Item label="رقم الهوية">
        {employee.nationalId}
      </Descriptions.Item>
      <Descriptions.Item label="الحالة الاجتماعية">
        {employee.maritalStatus}
      </Descriptions.Item>
      <Descriptions.Item label="السيرة الذاتية">
        <a
          className="underline text-blue-500"
          href={employee.cv}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ted.pdf
        </a>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default PersonalInfo;
