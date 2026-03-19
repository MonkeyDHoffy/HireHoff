/**
 * ApplyHoff Shadow Tokens
 *
 * Subtle, warm shadows for elevation (cards, modals, etc.).
 * Platform-aware: uses shadow* on iOS, elevation on Android, boxShadow on web.
 */

import { Platform, ViewStyle } from 'react-native';

const createShadow = (
  offsetY: number,
  blurRadius: number,
  opacity: number,
  elevation: number,
): ViewStyle => ({
  ...Platform.select({
    ios: {
      shadowColor: '#3D2C1E',
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: blurRadius,
    },
    android: {
      elevation,
    },
    web: {
      // @ts-expect-error — boxShadow is valid on web but not typed in ViewStyle
      boxShadow: `0px ${offsetY}px ${blurRadius}px rgba(61, 44, 30, ${opacity})`,
    },
  }),
});

export const shadows = {
  none: {} as ViewStyle,
  sm: createShadow(1, 3, 0.08, 1),
  md: createShadow(2, 6, 0.1, 3),
  lg: createShadow(4, 12, 0.12, 6),
} as const;

export type ShadowToken = keyof typeof shadows;
