import { requestOTP } from "@/api/auth/api";
import { RootStackParamList } from "@/navigation";
import { checkLogin } from "@/utils/appUtil";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkInitialLogin();
  }, []);

  const checkInitialLogin = async () => {
    try {
      const isLoggedIn = await checkLogin();
      if (isLoggedIn) {
        navigation.replace("MainTabs");
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra đăng nhập:", error);
    }
  };

  const handleRequestOTP = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại");
      return;
    }

    setIsLoading(true);
    try {
      const response = await requestOTP(phoneNumber);
      if (response.success) {
        navigation.navigate("OTPVerification", { phoneNumber });
      } else {
        Alert.alert("Lỗi", response.message || "Không thể gửi mã OTP");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đã có lỗi xảy ra khi gửi mã OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Text style={styles.title}>Đăng nhập / Đăng ký</Text>
        <Text style={styles.subtitle}>
          Vui lòng nhập số điện thoại để tiếp tục
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRequestOTP}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Đang gửi..." : "Tiếp tục"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#222",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 28,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6a5af9",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#6a5af9",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

export default LoginScreen;
