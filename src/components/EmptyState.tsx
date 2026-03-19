import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

// --- Types ---

interface EmptyStateProps {
  /** Main message */
  title: string;
  /** Optional descriptive text */
  description?: string;
  /** Optional action element (e.g. a Button) */
  action?: React.ReactNode;
  /** Additional container styles */
  style?: ViewStyle;
}

// --- Component ---

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  style,
}) => (
  <View style={[styles.container, style]}>
    <Text style={styles.title}>{title}</Text>
    {description && <Text style={styles.description}>{description}</Text>}
    {action && <View style={styles.action}>{action}</View>}
  </View>
);

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.heading3,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.lg,
  },
});
