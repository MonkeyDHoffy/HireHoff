import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';

// --- Types ---

interface StatusPillProps {
  /** Status label */
  label: string;
  /** Dot color — pass a color token value */
  color?: string;
  /** Additional container styles */
  style?: ViewStyle;
}

// --- Component ---

export const StatusPill: React.FC<StatusPillProps> = ({
  label,
  color = colors.primary,
  style,
}) => (
  <View style={[styles.pill, style]}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <Text style={styles.label}>{label}</Text>
  </View>
);

// --- Styles ---

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
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
    color: colors.text,
  },
});
