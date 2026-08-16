import { ChildStep, ParrentStep } from "@/components/StepByStep";
import { RootStackParamList } from "@/navigation/types";
import {
  ContractCreateRequest,
  ContractDetailResponse,
} from "@/types/contract";
import { RoomServiceDetailResponse } from "@/types/room";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useRef, useState } from "react";
import { View } from "react-native";
import ConfirmCreateContract, {
  ConfirmCreateContractRef,
} from "./components/ConfirmCreateContract";
import CreateContractForm from "./components/CreateContractForm";

type CreateContractScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CreateContract">;
  route: { params: RootStackParamList["CreateContract"] };
};

const CreateContractScreen = ({
  navigation,
  route,
}: CreateContractScreenProps) => {
  const [roomData, setRoomData] = useState<RoomServiceDetailResponse | null>(
    null,
  );
  const [confirmData, setConfirmData] = useState<ContractDetailResponse | null>(
    null,
  );
  const [defaultContractData, setDefaultContractData] =
    useState<ContractCreateRequest | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  const confirmRef = useRef<ConfirmCreateContractRef>(null);

  const handleConfirm = async () => {
    await confirmRef.current?.confirm();
    return false;
  };

  const onNextStep = (
    rawData: ContractCreateRequest,
    data: ContractDetailResponse,
  ) => {
    setDefaultContractData(rawData);
    setConfirmData(data);
    setActiveStep(activeStep + 1);
  };

  return (
    <View className="flex-1">
      <ParrentStep activeStep={activeStep}>
        <ChildStep label="Thông tin" hideButtonRow={true}>
          <CreateContractForm
            navigation={navigation}
            route={route}
            onNextStep={onNextStep}
            roomData={roomData}
            defaultContractData={defaultContractData}
            onRoomLoaded={setRoomData}
          />
        </ChildStep>

        <ChildStep
          offsetBottomActionButtom={-12}
          label="Xác nhận"
          previousAction={{
            label: "Chỉnh sửa thông tin",
            icon: "pencil",
            onPress: () => {
              setActiveStep(activeStep - 1);
              return true;
            },
          }}
          finishAction={{
            label: "Xác nhận tạo hợp đồng",
            icon: "checkmark-circle",
            variant: "success",
            onPress: handleConfirm,
          }}
        >
          {confirmData && (
            <ConfirmCreateContract
              ref={confirmRef}
              navigation={navigation}
              contract={confirmData}
              room={roomData?.name || ""}
            />
          )}
        </ChildStep>
      </ParrentStep>
    </View>
  );
};

export default CreateContractScreen;
