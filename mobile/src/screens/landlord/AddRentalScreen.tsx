import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AddRentalScreen = ({ navigation }) => {
  const [roomNumber, setRoomNumber] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [tenantPhone, setTenantPhone] = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [deposit, setDeposit] = useState("");

  const handleSubmit = () => {
    // TODO: Implement submit logic
    console.log("Submit rental:", {
      roomNumber,
      tenantName,
      tenantPhone,
      tenantEmail,
      startDate,
      endDate,
      monthlyRent,
      deposit,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Thêm hợp đồng mới</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Số phòng</Text>
          <TextInput
            style={styles.input}
            value={roomNumber}
            onChangeText={setRoomNumber}
            placeholder="Nhập số phòng"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Thông tin người thuê</Text>
          <TextInput
            style={styles.input}
            value={tenantName}
            onChangeText={setTenantName}
            placeholder="Họ và tên"
          />
          <TextInput
            style={[styles.input, styles.marginTop]}
            value={tenantPhone}
            onChangeText={setTenantPhone}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, styles.marginTop]}
            value={tenantEmail}
            onChangeText={setTenantEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Thời hạn thuê</Text>
          <TextInput
            style={styles.input}
            value={startDate}
            onChangeText={setStartDate}
            placeholder="Ngày bắt đầu (DD/MM/YYYY)"
          />
          <TextInput
            style={[styles.input, styles.marginTop]}
            value={endDate}
            onChangeText={setEndDate}
            placeholder="Ngày kết thúc (DD/MM/YYYY)"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Thông tin thanh toán</Text>
          <TextInput
            style={styles.input}
            value={monthlyRent}
            onChangeText={setMonthlyRent}
            placeholder="Tiền thuê hàng tháng (VNĐ)"
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.marginTop]}
            value={deposit}
            onChangeText={setDeposit}
            placeholder="Tiền cọc (VNĐ)"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Tạo hợp đồng</Text>
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

export default AddRentalScreen;
