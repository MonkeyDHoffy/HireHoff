import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';
import { useTheme } from '../store/theme';

// --- Types ---

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

// --- Component ---

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  style,
}) => {
  const c = useTheme((s) => s.colors);

  const bgMap: Record<BadgeVariant, string> = {
    default: c.surfaceAlt,
    primary: c.primaryLight + '30',
    success: c.success + '20',
    warning: c.warning + '20',
    error: c.error + '20',
  };

  const textMap: Record<BadgeVariant, string> = {
    default: c.textSecondary,
    primary: c.primaryDark,
    success: c.success,
    warning: c.warning,
    error: c.error,
  };

  return (
    <View style={[styles.base, { backgroundColor: bgMap[variant] }, style]}>
      <Text style={[styles.label, { color: textMap[variant] }]}>{label}</Text>
    </View>
  );
};

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
