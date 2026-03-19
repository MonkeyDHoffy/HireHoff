/**
 * ApplyHoff Color Tokens
 *
 * Warm, modern palette built around beige, sand, and soft orange tones.
 * All color values used in the app should reference these tokens.
 */

export const colors = {
  // --- Backgrounds ---
  background: '#FFF8F0',       // warm cream — main app background
  surface: '#FFF1E6',          // light beige — cards, panels
  surfaceAlt: '#FFE8D6',       // deeper beige — secondary surfaces, hover states

  // --- Primary (orange family) ---
  primary: '#E07A3A',          // warm orange — buttons, active states
  primaryLight: '#F4A261',     // soft orange — highlights, accents
  primaryDark: '#C65D1A',      // terracotta — pressed states, emphasis

  // --- Accent ---
  accent: '#D4956A',           // sandy terracotta — tags, badges, subtle highlights

  // --- Text ---
  text: '#3D2C1E',             // warm dark brown — primary text
  textSecondary: '#7A6552',    // medium brown — secondary/helper text
  textLight: '#A08B76',        // light brown — placeholders, disabled text
  textOnPrimary: '#FFFFFF',    // white text on primary-colored backgrounds

  // --- Borders ---
  border: '#E8D5C4',           // beige border — cards, inputs
  borderFocused: '#E07A3A',    // orange border — focused inputs

  // --- Semantic ---
  success: '#6B9F72',          // warm green
  warning: '#E6A63C',          // amber
  error: '#C94C4C',            // warm red
  info: '#5B8FA8',             // muted teal-blue

  // --- Utility ---
  white: '#FFFFFF',
  black: '#1A1A1A',
  transparent: 'transparent',
  overlay: 'rgba(61, 44, 30, 0.4)',  // warm dark overlay
} as const;

export type ColorToken = keyof typeof colors;
