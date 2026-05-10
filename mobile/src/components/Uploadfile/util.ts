import { UploadedFile } from "./types";

const validateFile = (file: UploadedFile, maxSize: number, acceptedTypes: string[]): string | null => {
  if (maxSize && file.size) {
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSize) {
      return `File không được vượt quá ${maxSize}MB`;
    }
  }

  if (acceptedTypes && file.mimeType) {
    if (!acceptedTypes.includes(file.mimeType)) {
      return `File không đúng định dạng. Chấp nhận: ${acceptedTypes.join(', ')}`;
    }
  }

  return null;
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};


export { formatFileSize, validateFile };

