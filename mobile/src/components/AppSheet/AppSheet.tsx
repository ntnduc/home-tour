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
  title: string;
  style?: StyleProp<ViewStyle>;
  className?: string;
};

interface AppSheetProps extends Omit<ModalizeProps, "ref"> {
  // children?: ReactNode;
  classNameContent?: string;
  styleContent?: StyleProp<ViewStyle>;
  headerConfig?: HeaderConfig;
}

export interface AppSheetRef {
  open: (children?: ReactNode, config?: ConfigAppSheet) => void;
  close: () => void;
}

interface ConfigAppSheet {
  height?: number;
  header?: HeaderConfig;
}

const AppSheet = forwardRef<AppSheetRef, AppSheetProps>((props, ref) => {
  const { children: defaultChildren, ...modalizeProps } = props;
  const modalizeRef = React.useRef<Modalize>(null);

  // const [dynamicChildren, setDynamicChildren] = useState<ReactNode>(null);

  const [state, setState] = useState<{
    dynamicChildren: ReactNode | null;
    config: ConfigAppSheet | null;
  }>({
    dynamicChildren: null,
    config: null,
  });

  const { height } = useWindowDimensions();

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  const open = (children: ReactNode, config?: ConfigAppSheet) => {
    if (children) {
      setState({ dynamicChildren: children, config: config || null });
    }
    modalizeRef.current?.open();
  };

  const close = () => {
    modalizeRef.current?.close();
    // Reset dynamic children when closing
  };

  const header = (headerConfig?: HeaderConfig) => (
    <View
      className={headerConfig?.className}
      style={[styles.header, headerConfig?.style]}
    >
      <Text style={styles.headerTitle}>{headerConfig?.title}</Text>
      <TouchableOpacity onPress={close}>
        <Ionicons name="close" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderChildren = state.dynamicChildren || (
    <View>
      <Text>Chưa có nội dung</Text>
    </View>
  );

  const config = state.config;

  return (
    <Modalize
      ref={modalizeRef}
      adjustToContentHeight
      {...modalizeProps}
      handleStyle={{
        display: "none",
      }}
    >
      <View
        className={props.classNameContent}
        style={[styles.content, props.styleContent]}
      >
        {config?.header && header(config.header)}
        <View className="h-full">{renderChildren}</View>
      </View>
    </Modalize>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    lineHeight: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 44,
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
