/**
 * ApplyHoff Color Tokens
 *
 * Refined warm palette: sand, amber, terracotta with golden accents.
 * Intentionally layered backgrounds create depth without borders.
 */

export const lightColors = {
  // --- Backgrounds (layered warmth) ---
  background: '#FAF6F1',       // warm linen — main canvas
  surface: '#FFFFFF',          // clean white — cards, elevated panels
  surfaceAlt: '#F2EBE3',      // warm sand — secondary surfaces, chips

  // --- Primary (refined amber-terracotta) ---
  primary: '#C2713A',          // burnt sienna — buttons, active states
  primaryLight: '#E8985C',     // warm amber — highlights, glows
  primaryDark: '#9E5527',      // deep terracotta — pressed, emphasis

  // --- Accent ---
  accent: '#D4A574',           // golden sand — tags, subtle highlights

  // --- Text (high contrast, warm base) ---
  text: '#2C1810',             // deep espresso — primary text (7:1+ contrast)
  textSecondary: '#6B5744',    // walnut — secondary/helper text (4.5:1+)
  textLight: '#9C8B7A',        // driftwood — placeholders, captions
  textOnPrimary: '#FFFFFF',    // white on primary

  // --- Borders (subtle, refined) ---
  border: '#E6DDD3',           // pale sand — light separation
  borderFocused: '#C2713A',    // primary — focused inputs

  // --- Semantic (warm-toned, harmonized) ---
  success: '#527A56',          // forest sage — confirms
  warning: '#C48C2C',          // warm gold — caution
  error: '#B5403A',            // clay red — errors
  info: '#4A7B8F',             // ocean slate — informational

  // --- Utility ---
  white: '#FFFFFF',
  black: '#1A1A1A',
  transparent: 'transparent',
  overlay: 'rgba(44, 24, 16, 0.45)',
} as const;

export const darkColors: typeof lightColors = {
  // --- Backgrounds (deep, warm dark) ---
  background: '#171210',       // warm charcoal
  surface: '#231C17',          // coffee — cards
  surfaceAlt: '#2E251E',      // dark walnut — secondary

  // --- Primary (amber glow in dark) ---
  primary: '#D88A50',          // warm amber glow
  primaryLight: '#E8A06A',     // soft peach
  primaryDark: '#B87040',      // deep amber

  // --- Accent ---
  accent: '#C4955C',           // golden

  // --- Text (warm light on dark) ---
  text: '#EDE5DC',             // warm ivory
  textSecondary: '#B5A290',    // sandstone
  textLight: '#7A6B5C',       // muted bark
  textOnPrimary: '#FFFFFF',

  // --- Borders ---
  border: '#36302A',           // subtle warm line
  borderFocused: '#D88A50',

  // --- Semantic (slightly brighter for dark bg) ---
  success: '#6B9E70',
  warning: '#D4A040',
  error: '#CC5B55',
  info: '#5C94AA',

  // --- Utility ---
  white: '#FFFFFF',
  black: '#1A1A1A',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.55)',
} as const;

/** Default export — light theme */
export const colors = lightColors;

export type ColorToken = keyof typeof lightColors;
