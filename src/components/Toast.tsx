/**
 * ApplyHoff — Toast Component
 *
 * Animated notification banner displayed at the top of the screen.
 * Controlled by the global toast store.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';
import { useToast, ToastVariant } from '../store/toast';

const VARIANT_COLORS: Record<ToastVariant, { bg: string; text: string }> = {
  success: { bg: '#2E7D32', text: '#FFFFFF' },
  error: { bg: '#C62828', text: '#FFFFFF' },
  info: { bg: colors.primary, text: '#FFFFFF' },
};

export const Toast: React.FC = () => {
  const { visible, message, variant, hide } = useToast();
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : -100,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [visible, translateY]);

  const variantStyle = VARIANT_COLORS[variant];

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
    alignItems: 'center',
  },
  text: {
    ...typography.label,
    textAlign: 'center',
  },
});
