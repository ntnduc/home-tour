import { logout } from "@/api/auth/api";
import { useTheme } from "@/theme/ThemeProvider";
import { User } from "@/types/user";
import { getStoreUser } from "@/utils/appUtil";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { Avatar } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

type RootStackParamList = {
  Login: undefined;
  Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.theme.colors.primary.main }}
    >
      <ScrollView>
        <View className="p-4 gap-4">
          {/* Header */}
          <View className="bg-[rgba(0,0,0,0.03)] p-4 rounded-lg gap-4">
            <View className="flex-row justify-center">
              <Avatar>
                {/* <Ionicons
                  name="person-circle"
                  size={40}
                  color={theme.color.val}
                /> */}
              </Avatar>
            </View>
            <View className="gap-2 items-center">
              {/* <Text color={theme.theme.colors.primary.main}>{user?.fullName || "Chưa cập nhật"}</H3> */}
              {/* <Paragraph color={theme.theme.colors.primary.main}>
                {user?.phoneNumber || "Chưa cập nhật"}
              </Paragraph> */}
            </View>
          </View>

          {/* Menu Items */}
          {/* <View className="gap-2">
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
          </View> */}

          {/* App Info */}
          {/* <View className="items-center p-4">
            <Paragraph color="$colorPress">Phiên bản 1.0.0</Paragraph>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
