import { useTheme } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ActionButton {
  label: string;
  onPress: () => void | Promise<void>;
  icon?: keyof typeof Ionicons.glyphMap;
  iconElement?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  isLoading?: boolean;
  disabled?: boolean;
  customStyle?: ViewStyle;
  hidden?: boolean | ((action: any) => boolean);
}

interface ActionButtonBottomProps {
  actions: ActionButton[];
  containerStyle?: ViewStyle;
  className?: string;
}

const getButtonStyle = (
  variant: ActionButton['variant'] = 'primary',
  customStyle?: ViewStyle,
) => {
  const baseStyle =
    'flex-row items-center justify-center py-4 px-6 rounded-xl shadow-sm';

  const variantStyles = {
    primary: 'bg-blue-600 shadow-[0_1px_5px_rgb(0,0,0,0.12)]',
    secondary: 'bg-amber-500 shadow-[0_1px_5px_rgb(0,0,0,0.12)]',
    danger: 'bg-red-500 shadow-[0_1px_5px_rgb(0,0,0,0.12)]',
    success: 'bg-green-600 shadow-[0_1px_5px_rgb(0,0,0,0.12)]',
  };

  return `${baseStyle} ${variantStyles[variant]} ${customStyle || ''}`;
};

const getTextStyle = (variant: ActionButton['variant'] = 'primary') => {
  const baseStyle = 'font-semibold text-base ml-2 ';

  const variantStyles = {
    primary: 'text-white',
    secondary: 'text-white',
    danger: 'text-white',
    success: 'text-white',
  };

  return `${baseStyle} ${variantStyles[variant]}`;
};

const getIconColor = (variant: ActionButton['variant'] = 'primary') => {
  const colors = {
    primary: '#FFFFFF',
    secondary: '#FFFFFF',
    danger: '#FFFFFF',
    success: '#FFFFFF',
  };
  return colors[variant];
};

const ActionButtonBottom: React.FC<ActionButtonBottomProps> = ({
  actions,
  containerStyle,
  className,
}) => {
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View
      className={`bg-white border-t border-gray-200 px-6 pt-3 ${className}`}
      style={[
        { backgroundColor: '#fff' },
        containerStyle,
        { paddingBottom: bottom },
      ]}
    >
      {actions.map((action, index) => {
        if (
          action.hidden && typeof action.hidden === 'function'
            ? action.hidden(actions)
            : action.hidden
        ) {
          return null;
        }
        return (
          <TouchableOpacity
            key={`${action.label}-${index}`}
            className={getButtonStyle(action.variant, action.customStyle)}
            onPress={action.onPress}
            disabled={action.disabled || action.isLoading}
            style={[index !== actions.length - 1 && { marginBottom: 12 }]}
          >
            {action.isLoading ? (
              <ActivityIndicator
                color={getIconColor(action.variant)}
                size="small"
              />
            ) : (
              <>
                {action.iconElement
                  ? action.iconElement
                  : action.icon && (
                      <Ionicons
                        name={action.icon}
                        size={18}
                        color={getIconColor(action.variant)}
                      />
                    )}
              </>
            )}
            <Text className={getTextStyle(action.variant)}>
              {action.isLoading ? 'Đang xử lý...' : action.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ActionButtonBottom;
