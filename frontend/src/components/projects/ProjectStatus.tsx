import {
  projectsEndpoints,
  useGetProjectQuery,
  useSwitchProjectStatusMutation,
} from "@/app/api/endpoints/projects";
import { useAppDispatch } from "@/app/redux/hooks";
import { useNotification } from "@/providers/NotificationProvider";
import { Project, statusColors } from "@/types/project";
import { Button, Tag, Modal, Input } from "antd";
import { ReactElement, useEffect, useState } from "react";
import { TbStatusChange } from "react-icons/tb";
import Loading from "../Loading";
import { IoPauseOutline } from "react-icons/io5";
import { RxResume } from "react-icons/rx";

type Transition = {
  label: string;
  nextStatus: string;
  icon?: ReactElement;
};

const getButtonText = (status?: Project["status"]): Transition => {
  switch (status) {
    case "قيد الموافقة":
      return {
        label: "بدء التنفيذ",
        nextStatus: "ongoing",
        icon: <TbStatusChange />,
      };
    case "قيد التنفيذ":
      return { label: "إيقاف", nextStatus: "paused", icon: <IoPauseOutline /> };
    case "متوقف":
      return { label: "استئناف", nextStatus: "ongoing", icon: <RxResume /> };
    default:
      return { label: "", nextStatus: "" };
  }
};

const ProjectActionButton = ({
  id,
  isProjectOverdue,
}: {
  id: Project["id"];
  isProjectOverdue: boolean;
}) => {
  const { data: project, isFetching: loading } = useGetProjectQuery({
    id,
    format: "detailed",
  });

  const [transition, setTransition] = useState(getButtonText(project?.status));
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const notification = useNotification();
  const dispatch = useAppDispatch();

  const [
    changeState,
    { data: switchRes, isLoading: switchingState, isError: switchError },
  ] = useSwitchProjectStatusMutation();

  const handleOpenModal = () => {
    setNotes("");
    setOpen(true);
  };

  const handleConfirm = () => {
    changeState({
      id,
      status: transition.nextStatus,
      notes: notes || undefined,
    });
  };

  useEffect(() => {
    if (switchError) {
      notification.error({
        message: "حدث خطأ في تغيير الحالة ! برجاء إعادة المحاولة",
      });
    }
  }, [switchError]);

  useEffect(() => {
    if (switchRes) {
      dispatch(
        projectsEndpoints.util.updateQueryData(
          "getProject",
          { id, format: "detailed" },
          (draft: Project) => {
            draft.status = switchRes.status;
          }
        )
      );

      setOpen(false);
      setNotes("");

      notification.success({
        message: "تم تغيير الحالة بنجاح",
      });
    }
  }, [switchRes]);

  useEffect(() => {
    setTransition(getButtonText(project?.status));
  }, [project]);

  if (loading) return <Loading />;

  return (
    <>
      <div className="flex flex-col gap-2">
        <Tag
          color={statusColors[project!.status]}
          className="text-sm text-center p-1"
        >
          {project!.status}
        </Tag>

        {isProjectOverdue && (
          <Tag color="red" className="w-[80px] text-center p-1">
            متأخر
          </Tag>
        )}
      </div>

      <Button
        type="primary"
        icon={transition.icon}
        onClick={handleOpenModal}
        loading={switchingState}
        disabled={!transition.nextStatus}
      >
        {transition.label}
      </Button>

      <Modal
        open={open}
        title="تأكيد تغيير حالة المشروع"
        onCancel={() => setOpen(false)}
        onOk={handleConfirm}
        okText="تأكيد"
        cancelText="إلغاء"
        confirmLoading={switchingState}
      >
        <p className="mb-2">
          سيتم تغيير حالة المشروع إلى:
          <Tag color="blue" className="mr-2">
            {transition.label}
          </Tag>
        </p>

        <Input.TextArea
          rows={4}
          placeholder="ملاحظات (اختياري)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default ProjectActionButton;
