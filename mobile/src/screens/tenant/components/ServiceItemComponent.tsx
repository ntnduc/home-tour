import OverlayScreen from "@/components/OverlayScreen";
import React, { useState } from "react";
import SelectList from "../../../components/SelectList";

const data = [
  { key: "1", value: "Dịch vụ 1" },
  { key: "2", value: "Dịch vụ 2" },
  { key: "3", value: "Dịch vụ 3" },
];

const ServiceItemComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <OverlayScreen
      onOutsidePress={() => {
        console.log("object222");
        setIsOpen(false);
      }}
    >
      <SelectList
        setSelected={() => setIsOpen(false)}
        data={data}
        closeicon="close"
        placeholder="Chọn dịch vụ"
        boxStyles={{ width: "100%" }}
      />
    </OverlayScreen>
  );
};

export default ServiceItemComponent;
