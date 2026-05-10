import CommonUpload from '@/components/Uploadfile';
import { UploadedFile, UploadStatus } from '@/components/Uploadfile/types';
import { RootStackParamList } from '@/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type TestScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TestScreen'>;
};

const TestScreen = ({ }: TestScreenProps) => {
  const [files, setFiles] = useState<UploadedFile[] | null>(null);

  const handleChange = (nextFiles: UploadedFile[] | null, status: UploadStatus) => {
    if (status === 'success' || status === 'prepare' || status === 'loading') {
      setFiles(nextFiles);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 p-4">
      <CommonUpload
        label="Ảnh thực tế"
        type="image"
        variant="multiple"
        value={files ?? []}
        onChange={handleChange as any}
      />
      <CommonUpload
        label={'single'}
        type='image'
        variant='single'
        value={files?.[0] ?? null}
        onChange={handleChange as any}
      />
    </SafeAreaView>
  );
};

export default TestScreen;
