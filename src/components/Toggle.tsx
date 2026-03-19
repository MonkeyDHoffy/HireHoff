import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';

// --- Types ---

interface ToggleProps {
  /** Label displayed next to the toggle */
  label: string;
  /** Current value */
  value: boolean;
  /** Change handler */
  onToggle: (value: boolean) => void;
  /** Additional container styles */
  style?: ViewStyle;
}

// --- Component ---

export const Toggle: React.FC<ToggleProps> = ({
  label,
  value,
  onToggle,
  style,
}) => (
  <Pressable
    onPress={() => onToggle(!value)}
    style={[styles.container, style]}
    accessibilityRole="switch"
    accessibilityState={{ checked: value }}
  >
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.track, value && styles.trackActive]}>
      <View style={[styles.thumb, value && styles.thumbActive]} />
    </View>
  </Pressable>
);

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  track: {
    width: 48,
    height: 28,
    borderRadius: radii.full,
    backgroundColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  trackActive: {
    backgroundColor: colors.primary,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  thumbActive: {
    alignSelf: 'flex-end',
  },
});
