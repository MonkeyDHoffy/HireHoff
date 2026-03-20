import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TextStyle } from 'react-native';

interface CountUpProps {
  value: number;
  duration?: number;
  style?: TextStyle;
}

/**
 * Animated counting component — smoothly counts from 0 to the target value.
 */
export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 800,
  style,
}) => {
  const [display, setDisplay] = useState(0);
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animValue.setValue(0);
    const listener = animValue.addListener(({ value: v }) => {
      setDisplay(Math.round(v));
    });

    Animated.timing(animValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();

    return () => {
      animValue.removeListener(listener);
    };
  }, [value, duration, animValue]);

  return <Text style={style}>{display}</Text>;
};
