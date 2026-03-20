import React, { useEffect, useRef } from 'react';
import { Animated, Text, Pressable, StyleSheet } from 'react-native';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';
import { useToast, ToastVariant } from '../store/toast';
import { useTheme } from '../store/theme';

export const Toast: React.FC = () => {
  const { visible, message, variant, hide, undoAction, undo } = useToast();
  const c = useTheme((s) => s.colors);
  const translateY = useRef(new Animated.Value(-100)).current;

  const variantColors: Record<ToastVariant, { bg: string; text: string }> = {
    success: { bg: c.success, text: '#FFFFFF' },
    error: { bg: c.error, text: '#FFFFFF' },
    info: { bg: c.primary, text: '#FFFFFF' },
  };

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : -100,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [visible, translateY]);

  const variantStyle = variantColors[variant];

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: variantStyle.bg, transform: [{ translateY }] },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Pressable onPress={hide} style={styles.inner}>
        <Text style={[styles.text, { color: variantStyle.text }]}>
          {message}
        </Text>
        {undoAction && (
          <Pressable onPress={undo} hitSlop={8}>
            <Text style={styles.undoText}>Undo</Text>
          </Pressable>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingTop: 50,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomLeftRadius: radii.md,
    borderBottomRightRadius: radii.md,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  text: {
    ...typography.label,
    textAlign: 'center',
  },
  undoText: {
    ...typography.label,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
});
