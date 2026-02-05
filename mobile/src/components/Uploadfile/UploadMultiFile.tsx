import React from 'react';
import UploadFile from './UploadFile';
import {
  UploadedFile,
  UploadFileBaseProps,
  UploadStatus,
} from './types';

// Props dành riêng cho multi-file, kế thừa props chung
export interface UploadMultiFileProps extends UploadFileBaseProps {
  value?: UploadedFile[] | null;
  onChange?: (
    files: UploadedFile[] | null,
    status: UploadStatus,
  ) => void;
}

/**
 * UploadMultiFile
 *  - Component chuyên cho upload nhiều file
 *  - Dựa trên UploadFile nhưng ép `multiple = true` và kiểu value là mảng
 */
const UploadMultiFile: React.FC<UploadMultiFileProps> = ({
  value,
  onChange,
  maxFiles = 5,
  ...props
}) => {
  // Chuẩn hoá value/ onChange về kiểu UploadFile đang dùng (UploadedFile | UploadedFile[])
  const normalizedValue: UploadedFile[] | null = Array.isArray(value)
    ? value
    : value
      ? [value as any]
      : null;

  const handleChange = (
    files: UploadedFile | UploadedFile[] | null,
    status: 'success' | 'error' | 'loading' | 'prepare',
  ) => {
    const list = !files ? null : Array.isArray(files) ? files : [files];
    onChange?.(list, status);
  };

  return (
    <UploadFile
      {...props}
      value={normalizedValue ?? []}
      onChange={handleChange}
      multiple
      maxFiles={maxFiles}
    />
  );
};

export default UploadMultiFile;

