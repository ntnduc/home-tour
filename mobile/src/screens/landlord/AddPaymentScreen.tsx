import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AddPaymentScreen = ({ navigation }) => {
  const [roomNumber, setRoomNumber] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("rent");
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    // TODO: Implement submit logic
    console.log("Submit payment:", {
      roomNumber,
      tenantName,
      amount,
      date,
      type,
      note,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Thêm thanh toán mới</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Thông tin phòng</Text>
          <TextInput
            style={styles.input}
            value={roomNumber}
            onChangeText={setRoomNumber}
            placeholder="Số phòng"
          />
          <TextInput
            style={[styles.input, styles.marginTop]}
            value={tenantName}
            onChangeText={setTenantName}
            placeholder="Tên người thuê"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Thông tin thanh toán</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="Số tiền (VNĐ)"
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.marginTop]}
            value={date}
            onChangeText={setDate}
            placeholder="Ngày thanh toán (DD/MM/YYYY)"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Loại thanh toán</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === "rent" && styles.typeButtonActive,
              ]}
              onPress={() => setType("rent")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === "rent" && styles.typeButtonTextActive,
                ]}
              >
                Tiền thuê
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === "deposit" && styles.typeButtonActive,
              ]}
              onPress={() => setType("deposit")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === "deposit" && styles.typeButtonTextActive,
                ]}
              >
                Tiền cọc
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === "utility" && styles.typeButtonActive,
              ]}
              onPress={() => setType("utility")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === "utility" && styles.typeButtonTextActive,
                ]}
              >
                Tiện ích
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Ghi chú</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={note}
            onChangeText={setNote}
            placeholder="Nhập ghi chú"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Thêm thanh toán</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  marginTop: {
    marginTop: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  typeButtonText: {
    fontSize: 14,
    color: "#666",
  },
  typeButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddPaymentScreen;
