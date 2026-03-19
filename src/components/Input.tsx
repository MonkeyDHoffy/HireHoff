import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';

// --- Types ---

interface InputProps extends Omit<RNTextInputProps, 'style'> {
  /** Label displayed above the input */
  label?: string;
  /** Helper text or error message below the input */
  helperText?: string;
  /** Marks input as having an error */
  error?: boolean;
  /** Additional container styles */
  style?: ViewStyle;
}

// --- Component ---

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error = false,
  style,
  ...textInputProps
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        {...textInputProps}
        onFocus={(e) => {
          setFocused(true);
          textInputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          textInputProps.onBlur?.(e);
        }}
        placeholderTextColor={colors.textLight}
        style={[
          styles.input,
          focused && styles.focused,
          error && styles.error,
        ]}
      />
      {helperText && (
        <Text style={[styles.helper, error && styles.helperError]}>
          {helperText}
        </Text>
      )}
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  focused: {
    borderColor: colors.borderFocused,
  },
  error: {
    borderColor: colors.error,
  },
  helper: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  helperError: {
    color: colors.error,
  },
});
