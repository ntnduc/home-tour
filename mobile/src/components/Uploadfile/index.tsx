import React from 'react';
import UploadFile from './UploadFile';
import UploadMultiFile, { UploadMultiFileProps } from './UploadMultiFile';



export interface CommonUploadProps
  extends UploadFileBaseProps {
  variant: UploadVariant;
  value?: UploadedFile | UploadedFile[] | string[] | string | null;

}

import { UploadedFile, UploadFileBaseProps, UploadVariant } from './types';

/**
 * Component chung cho upload, chọn đúng implementation theo `variant`
 */
const CommonUpload: React.FC<CommonUploadProps> = ({
  variant = 'single',
  value,
  onChange,
  ...rest
}) => {
  if (variant === 'multiple') {
    return (
      <UploadMultiFile
        {...(rest as Omit<UploadMultiFileProps, 'value' | 'onChange'>)}
        value={value}
        onChange={(files, status) => onChange?.(files as UploadedFile[] | null, status)}
      />
    );
  }

  return (
    <UploadFile
      {...rest}
      value={value as UploadedFile | null}
      onChange={(file, status) => onChange?.(file, status)} />
  );
};

// Public API
export default CommonUpload;

// Re-export types để dùng bên ngoài nếu cần
export type { UploadedFile, UploadFileIconProps, UploadFileType } from './types';
export type { UploadFileProps } from './UploadFile';
export type { UploadMultiFileProps } from './UploadMultiFile';

