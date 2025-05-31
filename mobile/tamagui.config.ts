import { createInterFont } from "@tamagui/font-inter";
import { createMedia } from "@tamagui/react-native-media-driver";
import { shorthands } from "@tamagui/shorthands";
import { themes, tokens } from "@tamagui/themes";
import { createTamagui } from "tamagui";

const headingFont = createInterFont({
  size: {
    6: 15,
    7: 18,
    8: 22,
    9: 32,
    10: 44,
  },
  transform: {
    6: "uppercase",
    7: "none",
  },
  weight: {
    6: "400",
    7: "600",
  },
  color: {
    6: "$colorFocus",
    7: "$color",
  },
  letterSpacing: {
    5: 2,
    6: 1,
    7: 0,
    8: -1,
    9: -2,
    10: -3,
    12: -4,
    14: -5,
    15: -6,
  },
  face: {
    700: { normal: "InterBold" },
  },
});

const bodyFont = createInterFont(
  {
    face: {
      700: { normal: "InterBold" },
    },
  },
  {
    sizeSize: (size) => Math.round(size * 1.1),
    sizeLineHeight: (size) => Math.round(size * 1.1 + (size > 20 ? 10 : 10)),
  }
);

const config = createTamagui({
  defaultTheme: "light",
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes: {
    ...themes,
    light: {
      background: "#ffffff",
      backgroundHover: "#f8f9fa",
      backgroundPress: "#f0f0f0",
      backgroundFocus: "#e9ecef",
      color: "#333333",
      colorHover: "#666666",
      colorPress: "#999999",
      colorFocus: "#6a5af9",
      borderColor: "#dee2e6",
      borderColorHover: "#adb5bd",
      shadowColor: "rgba(0,0,0,0.1)",
      shadowColorHover: "rgba(0,0,0,0.2)",
      shadowColorPress: "rgba(0,0,0,0.3)",
      shadowColorFocus: "rgba(0,0,0,0.4)",
    },
    dark: {
      background: "#121212",
      backgroundHover: "#1e1e1e",
      backgroundPress: "#2d2d2d",
      backgroundFocus: "#3d3d3d",
      color: "#ffffff",
      colorHover: "#cccccc",
      colorPress: "#999999",
      colorFocus: "#8a7af9",
      borderColor: "#2d2d2d",
      borderColorHover: "#3d3d3d",
      shadowColor: "rgba(0,0,0,0.2)",
      shadowColorHover: "rgba(0,0,0,0.3)",
      shadowColorPress: "rgba(0,0,0,0.4)",
      shadowColorFocus: "rgba(0,0,0,0.5)",
    },
  },
  tokens,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: "none" },
    pointerCoarse: { pointer: "coarse" },
  }),
});

export type AppConfig = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
