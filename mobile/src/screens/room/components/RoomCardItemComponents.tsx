import CardComponent from '@/screens/common/CardComponent';
import { colors } from '@/theme/colors';
import {
  CONTRACT_STATUS_COLOR,
  CONTRACT_STATUS_LABEL,
  ContractStatus,
} from '@/types/contract';
import { RoomListResponse, RoomStatus } from '@/types/room';
import { formatDate } from '@/utils/dateUtil';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/StyleRoomCardItemComponent';

type Props = {
  item: RoomListResponse;
  navigation: any;
};

const RoomCardItemComponent = ({ item, navigation }: Props) => {
  const contractActive = item.contracts?.find(
    (contract) => contract.status === ContractStatus.ACTIVE,
  );

  return (
    <CardComponent
      style={styles.card}
      title={item.name}
      actions={['edit', 'delete']}
      onActionPress={(key) => {
        if (key === 'edit') {
          navigation.navigate('UpdateRoom', { roomId: item.id });
        }
      }}
      description={item.property?.name}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.price}>
            {item.rentAmount?.toLocaleString() ?? ''}đ/tháng
          </Text>
          {item.description && (
            <Text style={styles.roomDesc}>{item.description}</Text>
          )}

          {/* Thông tin hợp đồng cho phòng đang thuê */}
          {contractActive && item.status === RoomStatus.OCCUPIED && (
            <View style={styles.contractInfo}>
              <View style={styles.contractRow}>
                <Text style={styles.contractLabel}>Người thuê:</Text>
                <Text style={styles.contractText}>
                  {item.landlordClient || 'N/A'}
                </Text>
              </View>
              <View style={styles.contractRow}>
                <Text style={styles.contractLabel}>Hợp đồng:</Text>
                <Text style={styles.contractText}>#{contractActive.code}</Text>
              </View>
            </View>
          )}

          {/* Thông tin thanh toán */}
          {contractActive &&
            contractActive.status === ContractStatus.ACTIVE && (
              <View style={styles.paymentInfo}>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>
                    Trạng thái thanh toán:
                  </Text>
                  <View
                    style={[
                      styles.paymentStatusBadge,
                      {
                        backgroundColor:
                          CONTRACT_STATUS_COLOR[contractActive.status].bg,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.paymentStatusText,
                        {
                          color:
                            CONTRACT_STATUS_COLOR[contractActive.status].color,
                        },
                      ]}
                    >
                      {CONTRACT_STATUS_LABEL[contractActive.status]}
                    </Text>
                  </View>
                </View>
                {contractActive.endDate && (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Hạn thanh toán:</Text>
                    <Text
                      style={[
                        styles.paymentDateText,
                        contractActive.endDate &&
                        new Date(contractActive.endDate) < new Date()
                          ? styles.overdueText
                          : contractActive.endDate &&
                              new Date(contractActive.endDate) <=
                                new Date(
                                  new Date().setDate(new Date().getDate() + 3),
                                )
                            ? styles.warningText
                            : styles.normalText,
                      ]}
                    >
                      {formatDate(contractActive.endDate)}
                      {/* {daysUntilDue !== null && (
                      <Text style={styles.daysText}>
                        {daysUntilDue < 0
                          ? ` (Quá hạn ${Math.abs(daysUntilDue)} ngày)`
                          : daysUntilDue === 0
                          ? " (Hôm nay)"
                          : daysUntilDue <= 3
                          ? ` (Còn ${daysUntilDue} ngày)`
                          : ""}
                      </Text>
                    )} */}
                    </Text>
                  </View>
                )}
                {contractActive.id && (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Tổng hóa đơn:</Text>
                    <Text style={styles.invoiceAmount}>
                      {contractActive.depositAmountPaid.toLocaleString()}đ
                    </Text>
                  </View>
                )}
              </View>
            )}
        </View>
      </View>

      {/* Nút hành động hợp đồng */}
      {item.status === RoomStatus.AVAILABLE ? (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.createContractBtn}
            onPress={() => {
              navigation.navigate('CreateContract', { roomId: item.id });
            }}
          >
            <Ionicons
              name="document-text-outline"
              size={16}
              color={colors.primary.main}
            />
            <Text style={styles.createContractBtnText}>Tạo hợp đồng</Text>
          </TouchableOpacity>
        </View>
      ) : item.status === RoomStatus.OCCUPIED && contractActive ? (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.viewContractBtn}
            onPress={() => {
              contractActive?.id &&
                navigation.navigate('ContractDetail', {
                  contractId: contractActive?.id,
                });
            }}
          >
            <Ionicons
              name="document-outline"
              size={16}
              color={colors.primary.main}
            />
            <Text style={styles.viewContractBtnText}>Xem hợp đồng</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.terminateContractBtn}
            onPress={() => {
              navigation.navigate("TerminateContract", {
                contractId: contractActive.id,
              });
            }}
          >
            <Ionicons
              name="close-circle-outline"
              size={16}
              color={colors.status.error}
            />
            <Text style={styles.terminateContractBtnText}>Kết thúc</Text>
          </TouchableOpacity> */}
        </View>
      ) : null}

      {/* Nút hành động thanh toán */}
      {contractActive &&
        (contractActive.status === ContractStatus.ACTIVE ||
          contractActive.status === ContractStatus.EXPIRED) && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.invoiceBtn}
              onPress={() => {
                if (contractActive.id) {
                  navigation.navigate('CreateInvoice', {
                    contractId: contractActive.id,
                    roomId: item.id,
                  });
                }
              }}
            >
              <Ionicons
                name="receipt-outline"
                size={16}
                color={colors.primary.main}
              />
              <Text style={styles.invoiceBtnText}>Tạo hóa đơn</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.payBtn}
              onPress={() => {
                if (contractActive.id) {
                  navigation.navigate('CreateInvoice', {
                    invoiceId: contractActive.id,
                    fromHistory: false,
                  });
                }
              }}
            >
              <Ionicons
                name="card-outline"
                size={16}
                color={colors.neutral.white}
              />
              <Text style={styles.payBtnText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        )}
    </CardComponent>
  );
};

export default RoomCardItemComponent;
