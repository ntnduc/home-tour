import { createStyles } from '@/styles/component/StyleUploadFile';
import { useTheme } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import LabelForm, { LabelProps } from '../LabelForm';
import { uploadFile, uploadFileCollection } from './uploadfile.api';

export type UploadFileType = 'image' | 'file' | 'both';

export interface UploadedFile {
  uri: string;
  name: string;
  type?: string;
  size?: number;
  mimeType?: string;
}

export interface UploadFileIconProps {
  name?: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  className?: string;
}

interface UploadFileProps {
  label?: string | LabelProps;
  value?: UploadedFile | UploadedFile[] | null;
  onChange?: (files: UploadedFile | UploadedFile[] | null, status: 'success' | 'error' | 'loading' | 'prepare') => void;
  url?: string;
  type?: UploadFileType;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
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

const UploadFile: React.FC<UploadFileProps> = ({
  label,
  value,
  onChange,
  type = 'both',
  error,
  required = false,
  disabled = false,
  multiple = false,
  maxFiles = 5,
  maxSize = 10, // 10MB default
  acceptedTypes,
  placeholder,
  containerStyles,
  onUploadStart,
  onUploadEnd,
  onError,
  icon = 'cloud-upload-outline',
  iconProps,
  showPreview = true,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>(Array.isArray(value) ? value : value ? [value] : []);

  const uploadAsync = async (filesToUpload: UploadedFile[]) => {
    try {
      setIsLoading(true);
      onChange?.(filesToUpload, 'prepare');
      onUploadStart?.();
      let uploadedFiles: UploadedFile[];

      if (multiple) {
        const response = await uploadFileCollection(filesToUpload, (status) => {
          setIsLoading(status === 'loading');
          onChange?.(filesToUpload, status);
        });

        uploadedFiles = filesToUpload.map((file, index) => ({
          ...file,
          uri: response?.data?.[index]?.url || file.uri,
        }));
      } else {
        const response = await uploadFile(filesToUpload[0], (status, progessEvent) => {
          console.log("💞💓💗💞💓💗 ~ uploadAsync ~ progessEvent:", progessEvent)
          setIsLoading(status === 'loading');
          onChange?.(filesToUpload[0], status);
        }).catch((error: any) => {
          onChange?.(filesToUpload[0], 'error');
          onError?.(error.message);
        });

        uploadedFiles = [response?.data];
      }

      const finalFiles = multiple ? uploadedFiles : uploadedFiles[0];
      setFiles(Array.isArray(finalFiles) ? finalFiles : finalFiles ? [finalFiles] : []);
      onChange?.(finalFiles, 'success');

    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi upload file';
      onError?.(errorMessage);
      onChange?.(filesToUpload, 'error');
    } finally {
      setIsLoading(false);
      onUploadEnd?.();
    }
  };


  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const validateFile = (file: UploadedFile): string | null => {
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

  const handlePickImage = async () => {
    if (disabled || isLoading) return;

    try {
      setIsLoading(true);
      onUploadStart?.();

      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Quyền truy cập',
          'Cần quyền truy cập thư viện ảnh để chọn hình ảnh.',
        );
        onError?.('Không có quyền truy cập thư viện ảnh');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          type === 'image'
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: multiple,
        quality: 0.8,
        selectionLimit: multiple ? maxFiles : 1,
      });

      if (result.canceled) {
        onUploadEnd?.();
        return;
      }

      const newFiles: UploadedFile[] = result.assets.map((asset: any) => ({
        uri: asset.uri,
        name: asset.fileName || `image_${Date.now()}.jpg`,
        type: asset.type || 'image',
        size: asset.fileSize,
        mimeType: asset.mimeType || 'image/jpeg',
      }));

      // Validate files
      for (const file of newFiles) {
        const error = validateFile(file);
        if (error) {
          Alert.alert('Lỗi', error);
          onError?.(error);
          onUploadEnd?.();
          return;
        }
      }

      // if (multiple) {
      const currentFiles = Array.isArray(value) ? value : value ? [value] : [];
      const updatedFiles = [...currentFiles, ...newFiles].slice(0, maxFiles);
      await uploadAsync(updatedFiles);
      // } else {
      //   uploadAsync();
      //   // uploadAsync(newFiles[0]);
      // }

      onUploadEnd?.();
    } catch (err: any) {
      const errorMessage = err.message || 'Có lỗi xảy ra khi chọn hình ảnh';
      Alert.alert('Lỗi', errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
      onUploadEnd?.();
    }
  };

  const handlePickFile = async () => {
    if (disabled || isLoading) return;

    try {
      setIsLoading(true);
      onUploadStart?.();

      const result = await DocumentPicker.getDocumentAsync({
        type: acceptedTypes?.length ? acceptedTypes : '*/*',
        multiple: multiple,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        onUploadEnd?.();
        return;
      }

      const newFiles: UploadedFile[] = result.assets.map((asset: any) => ({
        uri: asset.uri,
        name: asset.name,
        type: 'file',
        size: asset.size,
        mimeType: asset.mimeType || 'application/octet-stream',
      }));

      // Validate files
      for (const file of newFiles) {
        const error = validateFile(file);
        if (error) {
          Alert.alert('Lỗi', error);
          onError?.(error);
          onUploadEnd?.();
          return;
        }
      }

      // Merge với files hiện tại và upload
      const currentFiles = Array.isArray(value) ? value : value ? [value] : [];
      const updatedFiles = [...currentFiles, ...newFiles].slice(0, maxFiles);
      await uploadAsync(updatedFiles);

      onUploadEnd?.();
    } catch (err: any) {
      const errorMessage = err.message || 'Có lỗi xảy ra khi chọn file';
      Alert.alert('Lỗi', errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
      onUploadEnd?.();
    }
  };

  const handlePick = () => {
    if (type === 'image') {
      handlePickImage();
    } else if (type === 'file') {
      handlePickFile();
    } else {
      // Show action sheet for 'both'
      Alert.alert(
        'Chọn loại file',
        'Bạn muốn chọn hình ảnh hay file?',
        [
          {
            text: 'Hình ảnh',
            onPress: handlePickImage,
          },
          {
            text: 'File',
            onPress: handlePickFile,
          },
          {
            text: 'Hủy',
            style: 'cancel',
          },
        ],
      );
    }
  };

  const handleRemove = (index: number) => {
    if (disabled) return;

    if (multiple && Array.isArray(value)) {
      const updatedFiles = value.filter((_, i) => i !== index);
      // onChange?.(updatedFiles.length > 0 ? updatedFiles : null);
    } else {
      // onChange?.(null);
    }
  };

  const getFileIcon = (mimeType?: string): keyof typeof Ionicons.glyphMap => {
    if (!mimeType) return 'document-outline';
    if (mimeType.startsWith('image/')) return 'image-outline';
    if (mimeType.includes('pdf')) return 'document-text-outline';
    if (mimeType.includes('word') || mimeType.includes('doc')) return 'document-outline';
    if (mimeType.includes('excel') || mimeType.includes('sheet')) return 'document-outline';
    return 'document-outline';
  };

  const renderImagePreview = (file: UploadedFile, index: number) => {
    console.log("💞💓💗💞💓💗 ~ renderImagePreview ~ file:", file)
    if (!showPreview) return null;

    return (
      <View key={index} className="mb-3">
        <View className="relative">
          <Image
            source={{ uri: file.uri }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
          {!disabled && (
            <TouchableOpacity
              onPress={() => handleRemove(index)}
              className="absolute top-2 right-2 bg-red-500 rounded-full p-1.5"
              style={styles.removeButton}
            >
              <Ionicons name="close" size={16} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
        {file.name && (
          <Text className="text-xs text-gray-500 mt-1" numberOfLines={1}>
            {file.name}
          </Text>
        )}
      </View>
    );
  };

  const renderFileItem = (file: UploadedFile, index: number) => {
    const isImage = file.type === 'image' || file.mimeType?.startsWith('image/');

    if (isImage && showPreview) {
      return renderImagePreview(file, index);
    }

    return (
      <View key={index} style={styles.fileItem}>
        <Ionicons
          name={getFileIcon(file.mimeType)}
          size={24}
          color="#6b7280"
          style={styles.fileIcon}
        />
        <View style={styles.fileInfo}>
          <Text style={styles.fileName} numberOfLines={1}>
            {file.name}
          </Text>
          {file.size && (
            <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
          )}
        </View>
        {!disabled && (
          <TouchableOpacity
            onPress={() => handleRemove(index)}
            style={styles.removeButton}
          >
            <Ionicons name="close-circle" size={24} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const canAddMore = multiple ? files.length < maxFiles : true;
  const showAddButton = files.length > 0 ? (multiple ? canAddMore : true) : true;

  return (
    <View>
      {label && (
        <LabelForm {...(typeof label === 'object' ? label : { label, required })} />
      )}
      <View
        className={`flex flex-row items-center content-center justify-center  rounded-lg px-3 py-2 border ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'
          } ${disabled ? 'bg-gray-100' : 'bg-white'}`}
      >
        {files.length > 0 ? (
          <View style={styles.previewContainer}>
            {files.map((file, index) => renderFileItem(file, index))}
            {showAddButton && (
              <TouchableOpacity
                onPress={handlePick}
                disabled={disabled || isLoading}
                style={styles.uploadButton}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#6b7280" />
                ) : (
                  <>
                    <Ionicons
                      name={icon}
                      size={20}
                      color="#6b7280"
                      {...iconProps}
                    />
                    <Text style={styles.uploadButtonText}>
                      {multiple ? 'Thêm file khác' : 'Thay đổi file'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity
            className="flex-1"
            onPress={handlePick}
            disabled={disabled || isLoading}
            style={styles.uploadButton}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#6b7280" />
            ) : (
              <>
                <Ionicons
                  name={icon}
                  size={24}
                  color="#6b7280"
                  {...iconProps}
                />
                <Text style={styles.uploadButtonText}>
                  {placeholder ||
                    (type === 'image'
                      ? 'Chọn hình ảnh'
                      : type === 'file'
                        ? 'Chọn file'
                        : 'Chọn hình ảnh hoặc file')}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {files.length > 0 && multiple && (
          <View className="px-3 pb-2">
            <Text className="text-xs text-gray-500 text-center">
              {files.length}/{maxFiles} file đã chọn
            </Text>
          </View>
        )}
      </View>

      {error && (
        <Text style={styles.errorText} className="mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default UploadFile;
