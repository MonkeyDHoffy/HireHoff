import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
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
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.accent, { backgroundColor: c.primary }]} />
      <Text style={[styles.title, { color: c.text }]}>{title}</Text>
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  accent: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.heading3,
  },
});
