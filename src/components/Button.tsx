import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../store/theme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';

// --- Types ---

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
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
  const c = useTheme((s) => s.colors);
  const isDisabled = disabled || loading;

  const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: { backgroundColor: c.primary },
    secondary: { backgroundColor: c.surfaceAlt },
    outline: { backgroundColor: c.transparent, borderWidth: 1.5, borderColor: c.primary },
    ghost: { backgroundColor: c.transparent },
  };

  const pressedVariantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: { backgroundColor: c.primaryDark, transform: [{ scale: 0.97 }] },
    secondary: { backgroundColor: c.border, transform: [{ scale: 0.97 }] },
    outline: { backgroundColor: c.surfaceAlt, transform: [{ scale: 0.97 }] },
    ghost: { backgroundColor: c.surfaceAlt, transform: [{ scale: 0.97 }] },
  };

  const variantTextStyles: Record<ButtonVariant, TextStyle> = {
    primary: { color: c.textOnPrimary },
    secondary: { color: c.text },
    outline: { color: c.primary },
    ghost: { color: c.primary },
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        pressed && !isDisabled && pressedVariantStyles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? c.white : c.primary}
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
  },
  label: {
    ...typography.button,
  },
  disabled: {
    opacity: 0.4,
  },
});

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md, borderRadius: radii.sm },
  md: { paddingVertical: spacing.sm + 4, paddingHorizontal: spacing.lg },
  lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: radii.lg },
};

const sizeTextStyles: Record<ButtonSize, TextStyle> = {
  sm: { fontSize: 13 },
  md: { fontSize: 16 },
  lg: { fontSize: 18 },
};
