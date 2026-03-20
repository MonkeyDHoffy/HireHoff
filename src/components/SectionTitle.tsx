import React from 'react';
import { Text, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useTheme } from '../store/theme';

// --- Types ---

interface SectionTitleProps {
  title: string;
  style?: ViewStyle;
}

// --- Component ---

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, style }) => {
  const c = useTheme((s) => s.colors);
  return <Text style={[styles.title, { color: c.text }, style]}>{title}</Text>;
};

// --- Styles ---

const styles = StyleSheet.create({
  title: {
    ...typography.heading3,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
});
