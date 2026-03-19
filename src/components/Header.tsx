import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

// --- Types ---

interface HeaderProps {
  /** Screen title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Element rendered on the left (e.g. back button) */
  left?: React.ReactNode;
  /** Element rendered on the right (e.g. action icon) */
  right?: React.ReactNode;
  /** Additional container styles */
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

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }, style]}>
      <View style={styles.row}>
        <View style={styles.side}>{left}</View>
        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
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
    backgroundColor: colors.background,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
