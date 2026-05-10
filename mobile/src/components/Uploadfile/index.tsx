import React from 'react';
import UploadFile, { UploadFileProps } from './UploadFile';
import UploadMultiFile, { UploadMultiFileProps } from './UploadMultiFile';

type UploadVariant = 'single' | 'multiple';

export interface CommonUploadProps
  extends Omit<UploadFileProps, 'multiple' | 'value' | 'onChange'> {
  /**
   * Kiểu upload:
   *  - 'single': 1 file
   *  - 'multiple': nhiều file
   */
  variant?: UploadVariant;
  value?: UploadedFile | UploadedFile[] | null;
  onChange?: (
    files: UploadedFile | UploadedFile[] | null,
    status: 'success' | 'error' | 'loading' | 'prepare',
  ) => void;
}

import { UploadedFile } from './types';

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
        value={Array.isArray(value) ? value : value ? [value] : []}
        onChange={(files, status) => onChange?.(files, status)}
      />
    );
  }

  return (
    <UploadFile
      {...rest}
      value={Array.isArray(value) ? (value[0] ?? null) : value ?? null}
      onChange={(file, status) => onChange?.(file, status)}
    />
  );
};

// Public API
export default CommonUpload;

// Re-export types để dùng bên ngoài nếu cần
export type { UploadedFile, UploadFileIconProps, UploadFileType } from './types';
export type { UploadFileProps } from './UploadFile';
export type { UploadMultiFileProps } from './UploadMultiFile';
