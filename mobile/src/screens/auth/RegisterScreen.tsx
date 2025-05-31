import { register } from "@/api/auth/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type RootStackParamList = {
  Login: undefined;
  OTPVerification: { phoneNumber: string };
  RoomList: undefined;
  MainTabs: undefined;
  Register: { registrationToken: string };
};

type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Register"
>;

const RegisterScreen = ({ navigation, route }: RegisterScreenProps) => {
  const { registrationToken } = route.params;
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập họ tên của bạn.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await register(registrationToken, fullName);
      // Lưu token vào AsyncStorage
      await AsyncStorage.setItem("accessToken", response.accessToken);
      await AsyncStorage.setItem("refreshToken", response.refreshToken);
      await AsyncStorage.setItem("user", JSON.stringify(response.user));
      navigation.replace("MainTabs");
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
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
        <Ionicons
          name="person-add-outline"
          size={48}
          color="#6a5af9"
          style={{ alignSelf: "center", marginBottom: 8 }}
        />
        <Text style={styles.title}>Hoàn tất đăng ký</Text>
        <Text style={styles.subtitle}>
          Vui lòng nhập họ tên của bạn để hoàn tất đăng ký
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Đang xử lý..." : "Hoàn tất"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, padding: 24, justifyContent: "center" },
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
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#f5f6fa",
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
  buttonDisabled: { backgroundColor: "#ccc" },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

export default RegisterScreen;
