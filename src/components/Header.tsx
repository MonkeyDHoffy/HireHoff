import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useTheme } from '../store/theme';

// --- Types ---

interface HeaderProps {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: ViewStyle;
}

// --- Component ---

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  left,
  right,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const c = useTheme((s) => s.colors);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm, backgroundColor: c.surface, borderBottomColor: c.border }, style]}>
      <View style={styles.row}>
        <View style={styles.side}>{left}</View>
        <View style={styles.center}>
          <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: c.primary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={[styles.side, styles.sideRight]}>{right}</View>
      </View>
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  side: {
    width: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    ...typography.heading3,
  },
  subtitle: {
    ...typography.caption,
    marginTop: 2,
  },
});
