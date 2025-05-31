export const spacing = {
  // Base spacing unit (4px)
  base: 4,

  // Spacing scale
  xs: 4, // 4px
  sm: 8, // 8px
  md: 16, // 16px
  lg: 24, // 24px
  xl: 32, // 32px
  xxl: 48, // 48px

  // Specific spacing
  screen: {
    padding: 16,
    margin: 16,
  },

  // Component spacing
  component: {
    padding: 16,
    margin: 8,
    gap: 8,
  },

  // Layout spacing
  layout: {
    header: 56,
    footer: 56,
    sidebar: 240,
  },
} as const;

export type SpacingType = typeof spacing;
