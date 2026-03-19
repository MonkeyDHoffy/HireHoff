import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';
import { shadows } from '../theme/shadows';
import { useI18n } from '../i18n';

// --- Types ---

interface MenuItem {
  /** Display label */
  label: string;
  /** Route to navigate to */
  route: string;
  /** Optional icon element */
  icon?: React.ReactNode;
}

interface BurgerMenuProps {
  /** Menu items to display */
  items: MenuItem[];
}

// --- Burger Icon (3 horizontal lines) ---

function BurgerIcon() {
  return (
    <View style={iconStyles.container}>
      <View style={iconStyles.line} />
      <View style={iconStyles.line} />
      <View style={iconStyles.line} />
    </View>
  );
}

const iconStyles = StyleSheet.create({
  container: {
    width: 22,
    height: 18,
    justifyContent: 'space-between',
  },
  line: {
    width: 22,
    height: 2.5,
    backgroundColor: colors.text,
    borderRadius: 2,
  },
});

// --- Component ---

export const BurgerMenu: React.FC<BurgerMenuProps> = ({ items }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useI18n((s) => s.t);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-250)).current;

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [open, fadeAnim, slideAnim]);

  const close = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setOpen(false));
  };

  const handleNavigate = (route: string) => {
    close();
    // Small delay so the menu closes before navigating
    setTimeout(() => {
      router.push(route as never);
    }, 180);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={t.nav.openMenu}
        style={styles.trigger}
      >
        <BurgerIcon />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={close}
      >
        {/* Overlay */}
        <Pressable style={styles.overlay} onPress={close}>
          <Animated.View style={[styles.overlayBg, { opacity: fadeAnim }]} />
        </Pressable>

        {/* Drawer panel */}
        <Animated.View
          style={[
            styles.drawer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <Text style={styles.drawerTitle}>{t.nav.menu}</Text>

          {items.map((item) => (
            <Pressable
              key={item.route}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => handleNavigate(item.route)}
            >
              {item.icon && <View style={styles.menuIcon}>{item.icon}</View>}
              <Text style={styles.menuLabel}>{item.label}</Text>
            </Pressable>
          ))}

          <Pressable style={styles.closeBtn} onPress={close}>
            <Text style={styles.closeBtnText}>{t.nav.close}</Text>
          </Pressable>
        </Animated.View>
      </Modal>
    </>
  );
};

// --- Styles ---

const { height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  trigger: {
    padding: spacing.xs,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 280,
    height: screenHeight,
    backgroundColor: colors.background,
    paddingTop: spacing.xxl + spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    ...shadows.lg,
  },
  drawerTitle: {
    ...typography.heading2,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    marginBottom: spacing.xs,
  },
  menuItemPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  menuIcon: {
    marginRight: spacing.md,
  },
  menuLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  closeBtn: {
    marginTop: spacing.xl,
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  closeBtnText: {
    ...typography.label,
    color: colors.textSecondary,
  },
});
