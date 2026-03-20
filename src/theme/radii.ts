/**
 * ApplyHoff Border Radius Tokens
 *
 * Soft, organic curves — never harsh geometric edges.
 */

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radii;
