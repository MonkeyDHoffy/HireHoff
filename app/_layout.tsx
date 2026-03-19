import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme/colors';
import { initDatabase } from '../src/db';
import { useApplicationStore } from '../src/store';
import { useI18n } from '../src/i18n';
import { Toast } from '../src/components/Toast';

/**
 * Root layout — wraps the entire app.
 * Initialises SQLite, hydrates stores, then renders the app.
 */
export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const hydrateApps = useApplicationStore((s) => s.hydrate);
  const hydrateI18n = useI18n((s) => s.hydrate);

  useEffect(() => {
    async function boot() {
      await initDatabase();
      await Promise.all([hydrateApps(), hydrateI18n()]);
      setReady(true);
    }
    boot();
  }, []);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
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
    backgroundColor: colors.background,
  },
});
