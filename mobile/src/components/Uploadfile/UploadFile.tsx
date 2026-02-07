import { createStyles } from '@/styles/component/StyleUploadFile';
import { useTheme } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import LabelForm from '../LabelForm';
import SliderLoading from './SliderLoading';
import { UploadedFile, UploadFileBaseProps, UploadStatus } from './types';
import { deleteFile, uploadFile } from './uploadfile.api';

export interface UploadFileProps extends UploadFileBaseProps {
  value?: UploadedFile | null;
  onChange?: (files: UploadedFile | null, status: UploadStatus) => void;
  multiple?: boolean;
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
  const [progress, setProgress] = useState(0);
  const [processStatus, setProcessStatus] = useState<'prepare' | 'loading' | 'success' | 'error'>('prepare');
  const [files, setFiles] = useState<UploadedFile | null | undefined>(value);

  const uploadAsync = async (fileToUpload: UploadedFile) => {
    try {
      setIsLoading(true);
      setProcessStatus('loading');
      onChange?.(fileToUpload, processStatus);
      onUploadStart?.();

      const response = await uploadFile(fileToUpload, (status, progessEvent) => {
        if (progessEvent?.loaded != null && progessEvent?.total != null) {
          const progress = (progessEvent.loaded / (progessEvent.total ?? 1)) * 100;
          setProgress(progress);
        }
        onChange?.(fileToUpload, processStatus);

      }).catch((error: any) => {
        setProcessStatus('error');
        onChange?.(null, processStatus);
        onError?.(error.message);
        setIsLoading(false);
      }).finally(() => {
        setProcessStatus('success');
        onUploadEnd?.();
      });

      const firstFile = response?.data;
      const finalFiles = {
        id: firstFile?.id,
        name: firstFile?.fileName,
        uri: firstFile?.filePath,
        size: firstFile?.fileSize,
        mimeType: firstFile?.mimeType,
      };

      setFiles(finalFiles);
      onChange?.(finalFiles, processStatus);
      setProgress(0);


    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi upload file';
      onError?.(errorMessage);
      onChange?.(null, 'error');
      setIsLoading(false);
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
        mediaTypes: ['images', 'videos'],
        allowsMultipleSelection: false,
        quality: 0.8,
        selectionLimit: 1,
      });

      if (result.canceled) {
        onUploadEnd?.();
        setIsLoading(false);
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
          setIsLoading(false);
          return;
        }
      }

      const newFile = newFiles[0];
      await uploadAsync(newFile);
      onUploadEnd?.();
      setIsLoading(false);
    } catch (err: any) {
      const errorMessage = err.message || 'Có lỗi xảy ra khi chọn hình ảnh';
      Alert.alert('Lỗi', errorMessage);
      onError?.(errorMessage);
      setIsLoading(false);
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
      const newFile = newFiles[0];
      await uploadAsync(newFile);

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

  const handleRemove = async () => {
    if (disabled) return;
    if (files == null || files.id == null) return;

    setIsLoading(true);
    await deleteFile(files.id)
      .then(() => {
        onChange?.(null, 'success');
      })
      .catch((error: any) => {
        //DO NOTHING
      })
      .finally(() => {
        setFiles(null);
        setIsLoading(false);
      });
  };

  // const getFileIcon = (mimeType?: string): keyof typeof Ionicons.glyphMap => {
  //   if (!mimeType) return 'document-outline';
  //   if (mimeType.startsWith('image/')) return 'image-outline';
  //   if (mimeType.includes('pdf')) return 'document-text-outline';
  //   if (mimeType.includes('word') || mimeType.includes('doc')) return 'document-outline';
  //   if (mimeType.includes('excel') || mimeType.includes('sheet')) return 'document-outline';
  //   return 'document-outline';
  // };

  // const renderImagePreview = (file: UploadedFile, index: number) => {
  //   if (!showPreview) return null;

  //   return (
  //     <View key={index} className="mb-3">
  //       <View className="relative">
  //         <Image
  //           source={{ uri: file.uri }}
  //           style={styles.imagePreview}
  //           resizeMode="cover"
  //         />
  //         {!disabled && (
  //           <TouchableOpacity
  //             onPress={() => handleRemove(index)}
  //             className="absolute top-2 right-2 bg-red-500 rounded-full p-1.5"
  //             style={styles.removeButton}
  //           >
  //             <Ionicons name="close" size={16} color="#ffffff" />
  //           </TouchableOpacity>
  //         )}
  //       </View>
  //       {file.name && (
  //         <Text className="text-xs text-gray-500 mt-1" numberOfLines={1}>
  //           {file.name}
  //         </Text>
  //       )}
  //     </View>
  //   );
  // };

  const renderFileItem = (file: UploadedFile) => {

    return (
      <View className='flex flex-row items-center h-full w-full '>
        <Text className='flex-1 text-lg '>
          {file.name}
        </Text>
        {!disabled && (
          <TouchableOpacity
            onPress={handleRemove}
            style={styles.removeButton}
          >
            <Ionicons name="close-circle" size={24} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const _renderLoading = useCallback(() => {
    if (!isLoading) return;
    return (
      <View className="flex-row items-center justify-center flex-1 w-full h-full">
        <ActivityIndicator size="small" color="#6b7280" />
      </View>
    );
  }, [isLoading]);

  const renderSliderLoading = useCallback(() => {
    return (
      <View className={`${processStatus === 'loading' ? 'block' : 'hidden'}`}>
        <SliderLoading value={progress} height={12} animateFromCenter={false} showShimmer />
      </View>
    );
  }, [progress, processStatus]);

  return (
    <View>
      {label && (
        <LabelForm {...(typeof label === 'object' ? label : { label, required })} />
      )}
      <View
        className={`flex flex-row items-center content-center justify-center rounded-lg px-3 pb-2 border ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'
          } ${disabled ? 'bg-gray-100' : 'bg-white'}`}
      >
        <View className="flex flex-col flex-1 h-[60px] items-center content-center justify-center ">

          <View className={`w-full mb-1 h-1 `}>
            {renderSliderLoading()}
          </View>
          {files ? (
            <View style={styles.previewContainer}>
              {renderFileItem(files)}
              {/* {showAddButton && (
                <TouchableOpacity
                  onPress={handlePick}
                  disabled={disabled || isLoading}
                  style={styles.uploadButton}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#6b7280" />
                  ) : (
                    <>
                      {renderFileItem(files)}
                    </>
                  )}
                </TouchableOpacity>
              )} */}
            </View>
          ) : (
            <TouchableOpacity
              className="flex-1"
              onPress={handlePick}
              disabled={disabled || isLoading}
              style={styles.uploadButton}
            >
              {isLoading
                ? _renderLoading()
                : <View className="flex-row items-center justify-center flex-1 w-full h-full">
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
                </View>}
            </TouchableOpacity>
          )}

        </View>
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
