import { Ionicons } from '@expo/vector-icons';
import { StyleProp, ViewStyle } from 'react-native';
import type { LabelProps } from '../LabelForm';

export type UploadFileType = 'image' | 'file' | 'both';

export type UploadStatus = 'success' | 'error' | 'loading' | 'prepare';

export interface UploadedFile {
  id?: string;
  uri: string;
  name: string;
  type?: string;
  size?: number;
  mimeType?: string;
  [key: string]: any;
}

export interface FileEntry {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  extension: string;
  filePath: string;
  order?: number;
  metadata?: Record<string, any>;
  collectionId?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  isPublic: boolean;
  url?: string;
}

export interface FileCollection {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  files: FileEntry[] | null;
  [key: string]: any;
}

export interface FileEntryDetailResponse extends FileEntry {
  [key: string]: any;
}

export interface FileCollectionDetailResponse extends FileCollection {
  files: FileEntryDetailResponse[] | null;
}

export interface UploadFileCollectionDto {
  name?: string;
  category?: string;
  description?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  isPublic?: boolean;
}

export interface UploadFileIconProps {
  name?: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  className?: string;
}

// Các props dùng chung cho cả single và multiple upload
export interface UploadFileBaseProps {
  label?: string | LabelProps;
  url?: string;
  type?: UploadFileType;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[]; // MIME types, e.g., ['image/jpeg', 'image/png']
  placeholder?: string;
  containerStyles?: StyleProp<ViewStyle>;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  onError?: (error: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconProps?: UploadFileIconProps;
  showPreview?: boolean;
}

