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
  sm: createShadow(1, 2, 0.06, 1),
  md: createShadow(2, 8, 0.08, 3),
  lg: createShadow(4, 16, 0.1, 6),
  xl: createShadow(8, 24, 0.12, 10),
} as const;

export type ShadowToken = keyof typeof shadows;
