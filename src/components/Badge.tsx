import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';

// --- Types ---

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';

interface BadgeProps {
  /** Badge label */
  label: string;
  /** Color variant */
  variant?: BadgeVariant;
  /** Additional container styles */
  style?: ViewStyle;
}

// --- Component ---

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  style,
}) => (
  <View style={[styles.base, variantStyles[variant], style]}>
    <Text style={[styles.label, variantTextStyles[variant]]}>{label}</Text>
  </View>
);

// --- Styles ---

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs - 1,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.full,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
  },
});

const variantStyles: Record<BadgeVariant, ViewStyle> = {
  default: { backgroundColor: colors.surfaceAlt },
  primary: { backgroundColor: colors.primaryLight + '30' },
  success: { backgroundColor: colors.success + '25' },
  warning: { backgroundColor: colors.warning + '25' },
  error: { backgroundColor: colors.error + '25' },
};

const variantTextStyles: Record<BadgeVariant, TextStyle> = {
  default: { color: colors.textSecondary },
  primary: { color: colors.primaryDark },
  success: { color: '#3D6B42' },
  warning: { color: '#8B6914' },
  error: { color: '#8B2A2A' },
};
