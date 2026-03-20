/**
 * ApplyHoff Typography Tokens
 *
 * Plus Jakarta Sans — friendly, modern, distinctive.
 * Perfect for productivity tools: approachable yet professional.
 */

import { Platform, TextStyle } from 'react-native';

export const fontFamily = Platform.select({
  web: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
  default: 'PlusJakartaSans_400Regular',
});

const fontFamilyMedium = Platform.select({
  web: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
  default: 'PlusJakartaSans_500Medium',
});

const fontFamilySemiBold = Platform.select({
  web: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
  default: 'PlusJakartaSans_600SemiBold',
});

const fontFamilyBold = Platform.select({
  web: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
  default: 'PlusJakartaSans_700Bold',
});

export const typography = {
  heading1: {
    fontFamily: fontFamilyBold,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.5,
  } as TextStyle,

  heading2: {
    fontFamily: fontFamilySemiBold,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.3,
  } as TextStyle,

  heading3: {
    fontFamily: fontFamilySemiBold,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: -0.2,
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
    letterSpacing: 0.2,
  } as TextStyle,

  label: {
    fontFamily: fontFamilyMedium,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  } as TextStyle,

  button: {
    fontFamily: fontFamilySemiBold,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,
} as const;

export type TypographyToken = keyof typeof typography;
