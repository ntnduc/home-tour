import { logout } from "@/api/auth/api";
import { User } from "@/types/user";
import { getStoreUser } from "@/utils/appUtil";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Alert, SafeAreaView, ScrollView } from "react-native";
import {
  Avatar,
  Button,
  H3,
  Paragraph,
  XStack,
  YStack,
  useTheme as useTamaguiTheme,
} from "tamagui";

type RootStackParamList = {
  Login: undefined;
  Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTamaguiTheme();
  const [user, setUser] = React.useState<User | undefined>(undefined);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await getStoreUser();
    setUser(userData);
  };

  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            //
          }
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
      <ScrollView>
        <YStack padding="$4" space="$4">
          {/* Header */}
          <YStack
            backgroundColor="$backgroundHover"
            padding="$4"
            borderRadius="$4"
            space="$4"
          >
            <XStack justifyContent="center">
              <Avatar circular size="$8" backgroundColor="$colorFocus">
                <Ionicons
                  name="person-circle"
                  size={40}
                  color={theme.color.val}
                />
              </Avatar>
            </XStack>
            <YStack space="$2" alignItems="center">
              <H3 color="$color">{user?.fullName || "Chưa cập nhật"}</H3>
              <Paragraph color="$colorHover">
                {user?.phoneNumber || "Chưa cập nhật"}
              </Paragraph>
            </YStack>
          </YStack>

          {/* Menu Items */}
          <YStack space="$2">
            <Button
              icon={
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={theme.color.val}
                />
              }
              onPress={() => {}}
            >
              Thông tin cá nhân
            </Button>

            <Button
              icon={
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color={theme.color.val}
                />
              }
              onPress={() => {}}
            >
              Cài đặt
            </Button>

            <Button
              icon={
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color={theme.color.val}
                />
              }
              onPress={() => {}}
            >
              Trợ giúp
            </Button>

            <Button
              color={"#f87171"}
              icon={<Ionicons name="log-out-outline" size={24} />}
              onPress={handleLogout}
              backgroundColor="$red10"
            >
              Đăng xuất
            </Button>
          </YStack>

          {/* App Info */}
          <YStack alignItems="center" padding="$4">
            <Paragraph color="$colorPress">Phiên bản 1.0.0</Paragraph>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
