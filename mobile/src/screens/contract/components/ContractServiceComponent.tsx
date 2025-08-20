import Input from "@/components/Input";
import ServiceSelectedSearchComponent from "@/screens/tenant/components/ServiceSelectedSearchComponent";
import React from "react";
import { View } from "react-native";

const ContractServiceComponent = () => {
  return (
    <View className="flex flex-col gap-4">
      <ServiceSelectedSearchComponent
        value={""}
        onChange={(service) => {
          console.log(service);
        }}
      />
      <Input
        placeholder="Giá"
        // disabled={
        //   service.calculationMethod ===
        //   ServiceCalculateMethod.FREE
        // }
        icon="cash-outline"
        iconProps={{
          color: "#007AFF",
        }}
        // value={
        //   service.calculationMethod ===
        //   ServiceCalculateMethod.FREE
        //     ? "0"
        //     : value
        //     ? formatCurrency(value.toString())
        //     : ""
        // }
        // onChangeText={(text) => {
        //   const numericValue = text.replace(
        //     /[^0-9]/g,
        //     ""
        //   );
        //   onChange(numericValue);
        // }}
        keyboardType="numeric"
        // error={
        //   errors.services?.[index]?.price?.message
        // }
      />
    </View>
  );
};

export default ContractServiceComponent;
