import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { initDatabase } from '../src/db';
import { useApplicationStore } from '../src/store';
import { useI18n } from '../src/i18n';
import { Toast } from '../src/components/Toast';
import { useTheme } from '../src/store/theme';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const hydrateApps = useApplicationStore((s) => s.hydrate);
  const hydrateI18n = useI18n((s) => s.hydrate);
  const c = useTheme((s) => s.colors);
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    async function boot() {
      await initDatabase();
      await Promise.all([hydrateApps(), hydrateI18n()]);
      setReady(true);
    }
    boot();
  }, []);

  if (!ready || !fontsLoaded) {
    return (
      <View style={[styles.loading, { backgroundColor: c.background }]}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: c.background },
          animation: 'fade_from_bottom',
          animationDuration: 200,
        }}
      />
      <Toast />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
