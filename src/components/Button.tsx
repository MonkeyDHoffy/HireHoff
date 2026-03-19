import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';
import { shadows } from '../theme/shadows';

// --- Types ---

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  /** Button label */
  title: string;
  /** Press handler */
  onPress: () => void;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state — shows spinner and disables interaction */
  loading?: boolean;
  /** Optional icon element rendered before the title */
  icon?: React.ReactNode;
  /** Additional container styles */
  style?: ViewStyle;
}

// --- Component ---

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
}) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        pressed && !isDisabled && pressedStyles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.white : colors.primary}
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.label,
              variantTextStyles[variant],
              sizeTextStyles[size],
              icon ? { marginLeft: spacing.sm } : undefined,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    ...shadows.sm,
  },
  label: {
    ...typography.button,
  },
  disabled: {
    opacity: 0.5,
  },
});

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  md: { paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.lg },
  lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
};

const sizeTextStyles: Record<ButtonSize, TextStyle> = {
  sm: { fontSize: 13 },
  md: { fontSize: 16 },
  lg: { fontSize: 18 },
};

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surfaceAlt },
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: { backgroundColor: colors.transparent, ...shadows.none },
};

const variantTextStyles: Record<ButtonVariant, TextStyle> = {
  primary: { color: colors.textOnPrimary },
  secondary: { color: colors.text },
  outline: { color: colors.primary },
  ghost: { color: colors.primary },
};

const pressedStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: colors.primaryDark },
  secondary: { backgroundColor: colors.border },
  outline: { backgroundColor: colors.surfaceAlt },
  ghost: { backgroundColor: colors.surfaceAlt },
};
