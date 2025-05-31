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
} from "react-native";
import { RootStackParamList } from "../../navigation";

type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Register"
>;

const RegisterScreen = ({ navigation, route }: RegisterScreenProps) => {
  const { phoneNumber } = route.params;
  const [fullName, setFullName] = useState("");

  const handleRegister = async () => {
    if (!fullName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập họ và tên");
      return;
    }

    try {
      // TODO: Implement register API call
      // Sau khi đăng ký thành công, chuyển đến màn hình chính
      navigation.replace("MainTabs");
    } catch (error) {
      Alert.alert("Lỗi", "Đã có lỗi xảy ra khi đăng ký");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Text style={styles.title}>Hoàn tất đăng ký</Text>
        <Text style={styles.subtitle}>
          Vui lòng nhập họ và tên để hoàn tất đăng ký
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Hoàn tất</Text>
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

export default RegisterScreen;
