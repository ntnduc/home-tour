export const typography = {
  // Font families
  fontFamily: {
    regular: "System",
    medium: "System",
    bold: "System",
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Line heights
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
  },

  // Font weights
  fontWeight: {
    regular: "400",
    medium: "500",
    bold: "700",
  },

  // Text styles
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
} as const;

export type TypographyType = typeof typography;
