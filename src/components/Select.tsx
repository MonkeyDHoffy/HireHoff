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
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';
import { shadows } from '../theme/shadows';
import { useTheme } from '../store/theme';

// --- Types ---

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
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
  const c = useTheme((s) => s.colors);
  const selectedOption = options.find((o) => o.value === value);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: c.text }]}>{label}</Text>}

      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          { backgroundColor: c.surface, borderColor: c.border },
          pressed && { borderColor: c.borderFocused },
        ]}
      >
        <Text
          style={[
            styles.triggerText,
            { color: c.text },
            !selectedOption && { color: c.textLight },
          ]}
        >
          {selectedOption?.label ?? placeholder}
        </Text>
        <Text style={[styles.chevron, { color: c.textSecondary }]}>▾</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={[styles.overlay, { backgroundColor: c.overlay }]} onPress={() => setOpen(false)}>
          <View style={[styles.dropdown, { backgroundColor: c.surface }, shadows.lg]}>
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
                    item.value === value && { backgroundColor: c.surfaceAlt },
                    pressed && { backgroundColor: c.surfaceAlt },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: c.text },
                      item.value === value && { color: c.primary, fontWeight: '600' },
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
    marginBottom: spacing.xs,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderRadius: radii.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  triggerText: {
    ...typography.body,
    flex: 1,
  },
  chevron: {
    ...typography.body,
    marginLeft: spacing.sm,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  dropdown: {
    borderRadius: radii.lg,
    width: '100%',
    maxHeight: 360,
    paddingVertical: spacing.sm,
  },
  option: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  optionText: {
    ...typography.body,
  },
});
