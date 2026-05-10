import { useTheme } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import LabelForm from '../LabelForm';
import { createStyles } from '@/styles/component/StyleUploadFile';
import {
  deleteFile,
  getFileUrl,
  uploadFileCollection,
} from './uploadfile.api';
import {
  UploadedFile,
  UploadFileBaseProps,
  UploadStatus,
} from './types';
import { AxiosProgressEvent } from 'axios';
import { validateFile } from './util';

export interface UploadMultiFileProps extends UploadFileBaseProps {
  value?: UploadedFile[] | null;
  onChange?: (
    files: UploadedFile[] | null,
    status: UploadStatus,
    progressEvent?: AxiosProgressEvent,
  ) => void;
  minFiles?: number;
  maxFiles?: number;
}

const normalizeUploadResponse = (payload: any): UploadedFile[] => {
  const data = payload?.data ?? payload;
  const files = Array.isArray(data) ? data : Array.isArray(data?.files) ? data.files : [];

  return files.map((item: any) => ({
    id: item?.id,
    name: item?.fileName || item?.name || `file_${Date.now()}`,
    uri: item?.filePath || item?.uri || '',
    size: item?.fileSize || item?.size,
    mimeType: item?.mimeType || item?.type,
    type: 'image',
  }));
};

const UploadMultiFile: React.FC<UploadMultiFileProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  maxSize = 10,
  minFiles = 3,
  maxFiles = 10,
  acceptedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif',
    'image/webp',
    'image/svg',
    'image/ico',
    'image/bmp',
    'image/tiff',
    'image/tif',
    'image/heic',
    'image/heif',
    'image/heif-sequence',
    'image/heic-sequence',
  ],
  onUploadStart,
  onUploadEnd,
  onError,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [files, setFiles] = useState<UploadedFile[]>(value ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const canAddMore = files.length < maxFiles;

  const imageSources = useMemo(
    () =>
      files.map((file) => ({
        uri: file?.id ? getFileUrl(file.id) : file.uri,
      })),
    [files],
  );

  const handlePickImages = async () => {
    if (disabled || isLoading || !canAddMore) return;

    try {
      setIsLoading(true);
      onUploadStart?.();
      onChange?.(files, 'prepare');

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        const msg = 'Cần quyền truy cập thư viện ảnh để chọn hình ảnh.';
        Alert.alert('Quyền truy cập', msg);
        onError?.(msg);
        onChange?.(files, 'error');
        return;
      }

      const selectionLimit = Math.max(maxFiles - files.length, 1);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit,
        quality: 0.8,
      });

      if (result.canceled) return;

      const newFiles: UploadedFile[] = result.assets.map((asset: any) => ({
        uri: asset.uri,
        name: asset.fileName || `image_${Date.now()}.jpg`,
        type: 'image',
        size: asset.fileSize,
        mimeType: asset.mimeType || 'image/jpeg',
      }));

      for (const file of newFiles) {
        const fileError = validateFile(file, maxSize ?? 10, acceptedTypes ?? []);
        if (fileError) {
          Alert.alert('Lỗi', fileError);
          onError?.(fileError);
          onChange?.(files, 'error');
          return;
        }
      }

      onChange?.(files, 'loading');

      const response = await uploadFileCollection(
        newFiles,
        undefined,
        (status, progressEvent) => {
          onChange?.(files, status, progressEvent);
        },
      );
      const uploadedFiles = normalizeUploadResponse(response);
      const merged = [...files, ...uploadedFiles].slice(0, maxFiles);

      setFiles(merged);
      onChange?.(merged, 'success');
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi tải ảnh';
      Alert.alert('Lỗi', message);
      onError?.(message);
      onChange?.(files, 'error');
    } finally {
      setIsLoading(false);
      onUploadEnd?.();
    }
  };

  const handleRemove = async (index: number) => {
    if (disabled || isLoading) return;

    const target = files[index];
    if (!target) return;

    try {
      setIsLoading(true);

      if (target.id) {
        await deleteFile(target.id);
      }

      const next = files.filter((_, i) => i !== index);
      setFiles(next);
      onChange?.(next.length ? next : null, 'success');

      if (previewIndex >= next.length) {
        setPreviewIndex(Math.max(next.length - 1, 0));
      }

      if (!next.length) {
        setPreviewVisible(false);
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Không thể xóa ảnh';
      Alert.alert('Lỗi', message);
      onError?.(message);
      onChange?.(files, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <View className="bg-white p-4 rounded-2xl border border-gray-100">
        {label && (
          <LabelForm {...(typeof label === 'object' ? label : { label, required })} />
        )}

        <View className="flex-row justify-between items-center mb-3 mt-1">
          <View>
            {!label && <Text className="text-lg font-semibold text-gray-900">Ảnh thực tế</Text>}
            <Text className="text-sm text-gray-500">Tải lên ít nhất {minFiles} ảnh</Text>
          </View>
          <Text className="text-blue-600 font-medium">{files.length}/{maxFiles}</Text>
        </View>

        <View className="flex-row flex-wrap -m-1">
          {files.map((file, index) => {
            const uri = file?.id ? getFileUrl(file.id) : file.uri;

            return (
              <View key={file.id || `${file.uri}_${index}`} className="w-1/3 p-1">
                <View className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-100">
                  <TouchableOpacity
                    className="w-full h-full"
                    onPress={() => {
                      setPreviewIndex(index);
                      setPreviewVisible(true);
                    }}
                    disabled={disabled}
                  >
                    <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
                  </TouchableOpacity>

                  {!disabled && (
                    <TouchableOpacity
                      onPress={() => handleRemove(index)}
                      className="absolute top-1 right-1 bg-white/90 rounded-full"
                      style={styles.removeButton}
                    >
                      <Ionicons name="close-circle" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}

          {canAddMore && (
            <View className="w-1/3 p-1">
              <TouchableOpacity
                onPress={handlePickImages}
                disabled={disabled || isLoading}
                className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 items-center justify-center"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#6b7280" />
                ) : (
                  <>
                    <Ionicons name="add" size={24} color="#9ca3af" />
                    <Text className="text-xs text-gray-400 mt-1">Thêm ảnh</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {files.length < minFiles && (
          <Text className="text-amber-600 text-xs mt-2">
            Bạn cần tải tối thiểu {minFiles} ảnh.
          </Text>
        )}

        {error && (
          <Text style={styles.errorText} className="mt-1">
            {error}
          </Text>
        )}
      </View>

      <ImageView
        images={imageSources}
        imageIndex={previewIndex}
        visible={previewVisible}
        onRequestClose={() => setPreviewVisible(false)}
      />
    </>
  );
};

export default UploadMultiFile;
