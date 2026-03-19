import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { radii } from '../theme/radii';

// --- Types ---

type SurfaceVariant = 'default' | 'alt' | 'transparent';

interface SurfaceProps {
  /** Content */
  children: React.ReactNode;
  /** Background variant */
  variant?: SurfaceVariant;
  /** Additional container styles */
  style?: ViewStyle;
  /** Remove default padding */
  noPadding?: boolean;
}

// --- Component ---

export const Surface: React.FC<SurfaceProps> = ({
  children,
  variant = 'default',
  style,
  noPadding = false,
}) => (
  <View
    style={[
      styles.base,
      variantStyles[variant],
      noPadding && styles.noPadding,
      style,
    ]}
  >
    {children}
  </View>
);

// --- Styles ---

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    padding: spacing.md,
  },
  noPadding: {
    padding: 0,
  },
});

const variantStyles: Record<SurfaceVariant, ViewStyle> = {
  default: { backgroundColor: colors.surface },
  alt: { backgroundColor: colors.surfaceAlt },
  transparent: { backgroundColor: colors.transparent },
};
