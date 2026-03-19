/**
 * ApplyHoff Border Radius Tokens
 */

export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radii;
