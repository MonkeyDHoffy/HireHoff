import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '../theme/spacing';
import { radii } from '../theme/radii';
import { shadows } from '../theme/shadows';
import { useTheme } from '../store/theme';

// --- Types ---

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  noPadding?: boolean;
  accentColor?: string;
}

// --- Component ---

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 'sm',
  noPadding = false,
  accentColor,
}) => {
  const c = useTheme((s) => s.colors);
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: c.surface, borderColor: c.border },
        shadows[elevation],
        noPadding && styles.noPadding,
        accentColor ? { borderLeftWidth: 3, borderLeftColor: accentColor } : undefined,
        style,
      ]}
    >
      {children}
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
  },
  noPadding: {
    padding: 0,
  },
});
