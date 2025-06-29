import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Contract,
  CONTRACT_STATUS_COLOR,
  CONTRACT_STATUS_LABEL,
  ContractStatus,
} from "../types/contract";

interface ContractCardProps {
  contract: Contract;
  onPress: () => void;
  showActions?: boolean;
  onViewDetails?: () => void;
  onTerminate?: () => void;
  onRenew?: () => void;
}

const ContractCard = ({
  contract,
  onPress,
  showActions = false,
  onViewDetails,
  onTerminate,
  onRenew,
}: ContractCardProps) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const endDate = new Date(contract.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: ContractStatus) => {
    return CONTRACT_STATUS_COLOR[status] || { bg: "#F3F4F6", color: "#6B7280" };
  };

  const daysRemaining = getDaysRemaining();
  const statusColor = getStatusColor(contract.status);
  const canRenew =
    contract.status === ContractStatus.ACTIVE && daysRemaining <= 30;
  const canTerminate = contract.status === ContractStatus.ACTIVE;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.contractId}>Hợp đồng #{contract.id}</Text>
          <Text style={styles.roomInfo}>
            {contract.roomName} - {contract.buildingName}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View
            style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}
          >
            <Text style={[styles.statusText, { color: statusColor.color }]}>
              {CONTRACT_STATUS_LABEL[contract.status]}
            </Text>
          </View>

          {/* Action Menu */}
          {showActions && (
            <View style={styles.actionMenu}>
              {onViewDetails && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={onViewDetails}
                >
                  <Ionicons name="eye-outline" size={16} color="#007AFF" />
                </TouchableOpacity>
              )}
              {canRenew && onRenew && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.renewButton]}
                  onPress={onRenew}
                >
                  <Ionicons name="refresh-outline" size={16} color="#34C759" />
                </TouchableOpacity>
              )}
              {canTerminate && onTerminate && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.terminateButton]}
                  onPress={onTerminate}
                >
                  <Ionicons name="close-outline" size={16} color="#FF3B30" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Tenant Info */}
      <View style={styles.tenantSection}>
        <View style={styles.tenantHeader}>
          <Ionicons name="person" size={16} color="#6B7280" />
          <Text style={styles.tenantHeaderText}>Người thuê</Text>
        </View>
        <Text style={styles.tenantName}>{contract.tenantName}</Text>
        <Text style={styles.tenantPhone}>📞 {contract.tenantPhone}</Text>
        {contract.tenantEmail && (
          <Text style={styles.tenantEmail}>📧 {contract.tenantEmail}</Text>
        )}
      </View>

      {/* Contract Period */}
      <View style={styles.periodSection}>
        <View style={styles.periodHeader}>
          <Ionicons name="calendar" size={16} color="#6B7280" />
          <Text style={styles.periodHeaderText}>Thời hạn hợp đồng</Text>
        </View>
        <View style={styles.periodRow}>
          <View style={styles.periodItem}>
            <Text style={styles.periodLabel}>Bắt đầu</Text>
            <Text style={styles.periodDate}>
              {formatDate(contract.startDate)}
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color="#6B7280" />
          <View style={styles.periodItem}>
            <Text style={styles.periodLabel}>Kết thúc</Text>
            <Text style={styles.periodDate}>
              {formatDate(contract.endDate)}
            </Text>
          </View>
        </View>

        {contract.status === ContractStatus.ACTIVE && (
          <View
            style={[
              styles.remainingDays,
              daysRemaining <= 7 ? styles.urgentDays : null,
            ]}
          >
            <Text
              style={[
                styles.remainingDaysText,
                daysRemaining <= 7 ? styles.urgentDaysText : null,
              ]}
            >
              {daysRemaining > 0
                ? `Còn lại: ${daysRemaining} ngày`
                : daysRemaining === 0
                  ? "Hết hạn hôm nay"
                  : `Quá hạn: ${Math.abs(daysRemaining)} ngày`}
            </Text>
          </View>
        )}
      </View>

      {/* Financial Info */}
      <View style={styles.financialSection}>
        <View style={styles.financialHeader}>
          <Ionicons name="cash" size={16} color="#6B7280" />
          <Text style={styles.financialHeaderText}>Thông tin tài chính</Text>
        </View>
        <View style={styles.financialRow}>
          <Text style={styles.financialLabel}>Tiền thuê:</Text>
          <Text style={styles.financialValue}>
            {formatCurrency(contract.monthlyRent)}đ/tháng
          </Text>
        </View>
        <View style={styles.financialRow}>
          <Text style={styles.financialLabel}>Tiền cọc:</Text>
          <Text style={styles.financialValue}>
            {formatCurrency(contract.deposit)}đ
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 8,
  },
  contractId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 2,
  },
  roomInfo: {
    fontSize: 14,
    color: "#6B7280",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  actionMenu: {
    flexDirection: "row",
    gap: 4,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  renewButton: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  terminateButton: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  tenantSection: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tenantHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  tenantHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 6,
  },
  tenantName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  tenantPhone: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 1,
  },
  tenantEmail: {
    fontSize: 13,
    color: "#6B7280",
  },
  periodSection: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  periodHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  periodHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 6,
  },
  periodRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  periodItem: {
    flex: 1,
  },
  periodLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  periodDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  remainingDays: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  urgentDays: {
    backgroundColor: "#FEF3C7",
  },
  remainingDaysText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1D4ED8",
  },
  urgentDaysText: {
    color: "#D97706",
  },
  financialSection: {
    marginBottom: 12,
  },
  financialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  financialHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 6,
  },
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  financialLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  financialValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
  },
});

export default ContractCard;
