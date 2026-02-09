/**
 * University of Michigan Brand Identity Design System
 * Based on official U-M Style Guide (February 2025)
 *
 * All colors, typography, and spacing follow official brand guidelines
 * and meet WCAG 2.1 AA accessibility standards.
 */

// ============================================
// COLORS - Official U-M Brand Palette
// ============================================

export const COLORS = {
  // Primary Colors (Official U-M)
  maize: '#FFCB05',      // PMS 7406 - Primary accent, CTAs, highlights
  blue: '#00274C',       // PMS 282 - Primary brand color

  // Secondary Palette (Official U-M)
  tappanRed: '#9A3324',
  rossOrange: '#D86018',
  waveFieldGreen: '#A5A508',
  taubmanTeal: '#00B2A9',
  arboretumBlue: '#2F65A7',
  a2Amethyst: '#702082',
  matthaeiViolet: '#575294',
  angellHallAsh: '#989C97',

  // Semantic Colors
  primary: '#00274C',    // Michigan Blue
  secondary: '#FFCB05',  // Maize

  // Background & Surface (Dark mode optimized)
  background: '#00274C', // Michigan Blue as primary background
  surface: 'rgba(255, 255, 255, 0.05)', // Subtle card surface
  surfaceElevated: 'rgba(255, 255, 255, 0.08)', // Elevated cards

  // Text Colors (WCAG AA compliant on dark backgrounds)
  text: '#FFFFFF',              // Primary text - 15.75:1 contrast ratio on blue
  textSecondary: '#B8B8B8',     // Secondary text - 7.5:1 contrast ratio on blue
  textTertiary: '#A0A0A0',      // Tertiary text - 5.2:1 contrast ratio on blue (improved)

  // Borders & Dividers
  border: 'rgba(255, 255, 255, 0.1)',
  divider: 'rgba(255, 255, 255, 0.08)',

  // Status Colors (WCAG compliant)
  success: '#38A169',
  warning: '#D86018',  // Using Ross Orange
  error: '#9A3324',    // Using Tappan Red
  info: '#2F65A7',     // Using Arboretum Blue

  // Overlay & Effects
  overlay: 'rgba(0, 0, 0, 0.6)',
  blur: 'rgba(255, 255, 255, 0.08)', // For glassmorphic effects
};

// ============================================
// TYPOGRAPHY - Official U-M Recommendations
// ============================================

/**
 * Recommended font families:
 * - IBM Plex (sans-serif, versatile)
 * - Montserrat (sans-serif, clean)
 * - Nunito Sans (sans-serif, friendly)
 * - Atkinson Hyperlegible (accessibility-first)
 *
 * All available free from Google Fonts
 */

export const TYPOGRAPHY = {
  // Font Families
  fontFamily: {
    primary: 'AtkinsonHyperlegible_400Regular',
    heading: 'Montserrat_700Bold',
    body: 'AtkinsonHyperlegible_400Regular',
    mono: 'Courier',             // Monospace for data/codes
  },

  // Font Sizes (accessibility-compliant scale)
  fontSize: {
    xs: 10,   // Captions, footnotes (minimum for legibility)
    sm: 12,   // Secondary labels
    base: 14, // Body text minimum (per U-M guidelines)
    md: 16,   // Comfortable reading size
    lg: 18,   // Large body text
    xl: 22,   // Section headings
    xxl: 28,  // Screen titles
    xxxl: 34, // Hero text
    display: 48, // Feature numbers/stats
  },

  // Font Weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Line Heights (125% minimum per U-M accessibility guidelines)
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },
};

// ============================================
// SPACING - 8pt Grid System
// ============================================

export const SPACING = {
  xxs: 2,
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// ============================================
// BORDER RADIUS - Consistent Corner Rounding
// ============================================

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// ============================================
// SHADOWS - Depth & Elevation
// ============================================

export const SHADOWS = {
  // Subtle shadow for cards on dark backgrounds
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },

  // Default card shadow
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Elevated components (modals, floating buttons)
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },

  // Maximum elevation (hero cards, overlays)
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
};

// ============================================
// CHROME - Shared Visual Surface System
// ============================================

export const CHROME = {
  background: {
    gradient: ['#01060F', '#022349', '#00162D'],
    overlayTop: ['rgba(47,101,167,0.28)', 'transparent'],
    overlayBottom: ['transparent', 'rgba(0,0,0,0.42)'],
  },
  surface: {
    base: 'rgba(7, 16, 33, 0.62)',
    elevated: 'rgba(10, 20, 40, 0.78)',
    border: 'rgba(255, 255, 255, 0.16)',
    borderSoft: 'rgba(255, 255, 255, 0.10)',
    highlight: 'rgba(255, 203, 5, 0.16)',
  },
  dock: {
    background: 'rgba(8, 14, 28, 0.72)',
    border: 'rgba(255, 255, 255, 0.18)',
  },
};

// ============================================
// ACCESSIBILITY - WCAG 2.1 AA Compliance
// ============================================

/**
 * Contrast Ratios:
 * - Large text (18pt+): 3:1 minimum
 * - Normal text (12-18pt): 4.5:1 minimum
 * - Non-text elements: 3:1 minimum
 *
 * Touch Targets:
 * - Minimum size: 44x44 points (iOS HIG)
 * - Recommended: 48x48 dp (Material Design)
 */

export const ACCESSIBILITY = {
  // Minimum touch target sizes
  touchTarget: {
    min: 44,
    recommended: 48,
  },

  // Text size minimums per U-M guidelines
  textSize: {
    body: 14,      // Equivalent to 12pt Arial (U-M standard)
    footnote: 10,  // Minimum 8pt per U-M guidelines
  },

  // Leading (line spacing) - 20-25% greater than font size
  leading: (fontSize) => fontSize * 1.25,
};

// ============================================
// LAYOUT - Safe Areas & Containers
// ============================================

export const LAYOUT = {
  // Container widths
  containerPadding: SPACING.m,
  maxWidth: 1200,

  // Screen breakpoints (for responsive design)
  breakpoints: {
    sm: 375,  // iPhone SE
    md: 414,  // iPhone Pro
    lg: 768,  // iPad
    xl: 1024, // iPad Pro
  },

  // Tab bar
  tabBar: {
    height: 85,
    paddingTop: 10,
  },
};
