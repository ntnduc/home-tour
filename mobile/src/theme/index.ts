import { colors, ColorType } from "./colors";
import { spacing, SpacingType } from "./spacing";
import { typography, TypographyType } from "./typography";

export const theme = {
  colors,
  spacing,
  typography,
} as const;

export type Theme = typeof theme;

// Re-export types
export type { ColorType, SpacingType, TypographyType };
