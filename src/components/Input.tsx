import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';
import { useTheme } from '../store/theme';

// --- Types ---

interface InputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  helperText?: string;
  error?: boolean;
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
  const c = useTheme((s) => s.colors);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: c.text }]}>{label}</Text>}
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
        placeholderTextColor={c.textLight}
        style={[
          styles.input,
          { color: c.text, backgroundColor: c.surface, borderColor: c.border },
          focused && { borderColor: c.borderFocused },
          error && { borderColor: c.error },
        ]}
      />
      {helperText && (
        <Text style={[styles.helper, { color: c.textSecondary }, error && { color: c.error }]}>
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
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body,
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  helper: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
});
