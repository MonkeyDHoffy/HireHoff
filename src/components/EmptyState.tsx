import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';
import { useTheme } from '../store/theme';

// --- Types ---

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
}

// --- Component ---

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  style,
}) => {
  const c = useTheme((s) => s.colors);

  return (
    <View style={[styles.container, { borderColor: c.border }, style]}>
      <Text style={[styles.emoji]}>📋</Text>
      <Text style={[styles.title, { color: c.textSecondary }]}>{title}</Text>
      {description && <Text style={[styles.description, { color: c.textLight }]}>{description}</Text>}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: radii.lg,
  },
  emoji: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.heading3,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.lg,
  },
});
