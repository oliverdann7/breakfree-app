// Branding design tokens and constants for BreakFree
export const BRANDING = {
  colors: {
    primary: {
      blue: '#0072B0',
      gold: '#C9961A',
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
  typography: {
    display: {
      family: 'BaskervilleDisplayPT-Regular',
      size: 93.8,
      weight: '800',
    },
    heading: {
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
      weight: '700',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    full: 999,
  },
};

export const LOGO_VARIANTS = {
  // Full horizontal logo with text
  FULL: 'full',
  // Just the symbol/mark
  SYMBOL: 'symbol',
  // Text only versions
  TEXT_BREAK: 'text-break',
  TEXT_FREE: 'text-free',
};

export const LOGO_SIZES = {
  SMALL: 'small',     // 80px
  MEDIUM: 'medium',   // 120px
  LARGE: 'large',     // 180px
  XLARGE: 'xlarge',   // 240px
};
