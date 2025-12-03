import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";

interface OverlayScreenProps {
  onOutsidePress?: () => void;
  children: React.ReactNode;
}

const OverlayScreen = ({ onOutsidePress, children }: OverlayScreenProps) => (
  <View style={styles.container} pointerEvents="box-none">
    <TouchableWithoutFeedback onPress={onOutsidePress}>
      <View style={styles.overlay} pointerEvents="auto" />
    </TouchableWithoutFeedback>
    <View style={styles.content} pointerEvents="box-none">
      {children}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    height: "100%",
    width: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "transparent",
    zIndex: 32,
  },
  content: {
    zIndex: 33,
    flex: 1,
  },
});

export default OverlayScreen;
