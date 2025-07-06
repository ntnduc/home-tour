import AutocompleteInput from "@/components/AutocompleteInput";
import { ServiceCalculateMethod } from "@/constant/service.constant";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text } from "tamagui";

const ServiceSelectedSearchComponent = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (services: string) => void;
}) => {
  const optionServices = [
    {
      index: 0,
      name: "Nước",
      price: 0,
      calculationMethod: ServiceCalculateMethod.PER_UNIT_SIMPLE,
    },
    {
      index: 1,
      name: "Điện",
      price: 0,
      calculationMethod: ServiceCalculateMethod.PER_UNIT_SIMPLE,
    },
    {
      index: 2,
      name: "Wifi",
      price: 0,
      calculationMethod: ServiceCalculateMethod.FIXED_PER_ROOM,
    },
    {
      index: 3,
      name: "Gửi xe",
      price: 0,
      calculationMethod: ServiceCalculateMethod.FIXED_PER_ROOM,
    },
  ];
  const [options, setOptions] = useState<any[]>([]);
  const [hideResults, setHideResults] = useState(false);

  const onSelectedService = (service: any) => {
    onChange(service.name);
    setHideResults(true);
  };

  return (
    <AutocompleteInput
      autoComplete="off"
      hideResults={hideResults}
      onChangeText={(text) => {
        setOptions(
          optionServices.filter((option) =>
            option.name.toLowerCase().includes(text.toLowerCase())
          )
        );
        onChange(text);
      }}
      value={value}
      data={options}
      renderResultList={(item: any) => {
        const flatData = item?.data;

        return (
          <ScrollView>
            {flatData.map((item: any, index: number) => (
              <TouchableOpacity
                onPress={() => onSelectedService(item.name)}
                key={index}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
      }}
      flatListProps={{
        keyboardShouldPersistTaps: "always",
        keyExtractor: (item: any) => item.name,
        renderItem: ({ item }) => (
          <TouchableOpacity onPress={() => onChange(item.title)}>
            <Text>{item.title}</Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
};

export default ServiceSelectedSearchComponent;
