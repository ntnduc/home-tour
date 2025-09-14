import BottomSheet, {
  BottomSheetFooterProps,
  BottomSheetProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppSheetBackdropComponent from "./AppSheetBackdropComponent";
import AppSheetHandleComponent from "./AppSheetHandleComponent";
import AppSheetHeader from "./AppSheetHeader";

export type HeaderConfig = {
  element?: ReactNode;
  title?: string;
  style?: StyleProp<ViewStyle>;
  className?: string;
  height?: number;
  onClose?: () => void;
};

export interface AppSheetProps
  extends Omit<BottomSheetProps, "ref" | "children"> {
  classNameContent?: string;
  styleContent?: StyleProp<ViewStyle>;
  header?: HeaderConfig;
  children?: ReactNode;
  ignoreBottomInset?: boolean;
  ignoreBottomSheetInset?: boolean;
  renderFooter?: (props: BottomSheetFooterProps) => ReactNode;
}

export interface AppSheetRef {
  open: (children: ReactNode, config?: AppSheetProps) => void;
  close: () => void;
}

const AppSheet = forwardRef<AppSheetRef, AppSheetProps>((props, ref) => {
  const { children: defaultChildren, ...bottomSheetProps } = props;

  const insets = useSafeAreaInsets();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const isOpeningRef = useRef(false);

  const [state, setState] = useState<{
    dynamicChildren: ReactNode | null;
    config: AppSheetProps | null;
  }>({
    dynamicChildren: null,
    config: null,
  });

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  const open = useCallback((children: ReactNode, config?: AppSheetProps) => {
    if (children && !isOpeningRef.current) {
      isOpeningRef.current = true;
      setState({ dynamicChildren: null, config: null });
      setTimeout(() => {
        setState({ dynamicChildren: children, config: config || null });
        setTimeout(() => {
          bottomSheetRef.current?.expand();
          isOpeningRef.current = false;
        }, 100);
      }, 100);
    }
  }, []);

  const close = useCallback(() => {
    bottomSheetRef.current?.close();
    if (state.config?.onClose) {
      state.config.onClose();
    }
    setState({ dynamicChildren: null, config: null });
  }, []);

  const header = (headerConfig?: HeaderConfig) => {
    return (
      <>
        {headerConfig?.element && headerConfig?.element}
        {!headerConfig?.element && (
          <AppSheetHeader {...headerConfig} onClose={close} />
        )}
      </>
    );
  };

  const _renderChildren = () => {
    if (state.dynamicChildren) {
      if (state.config?.header) {
        return (
          <>
            {header(state.config.header)}
            {state.dynamicChildren}
            {!state.config?.ignoreBottomInset && (
              <BottomSheetView>
                <View style={{ height: insets.bottom }} />
              </BottomSheetView>
            )}
          </>
        );
      }
      return state.dynamicChildren;
    } else {
      return (
        <BottomSheetView>
          <Text>Chưa có nội dung</Text>
        </BottomSheetView>
      );
    }
  };

  const config = state.config || {};

  const renderBackdrop = useCallback(
    (props: any) => (
      <AppSheetBackdropComponent {...props} onBackdropPress={close} />
    ),
    [close]
  );

  if (config.ignoreBottomSheetInset && state.dynamicChildren) {
    return <>{state.dynamicChildren}</>;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose
      onClose={close}
      snapPoints={["50%"]}
      backdropComponent={renderBackdrop}
      handleComponent={AppSheetHandleComponent}
      enableOverDrag={false}
      enableHandlePanningGesture={true}
      {...config}
      detached={true}
    >
      {_renderChildren()}
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#222",
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "95%",
    backgroundColor: "#fff",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

AppSheet.displayName = "AppSheet";

export default AppSheet;
