import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';

// --- Types ---

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  /** Label displayed above the select */
  label?: string;
  /** Currently selected value */
  value: string;
  /** List of options */
  options: SelectOption[];
  /** Change handler */
  onChange: (value: string) => void;
  /** Placeholder when nothing is selected */
  placeholder?: string;
  /** Additional container styles */
  style?: ViewStyle;
}

// --- Component ---

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select...',
  style,
}) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          pressed && styles.triggerPressed,
        ]}
      >
        <Text
          style={[
            styles.triggerText,
            !selectedOption && styles.placeholder,
          ]}
        >
          {selectedOption?.label ?? placeholder}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.dropdown}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.option,
                    item.value === value && styles.optionSelected,
                    pressed && styles.optionPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
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
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  triggerPressed: {
    borderColor: colors.borderFocused,
  },
  triggerText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  placeholder: {
    color: colors.textLight,
  },
  chevron: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  dropdown: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    width: '100%',
    maxHeight: 360,
    paddingVertical: spacing.sm,
  },
  option: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  optionSelected: {
    backgroundColor: colors.surfaceAlt,
  },
  optionPressed: {
    backgroundColor: colors.surface,
  },
  optionText: {
    ...typography.body,
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
