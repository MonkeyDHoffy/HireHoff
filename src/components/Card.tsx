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
  onLongPress?: () => void;
  glowColor?: string | null;
}

// --- Component ---

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 'sm',
  noPadding = false,
  accentColor,
  onPress,
  onLongPress,
  glowColor = null,
}) => {
  const c = useTheme((s) => s.colors);
  const scale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(glowColor ? 1 : 0)).current;

  // Animate glow when glowColor changes
  React.useEffect(() => {
    if (glowColor) {
      glowOpacity.setValue(1);
      Animated.timing(glowOpacity, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: false,
      }).start();
    }
  }, [glowColor, glowOpacity]);

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

  const glowBorderColor = glowColor
    ? glowOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [c.border, glowColor],
      })
    : undefined;

  const cardContent = (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: c.surface, borderColor: glowBorderColor ?? c.border },
        shadows[elevation],
        noPadding && styles.noPadding,
        accentColor ? { borderLeftWidth: 3, borderLeftColor: accentColor } : undefined,
        (onPress || onLongPress) ? { transform: [{ scale }] } : undefined,
        glowColor ? { borderWidth: 2 } : undefined,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (onPress || onLongPress) {
    return (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        delayLongPress={500}
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
