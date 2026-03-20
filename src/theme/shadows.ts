/**
 * ApplyHoff Shadow Tokens
 *
 * Layered, warm shadows that create depth without heaviness.
 * Platform-aware: uses shadow* on iOS, elevation on Android, boxShadow on web.
 */

import { Platform, ViewStyle } from 'react-native';

const SHADOW_COLOR = '#2C1810';

const createShadow = (
  offsetY: number,
  blurRadius: number,
  opacity: number,
  elevation: number,
): ViewStyle => ({
  ...Platform.select({
    ios: {
      shadowColor: SHADOW_COLOR,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: blurRadius,
    },
    android: {
      elevation,
    },
    web: {
      // @ts-expect-error — boxShadow is valid on web but not typed in ViewStyle
      boxShadow: `0px ${offsetY}px ${blurRadius}px rgba(44, 24, 16, ${opacity})`,
    },
  }),
});

export const shadows = {
  none: {} as ViewStyle,
  sm: createShadow(1, 4, 0.08, 2),
  md: createShadow(3, 12, 0.12, 4),
  lg: createShadow(6, 20, 0.14, 8),
  xl: createShadow(10, 30, 0.16, 12),
} as const;

export type ShadowToken = keyof typeof shadows;
