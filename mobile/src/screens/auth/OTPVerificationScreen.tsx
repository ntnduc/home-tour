import { verifyOTP } from "@/api/auth/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
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

type OTPVerificationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "OTPVerification"
>;

const OTPVerificationScreen = ({
  navigation,
  route,
}: OTPVerificationScreenProps) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mã OTP (6 số).");
      return;
    }
    setIsLoading(true);
    try {
      const response = await verifyOTP(phoneNumber, otpString);
      if (!response.isRegistered && response.registrationToken) {
        navigation.replace("Register", {
          registrationToken: response.registrationToken,
        });
      } else {
        await AsyncStorage.setItem("accessToken", response.accessToken);
        await AsyncStorage.setItem("refreshToken", response.refreshToken);
        await AsyncStorage.setItem("user", JSON.stringify(response.user));
        navigation.replace("MainTabs");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Mã OTP không đúng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timeLeft > 0) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTimeLeft(60);
      Alert.alert("Thành công", "Mã OTP mới đã được gửi.");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể gửi lại mã OTP. Vui lòng thử lại sau.");
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
          name="shield-checkmark-outline"
          size={48}
          color="#6a5af9"
          style={{ alignSelf: "center", marginBottom: 8 }}
        />
        <Text style={styles.title}>Xác thực OTP</Text>
        <Text style={styles.subtitle}>
          Nhập mã xác thực gồm 6 số đã gửi đến{"\n"}
          <Text style={{ color: "#6a5af9", fontWeight: "bold" }}>
            {phoneNumber}
          </Text>
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={[styles.otpInput, digit ? styles.otpInputFilled : {}]}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              autoFocus={index === 0}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleVerifyOTP}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Đang xác thực..." : "Xác nhận"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.resendButton,
            timeLeft > 0 && styles.resendButtonDisabled,
          ]}
          onPress={handleResendOTP}
          disabled={timeLeft > 0 || isLoading}
        >
          <Text style={styles.resendButtonText}>
            {timeLeft > 0
              ? `Gửi lại mã sau ${timeLeft}s`
              : "Gửi lại mã xác thực"}
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    marginTop: 8,
  },
  otpInput: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 22,
    color: "#222",
    backgroundColor: "#f5f6fa",
  },
  otpInputFilled: {
    borderColor: "#6a5af9",
    backgroundColor: "#eef1fd",
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
  resendButton: { marginTop: 20, alignItems: "center" },
  resendButtonDisabled: { opacity: 0.5 },
  resendButtonText: { color: "#6a5af9", fontSize: 15, fontWeight: "bold" },
});

export default OTPVerificationScreen;
