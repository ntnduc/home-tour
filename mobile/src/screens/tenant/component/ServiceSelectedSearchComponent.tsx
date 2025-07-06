import { getListService } from "@/api/service/service.api";
import AutocompleteInput from "@/components/AutocompleteInput";
import { createStyles } from "@/styles/component/StyleComboBox";
import { ServiceCreateRequest } from "@/types/service";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Text, useTheme as useTamaguiTheme } from "tamagui";

const ServiceSelectedSearchComponent = ({
  value,
  error,
  onChange,
}: {
  value: ServiceCreateRequest;
  error?: string;
  onChange: (services: ServiceCreateRequest) => void;
}) => {
  const ICON_DEFAULT = "apps-outline";

  const theme = useTamaguiTheme();
  const styles = createStyles(theme);

  const [search, setSearch] = useState("");
  const [valueSelected, setValueSelected] = useState<
    ServiceCreateRequest | string
  >(value);
  const [hideResults, setHideResults] = useState(true);

  const onSelectedService = (service: any) => {
    setValueSelected(service);
    setHideResults(true);
    onChange(service);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["services", search],
    queryFn: () =>
      getListService({
        limit: 5,
        offset: 0,
        globalKey: search,
      }),
    staleTime: 1000 * 60 * 2,
  });

  const handleFocus = () => {
    if (data?.data?.items && data?.data?.items?.length > 0) {
      setHideResults(false);
    }
  };

  const handleChangeText = (text: string) => {
    setSearch(text);
    setValueSelected(text);

    if (data?.data?.items && data?.data?.items?.length > 0) {
      setHideResults(false);
    } else {
      setHideResults(true);
    }
  };

  useEffect(() => {
    if (data?.data?.items?.length === 0) {
      setHideResults(false);
    }
  }, [data]);

  return (
    <AutocompleteInput
      hideResults={hideResults}
      onChangeText={handleChangeText}
      value={
        typeof valueSelected === "string" ? valueSelected : valueSelected?.name
      }
      error={error}
      data={data?.data?.items ?? []}
      returnKeyType="done"
      onSubmitEditing={() => {
        setHideResults(true);
      }}
      renderResultList={(list: any) => {
        const flatData = list?.data;
        return (
          <View style={styles.dropdownContainer}>
            <ScrollView style={{ maxHeight: 250 }}>
              {flatData.map((option: any) => (
                <TouchableOpacity
                  className="flex flex-row items-center"
                  key={String(option.id)}
                  style={[styles.item]}
                  onPress={() => onSelectedService(option)}
                >
                  <Ionicons
                    className="mr-3"
                    name={option?.icon ? option?.icon : ICON_DEFAULT}
                    size={20}
                    color="#007AFF"
                  />
                  <Text style={[styles.itemText]}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );
      }}
    />
  );
};

export default ServiceSelectedSearchComponent;
