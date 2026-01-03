import React from 'react';
import { Text, View } from 'react-native';

import DisplayPhoneNumber from '@/components/DisplayPhoneNumber';

type DisplayFieldType = 'text' | 'phone';

type Props = {
  label: string;
  value?: string | number | React.ReactNode;
  strong?: boolean;
  type?: DisplayFieldType;
  containerClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  direction?: 'horizontal' | 'vertical';
};

const DisplayField = ({
  label,
  value,
  strong = false,
  type = 'text',
  containerClassName = '',
  labelClassName = '',
  valueClassName = '',
  direction = 'horizontal',
}: Props) => {
  const _containerClassName = `mb-2 ${direction === 'horizontal' ? 'flex-row justify-between items-center' : 'flex-col'} ${containerClassName}`;

  const fallbackValue = value ?? '-';

  const renderValue = () => {
    if (React.isValidElement(fallbackValue)) {
      return fallbackValue;
    }

    if (type === 'phone' && typeof fallbackValue === 'string') {
      return (
        <DisplayPhoneNumber
          className={`text-base text-gray-900 ${strong ? 'font-semibold' : ''} ${valueClassName}`}
        >
          {fallbackValue}
        </DisplayPhoneNumber>
      );
    }

    return (
      <Text
        className={`text-base text-gray-900 ${strong ? 'font-semibold' : ''} ${valueClassName}`}
      >
        {fallbackValue}
      </Text>
    );
  };

  return (
    <View className={_containerClassName}>
      <Text className={`text-base text-gray-600 ${labelClassName}`}>
        {label}
      </Text>
      {renderValue()}
    </View>
  );
};

export default DisplayField;
