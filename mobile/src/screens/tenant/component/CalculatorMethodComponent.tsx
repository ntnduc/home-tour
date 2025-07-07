import {
  SERVICE_CALCULATE_METHOD_WITH_INFO,
  ServiceCalculateMethod,
} from "@/constant/service.constant";
import { createStyles } from "@/styles/StyleCreateTenantScreent";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity } from "react-native";
import { XStack, YStack, useTheme as useTamaguiTheme } from "tamagui";

const CalculatorMethodComponent = ({
  value,
  onChange,
}: {
  value: ServiceCalculateMethod;
  onChange: (value: ServiceCalculateMethod) => void;
}) => {
  const theme = useTamaguiTheme();
  const styles = createStyles(theme);

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <YStack space="$2">
      <Text
        style={[
          styles.label,
          {
            marginTop: 12,
            marginBottom: 0,
            textAlign: "center",
          },
        ]}
      >
        Cách tính tiền
      </Text>
      <YStack space="$2">
        <TouchableOpacity
          style={[
            styles.calculationMethodButton,
            styles.calculationMethodButtonActive,
          ]}
          onPress={() => onChange(value)}
        >
          <XStack space="$3" alignItems="center" flex={1}>
            <Ionicons
              name={SERVICE_CALCULATE_METHOD_WITH_INFO[value].icon}
              size={20}
              color="#fff"
            />
            <Text style={[styles.methodTitle, styles.methodTitleActive]}>
              {SERVICE_CALCULATE_METHOD_WITH_INFO[value].label}
            </Text>
          </XStack>
          <TouchableOpacity
            style={styles.methodDetailButton}
            onPress={() => {
              Alert.alert(
                "Thông tin",
                SERVICE_CALCULATE_METHOD_WITH_INFO[value].info
              );
            }}
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </TouchableOpacity>

        {isExpanded && (
          <>
            {Object.values(ServiceCalculateMethod)
              .filter((method) => method !== value)
              .map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[styles.calculationMethodButton]}
                  onPress={() => {
                    onChange(method);
                  }}
                >
                  <XStack space="$3" alignItems="center" flex={1}>
                    <Ionicons
                      name={SERVICE_CALCULATE_METHOD_WITH_INFO[method].icon}
                      size={20}
                      color="#007AFF"
                    />
                    <Text style={[styles.methodTitle]}>
                      {SERVICE_CALCULATE_METHOD_WITH_INFO[method].label}
                    </Text>
                  </XStack>
                  <TouchableOpacity
                    style={styles.methodDetailButton}
                    onPress={() => {
                      Alert.alert(
                        "Thông tin",
                        SERVICE_CALCULATE_METHOD_WITH_INFO[method].info
                      );
                    }}
                  >
                    <Ionicons
                      name="information-circle-outline"
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </>
        )}

        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <XStack space="$2" alignItems="center" justifyContent="center">
            <Text style={styles.expandButtonText}>
              {isExpanded ? "Thu gọn" : "Xem thêm"}
            </Text>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color="#007AFF"
            />
          </XStack>
        </TouchableOpacity>
      </YStack>
    </YStack>
  );
};

export default CalculatorMethodComponent;
