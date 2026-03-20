import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useTheme } from '../store/theme';

// --- Types ---

interface FooterProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

// --- Component ---

export const Footer: React.FC<FooterProps> = ({ children, style }) => {
  const insets = useSafeAreaInsets();
  const c = useTheme((s) => s.colors);

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom + spacing.sm, backgroundColor: c.surface, borderTopColor: c.border },
        style,
      ]}
    >
      {children ?? (
        <View style={styles.brandRow}>
          <View style={[styles.brandDot, { backgroundColor: c.primary }]} />
          <Text style={[styles.brand, { color: c.textSecondary }]}>ApplyHoff</Text>
        </View>
      )}
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  brand: {
    ...typography.caption,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
