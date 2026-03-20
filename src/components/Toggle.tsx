import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';
import { useTheme } from '../store/theme';

// --- Types ---

interface ToggleProps {
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  style?: ViewStyle;
}

// --- Component ---

export const Toggle: React.FC<ToggleProps> = ({
  label,
  value,
  onToggle,
  style,
}) => {
  const c = useTheme((s) => s.colors);

  return (
    <Pressable
      onPress={() => onToggle(!value)}
      style={[styles.container, style]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Text style={[styles.label, { color: c.text }]}>{label}</Text>
      <View style={[styles.track, { backgroundColor: c.border }, value && { backgroundColor: c.primary }]}>
        <View style={[styles.thumb, { backgroundColor: c.white }, value && styles.thumbActive]} />
      </View>
    </Pressable>
  );
};

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
    flex: 1,
  },
  track: {
    width: 48,
    height: 28,
    borderRadius: radii.full,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  thumbActive: {
    alignSelf: 'flex-end',
  },
});
