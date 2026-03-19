import React from 'react';
import { Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

// --- Types ---

interface SectionTitleProps {
  /** Section heading text */
  title: string;
  /** Additional styles */
  style?: ViewStyle;
}

// --- Component ---

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, style }) => (
  <Text style={[styles.title, style]}>{title}</Text>
);

// --- Styles ---

const styles = StyleSheet.create({
  title: {
    ...typography.heading3,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
});
