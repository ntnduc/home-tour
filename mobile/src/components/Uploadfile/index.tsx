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
  value?: UploadFileProps['value'];
  onChange?: UploadFileProps['onChange'];
}

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
        onChange={onChange as UploadMultiFileProps['onChange']}
      />
    );
  }

  return (
    <UploadFile
      {...rest}
      value={Array.isArray(value) ? (value[0] ?? null) : value ?? null}
      onChange={onChange}
    />
  );
};

// Public API
export default CommonUpload;

// Re-export types để dùng bên ngoài nếu cần
export type { UploadedFile, UploadFileIconProps, UploadFileType } from './types';
export type { UploadFileProps } from './UploadFile';

