import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';
import { useTheme } from '../store/theme';

// --- Types ---

interface StatusPillProps {
  label: string;
  color?: string;
  style?: ViewStyle;
}

// --- Component ---

export const StatusPill: React.FC<StatusPillProps> = ({
  label,
  color,
  style,
}) => {
  const c = useTheme((s) => s.colors);
  const dotColor = color ?? c.primary;

  return (
    <View style={[styles.pill, { backgroundColor: c.surfaceAlt }, style]}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={[styles.label, { color: c.text }]}>{label}</Text>
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radii.full,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs + 2,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
  },
});
