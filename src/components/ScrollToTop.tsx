import React, { useRef, useCallback } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { spacing } from '../theme/spacing';
import { radii } from '../theme/radii';
import { shadows } from '../theme/shadows';
import { useTheme } from '../store/theme';

interface ScrollToTopProps {
  visible: boolean;
  onPress: () => void;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({ visible, onPress }) => {
  const c = useTheme((s) => s.colors);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(opacity, {
        toValue: visible ? 1 : 0,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.spring(scale, {
        toValue: visible ? 1 : 0.5,
        useNativeDriver: true,
        friction: 8,
      }),
    ]).start();
  }, [visible, opacity, scale]);

  return (
    <Animated.View
      style={[
        styles.fab,
        { backgroundColor: c.surface, borderColor: c.border, opacity, transform: [{ scale }] },
        shadows.md,
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Pressable onPress={onPress} style={styles.inner} hitSlop={8}>
        <Animated.Text style={[styles.arrow, { color: c.primary }]}>↑</Animated.Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 80,
    right: spacing.md,
    width: 44,
    height: 44,
    borderRadius: radii.full,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  inner: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 20,
    fontWeight: '700',
  },
});
