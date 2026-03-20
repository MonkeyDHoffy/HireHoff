import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '../theme/spacing';
import { radii } from '../theme/radii';
import { useTheme } from '../store/theme';

// --- Types ---

type SurfaceVariant = 'default' | 'alt' | 'transparent';

interface SurfaceProps {
  children: React.ReactNode;
  variant?: SurfaceVariant;
  style?: ViewStyle;
  noPadding?: boolean;
}

// --- Component ---

export const Surface: React.FC<SurfaceProps> = ({
  children,
  variant = 'default',
  style,
  noPadding = false,
}) => {
  const c = useTheme((s) => s.colors);

  const bgMap: Record<SurfaceVariant, string> = {
    default: c.surface,
    alt: c.surfaceAlt,
    transparent: c.transparent,
  };

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: bgMap[variant] },
        noPadding && styles.noPadding,
        style,
      ]}
    >
      {children}
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    padding: spacing.md,
  },
  noPadding: {
    padding: 0,
  },
});
