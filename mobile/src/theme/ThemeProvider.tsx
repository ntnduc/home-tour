// @ts-nocheck
import React, { createContext, useContext, useState } from "react";
import { Theme } from "./index";

// Tạo context cho theme
const ThemeContext = createContext<{
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}>({
  theme: {} as Theme,
  isDarkMode: false,
  toggleTheme: () => {},
});

// Hook để sử dụng theme
export const useTheme = () => useContext(ThemeContext);

// Props cho ThemeProvider
interface ThemeProviderProps {
  children: React.ReactNode;
}

// Component ThemeProvider
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Theme dựa trên mode
  const theme: Theme = {
    colors: {
      primary: {
        main: isDarkMode ? "#8a7af9" : "#6a5af9",
        light: isDarkMode ? "#1a1a2e" : "#eef1fd",
        dark: isDarkMode ? "#6a5af9" : "#4a3fd9",
      },
      secondary: {
        main: isDarkMode ? "#ff6b6b" : "#ff4d4d",
        light: isDarkMode ? "#2d1a1a" : "#ffe5e5",
        dark: isDarkMode ? "#ff4d4d" : "#e63d3d",
      },
      neutral: {
        white: isDarkMode ? "#1a1a1a" : "#ffffff",
        black: isDarkMode ? "#ffffff" : "#000000",
        gray: {
          100: isDarkMode ? "#2d2d2d" : "#f8f9fa",
          200: isDarkMode ? "#3d3d3d" : "#f0f0f0",
          300: isDarkMode ? "#4d4d4d" : "#e9ecef",
          400: isDarkMode ? "#5d5d5d" : "#dee2e6",
          500: isDarkMode ? "#6d6d6d" : "#adb5bd",
          600: isDarkMode ? "#7d7d7d" : "#6c757d",
          700: isDarkMode ? "#8d8d8d" : "#495057",
          800: isDarkMode ? "#9d9d9d" : "#343a40",
          900: isDarkMode ? "#adadad" : "#212529",
        },
      },
      text: {
        primary: isDarkMode ? "#ffffff" : "#333333",
        secondary: isDarkMode ? "#cccccc" : "#666666",
        disabled: isDarkMode ? "#999999" : "#999999",
        inverse: isDarkMode ? "#000000" : "#ffffff",
      },
      background: {
        default: isDarkMode ? "#121212" : "#ffffff",
        paper: isDarkMode ? "#1e1e1e" : "#f8f9fa",
        dark: isDarkMode ? "#000000" : "#212529",
      },
      status: {
        success: isDarkMode ? "#2ecc71" : "#28a745",
        warning: isDarkMode ? "#f1c40f" : "#ffc107",
        error: isDarkMode ? "#e74c3c" : "#dc3545",
        info: isDarkMode ? "#3498db" : "#17a2b8",
      },
      border: {
        light: isDarkMode ? "#2d2d2d" : "#f0f0f0",
        main: isDarkMode ? "#3d3d3d" : "#dee2e6",
        dark: isDarkMode ? "#4d4d4d" : "#adb5bd",
      },
    },
    spacing: {
      base: 4,
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
      screen: {
        padding: 16,
        margin: 16,
      },
      component: {
        padding: 16,
        margin: 8,
        gap: 8,
      },
      layout: {
        header: 56,
        footer: 56,
        sidebar: 240,
      },
    },
    typography: {
      fontFamily: {
        regular: "System",
        medium: "System",
        bold: "System",
      },
      fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
      },
      lineHeight: {
        xs: 16,
        sm: 20,
        md: 24,
        lg: 28,
        xl: 32,
        xxl: 36,
        xxxl: 40,
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        bold: "700",
      },
      text: {
        h1: {
          fontSize: 32,
          lineHeight: 40,
          fontWeight: "700",
        },
        h2: {
          fontSize: 24,
          lineHeight: 32,
          fontWeight: "700",
        },
        h3: {
          fontSize: 20,
          lineHeight: 28,
          fontWeight: "700",
        },
        body1: {
          fontSize: 16,
          lineHeight: 24,
          fontWeight: "400",
        },
        body2: {
          fontSize: 14,
          lineHeight: 20,
          fontWeight: "400",
        },
        caption: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: "400",
        },
      },
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
