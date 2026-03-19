/**
 * ApplyHoff Typography Tokens
 *
 * Font sizes, weights, and line heights for consistent text rendering.
 * Uses system fonts — no custom font loading required for MVP.
 */

import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  web: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  default: undefined, // uses system default on native
});

export const typography = {
  heading1: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  } as TextStyle,

  heading2: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  } as TextStyle,

  heading3: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  } as TextStyle,

  body: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,

  bodySmall: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,

  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  } as TextStyle,

  label: {
    fontFamily,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  } as TextStyle,

  button: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  } as TextStyle,
} as const;

export type TypographyToken = keyof typeof typography;
