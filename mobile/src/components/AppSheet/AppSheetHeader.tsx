import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HeaderConfig } from "./AppSheet";

const AppSheetHeader = (props: HeaderConfig & { onClose: () => void }) => {
  const { title, className, style, onClose } = props;
  return (
    <BottomSheetView>
      <View className={props?.className} style={[styles.header, props?.style]}>
        <Text style={styles.headerTitle}>{props?.title}</Text>
        <TouchableOpacity onPress={onClose}></TouchableOpacity>
        <Ionicons name="close" size={24} color="#666" />
      </View>
    </BottomSheetView>
  );
};

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
});

export default AppSheetHeader;
