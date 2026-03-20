import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { spacing } from '../theme/spacing';
import { radii } from '../theme/radii';
import { typography } from '../theme/typography';
import { useTheme } from '../store/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftLabel?: string;
  rightLabel?: string;
  leftColor?: string;
  rightColor?: string;
  enabled?: boolean;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftLabel = '🗑️',
  rightLabel = '✏️',
  leftColor,
  rightColor,
  enabled = true,
}) => {
  const c = useTheme((s) => s.colors);
  const translateX = useRef(new Animated.Value(0)).current;

  const resetPosition = useCallback(() => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [translateX]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        enabled && Math.abs(gesture.dx) > 10 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderMove: (_, gesture) => {
        translateX.setValue(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -SWIPE_THRESHOLD && onSwipeLeft) {
          Animated.timing(translateX, {
            toValue: -SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onSwipeLeft();
            translateX.setValue(0);
          });
        } else if (gesture.dx > SWIPE_THRESHOLD && onSwipeRight) {
          Animated.timing(translateX, {
            toValue: SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onSwipeRight();
            translateX.setValue(0);
          });
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const leftBg = leftColor ?? c.error;
  const rightBg = rightColor ?? c.primary;

  const leftOpacity = translateX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const rightOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (!enabled || Platform.OS === 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {/* Left action (swipe right to reveal) */}
      <Animated.View style={[styles.action, styles.actionRight, { backgroundColor: rightBg, opacity: rightOpacity }]}>
        <Text style={styles.actionLabel}>{rightLabel}</Text>
      </Animated.View>
      {/* Right action (swipe left to reveal) */}
      <Animated.View style={[styles.action, styles.actionLeft, { backgroundColor: leftBg, opacity: leftOpacity }]}>
        <Text style={styles.actionLabel}>{leftLabel}</Text>
      </Animated.View>
      {/* Card content */}
      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  action: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
  },
  actionLeft: {
    right: 0,
    alignItems: 'flex-end',
    left: 60,
  },
  actionRight: {
    left: 0,
    alignItems: 'flex-start',
    right: 60,
  },
  actionLabel: {
    ...typography.heading2,
    color: '#FFFFFF',
    fontSize: 24,
  },
});
