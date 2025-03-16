import React, { useState } from "react";
import { Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const UploadImage: React.FC<{ setFile: Function }> = ({
  setFile,
}: {
  setFile: Function;
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChange: UploadProps["onChange"] = ({ fileList }) => {
    if (setFile) setFile(fileList[0]);
    setFileList(fileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <ImgCrop rotationSlider modalTitle="قص الصورة">
      <Upload
        listType="picture-circle"
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
        beforeUpload={() => false}
        maxCount={1}
      >
        تحميل صورة
      </Upload>
    </ImgCrop>
  );
};

export default UploadImage;
