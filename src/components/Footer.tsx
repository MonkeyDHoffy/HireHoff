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
        { paddingBottom: insets.bottom + spacing.sm, backgroundColor: c.background },
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
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  brand: {
    ...typography.caption,
  },
});
