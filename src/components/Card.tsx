import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { radii } from '../theme/radii';
import { shadows } from '../theme/shadows';

// --- Types ---

interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Additional container styles */
  style?: ViewStyle;
  /** Elevation level */
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  /** Remove default padding */
  noPadding?: boolean;
}

// --- Component ---

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 'sm',
  noPadding = false,
}) => (
  <View
    style={[
      styles.card,
      shadows[elevation],
      noPadding && styles.noPadding,
      style,
    ]}
  >
    {children}
  </View>
);

// --- Styles ---

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noPadding: {
    padding: 0,
  },
});
