import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, ViewStyle, Pressable, Animated } from 'react-native';
import { spacing } from '../theme/spacing';
import { radii } from '../theme/radii';
import { shadows } from '../theme/shadows';
import { useTheme } from '../store/theme';

// --- Types ---

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  noPadding?: boolean;
  accentColor?: string;
  onPress?: () => void;
}

// --- Component ---

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 'sm',
  noPadding = false,
  accentColor,
  onPress,
}) => {
  const c = useTheme((s) => s.colors);
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scale]);

  const cardContent = (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: c.surface, borderColor: c.border },
        shadows[elevation],
        noPadding && styles.noPadding,
        accentColor ? { borderLeftWidth: 3, borderLeftColor: accentColor } : undefined,
        onPress ? { transform: [{ scale }] } : undefined,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
};

// --- Styles ---

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
  },
  noPadding: {
    padding: 0,
  },
});
