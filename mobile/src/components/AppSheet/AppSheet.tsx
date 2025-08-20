import { Ionicons } from "@expo/vector-icons";
import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useState,
} from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

import { Modalize, ModalizeProps } from "react-native-modalize";

type HeaderConfig = {
  element?: ReactNode;
  title: string;
  style?: StyleProp<ViewStyle>;
  className?: string;
  height?: number;
  onClose?: () => void;
};

export interface AppSheetProps extends Omit<ModalizeProps, "ref"> {
  // children?: ReactNode;
  classNameContent?: string;
  styleContent?: StyleProp<ViewStyle>;
  header?: HeaderConfig;
  modalHeight?: number;
}

export interface AppSheetRef {
  open: (children?: ReactNode, config?: AppSheetProps) => void;
  close: () => void;
}

const AppSheet = forwardRef<AppSheetRef, AppSheetProps>((props, ref) => {
  const { children: defaultChildren, ...modalizeProps } = props;
  const modalizeRef = React.useRef<Modalize>(null);

  // const [dynamicChildren, setDynamicChildren] = useState<ReactNode>(null);

  const [state, setState] = useState<{
    dynamicChildren: ReactNode | null;
    config: AppSheetProps | null;
  }>({
    dynamicChildren: null,
    config: null,
  });

  const { height } = useWindowDimensions();

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  const open = (children: ReactNode, config?: AppSheetProps) => {
    if (children) {
      setState({ dynamicChildren: children, config: config || null });
    }
    setTimeout(() => {
      modalizeRef.current?.open();
    }, 100);
  };

  const close = () => {
    modalizeRef.current?.close();
    state.config?.onClose?.();
    setTimeout(() => {
      setState({ dynamicChildren: null, config: null });
    }, 100);
  };

  const header = (headerConfig?: HeaderConfig) => {
    return (
      <>
        {headerConfig?.element && headerConfig?.element}
        {!headerConfig?.element && (
          <View
            className={headerConfig?.className}
            style={[styles.header, headerConfig?.style]}
          >
            <Text style={styles.headerTitle}>{headerConfig?.title}</Text>
            <TouchableOpacity onPress={close}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  const renderChildren = state.dynamicChildren || (
    <View>
      <Text>Chưa có nội dung</Text>
    </View>
  );

  const config = state.config;

  return (
    <Modalize
      ref={modalizeRef}
      handleStyle={{
        display: "none",
      }}
      modalHeight={config?.modalHeight || 300}
      {...modalizeProps}
      {...config}
      withReactModal={true}
      HeaderComponent={config?.header && header(config?.header)}
    >
      <View
        className={props.classNameContent}
        style={[styles.content, props.styleContent]}
      >
        <View className="h-full">{renderChildren}</View>
      </View>
    </Modalize>
  );
});

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    padding: 10,
    lineHeight: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#222",
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
});

AppSheet.displayName = "AppSheet";

export default AppSheet;
