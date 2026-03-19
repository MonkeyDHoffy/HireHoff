import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useTheme } from '../store/theme';

// --- Types ---

interface FooterProps {
  /** Footer content — if not provided, shows a simple branding line */
  children?: React.ReactNode;
  /** Additional container styles */
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
        { paddingBottom: insets.bottom + spacing.sm, backgroundColor: c.background, borderTopColor: c.border },
        style,
      ]}
    >
      {children ?? <Text style={[styles.brand, { color: c.textLight }]}>ApplyHoff</Text>}
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  brand: {
    ...typography.caption,
    color: colors.textLight,
  },
});
