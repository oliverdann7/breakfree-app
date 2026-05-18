// app/utils/colors.js
export const colors = {
  // Primary Brand Colors
  navy: '#0A2540',
  navyDeep: '#061829',
  royal: '#0072B0',
  cyan: '#14B8D4',
  gold: '#C9961A',
  amber: '#C9961A',

  // Secondary
  cream: '#F4E8C8',

  // Neutral
  white: '#FFFFFF',
  black: '#000000',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textTertiary: 'rgba(255, 255, 255, 0.35)',

  // Backgrounds
  bgPrimary: '#061829',
  bgSecondary: '#0A2540',
  bgTertiary: 'rgba(255, 255, 255, 0.05)',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Semantic
  border: 'rgba(255, 255, 255, 0.12)',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Transparent variants
  goldLight: 'rgba(230, 181, 48, 0.1)',
  cyanLight: 'rgba(20, 184, 212, 0.1)',
  royalLight: 'rgba(11, 114, 185, 0.1)',
};

// app/utils/typography.js
export const typography = {
  fonts: {
    display: 'Fraunces',
    body: 'Manrope',
  },

  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 40,
  },

  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
};

// app/utils/spacing.js
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  16: 64,
};

// app/utils/shadows.js
export const shadows = {
  sm: {
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  md: {
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  lg: {
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
};

// app/utils/borderRadius.js
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 999,
};

// theme
export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,

  // Component-level defaults
  button: {
    height: 48,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },

  card: {
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    ...shadows.md,
  },

  input: {
    height: 48,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    fontSize: typography.sizes.md,
  },
};

export default theme;
