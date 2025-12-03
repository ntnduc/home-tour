import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";
import { Contract, ContractStatus } from "../types/contract";
import ContractCard from "./ContractCard";

interface ContractListModalProps {
  visible: boolean;
  onClose: () => void;
  contracts: Contract[];
  onContractPress: (contract: Contract) => void;
  onTerminatePress: (contract: Contract) => void;
  onRenewPress: (contract: Contract) => void;
}

const ContractListModal = ({
  visible,
  onClose,
  contracts,
  onContractPress,
  onTerminatePress,
  onRenewPress,
}: ContractListModalProps) => {
  const renderContractCard = ({ item }: { item: Contract }) => (
    <ContractCard
      contract={item}
      onPress={() => onContractPress(item)}
      showActions={true}
      onViewDetails={() => onContractPress(item)}
      onTerminate={() => onTerminatePress(item)}
      onRenew={() => onRenewPress(item)}
    />
  );

  const stats = {
    total: contracts.length,
    active: contracts.filter((c) => c.status === ContractStatus.ACTIVE).length,
    expired: contracts.filter((c) => c.status === ContractStatus.EXPIRED)
      .length,
    terminated: contracts.filter((c) => c.status === ContractStatus.TERMINATED)
      .length,
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: colors.background.paper }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: colors.background.default,
            borderBottomColor: colors.border.light,
            borderBottomWidth: 1,
            paddingTop: 48,
            paddingBottom: 16,
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.text.primary,
              }}
            >
              Danh Sách Hợp Đồng
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.neutral.gray[100],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="close"
                size={20}
                color={colors.neutral.gray[700]}
              />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={{ flexDirection: "row", marginTop: 16, gap: 8 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.primary.light,
                borderRadius: 8,
                padding: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: colors.primary.main,
                  fontWeight: "500",
                }}
              >
                Tổng
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: colors.primary.dark,
                }}
              >
                {stats.total}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.status.success + "15",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: colors.status.success,
                  fontWeight: "500",
                }}
              >
                Đang hoạt động
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: colors.status.success,
                }}
              >
                {stats.active}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.status.warning + "15",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: colors.status.warning,
                  fontWeight: "500",
                }}
              >
                Hết hạn
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: colors.status.warning,
                }}
              >
                {stats.expired}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.status.error + "15",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: colors.status.error,
                  fontWeight: "500",
                }}
              >
                Đã kết thúc
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: colors.status.error,
                }}
              >
                {stats.terminated}
              </Text>
            </View>
          </View>
        </View>

        {/* Contract List */}
        <FlatList
          data={contracts}
          renderItem={renderContractCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 80,
              }}
            >
              <Ionicons
                name="document-outline"
                size={64}
                color={colors.neutral.gray[500]}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  color: colors.text.secondary,
                  marginTop: 16,
                }}
              >
                Không có hợp đồng nào
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.text.disabled,
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                Tạo hợp đồng đầu tiên để bắt đầu quản lý
              </Text>
            </View>
          }
        />

        {/* Close Button */}
        <View
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            right: 24,
          }}
        >
          <TouchableOpacity
            style={{
              width: "100%",
              backgroundColor: colors.neutral.gray[900],
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
            }}
            onPress={onClose}
          >
            <Text
              style={{
                color: colors.text.inverse,
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Đóng
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ContractListModal;
