import React, { createContext, useContext, useRef } from "react";
import AppSheet, { AppSheetProps, AppSheetRef } from "./AppSheet/AppSheet";

interface GlobalAppSheetContextType {
  openAppSheet: (children: React.ReactNode, config?: any) => void;
  closeAppSheet: () => void;
}

const GlobalAppSheetContext = createContext<GlobalAppSheetContextType | null>(
  null
);

export const useGlobalAppSheet = () => {
  const context = useContext(GlobalAppSheetContext);
  if (!context) {
    throw new Error(
      "useGlobalAppSheet must be used within GlobalAppSheetProvider"
    );
  }
  return context;
};

interface GlobalAppSheetProviderProps {
  children: React.ReactNode;
}

export const GlobalAppSheetProvider: React.FC<GlobalAppSheetProviderProps> = ({
  children,
}) => {
  const appSheetRef = useRef<AppSheetRef>(null);
  const openAppSheet = (children: React.ReactNode, config?: AppSheetProps) => {
    appSheetRef.current?.open(children, config);
  };

  const closeAppSheet = () => {
    appSheetRef.current?.close();
  };

  return (
    <GlobalAppSheetContext.Provider value={{ openAppSheet, closeAppSheet }}>
      {children}
      <AppSheet ref={appSheetRef} />
    </GlobalAppSheetContext.Provider>
  );
};
