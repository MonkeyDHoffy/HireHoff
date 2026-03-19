import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';
import { Header } from '../src/components/Header';
import { Card } from '../src/components/Card';
import { SectionTitle } from '../src/components/SectionTitle';
import { Button } from '../src/components/Button';
import { Footer } from '../src/components/Footer';
import { Select } from '../src/components/Select';
import { useI18n, type Language } from '../src/i18n';
import { useApplicationStore } from '../src/store';
import { useToast } from '../src/store/toast';
import { applicationsToCsv, downloadCsvWeb } from '../src/utils/csv';

/**
 * Settings screen.
 * Accessible via the burger menu in the header.
 */
export default function SettingsScreen() {
  const router = useRouter();
  const t = useI18n((s) => s.t);
  const language = useI18n((s) => s.language);
  const setLanguage = useI18n((s) => s.setLanguage);
  const applications = useApplicationStore((s) => s.applications);
  const showToast = useToast((s) => s.show);

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
  ];

  return (
    <View style={styles.screen}>
      <Header
        title={t.settings.title}
        left={
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={styles.backText}>{t.nav.back}</Text>
          </Pressable>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Settings Section --- */}
        <SectionTitle title={t.settings.appInfo} />
        <Card>
          <Text style={styles.bodyText}>{t.settings.version}</Text>
          <Text style={styles.captionText}>
            {t.settings.description}
          </Text>
        </Card>

        {/* --- Language Selector --- */}
        <SectionTitle title={t.settings.language} />
        <Card>
          <Select
            label={t.settings.languageLabel}
            value={language}
            options={languageOptions}
            onChange={(v) => setLanguage(v as Language)}
          />
        </Card>

        {/* --- Component Preview Link --- */}
        <SectionTitle title={t.settings.componentPreview} />
        <Pressable onPress={() => router.push('/component-preview')}>
          <Card>
            <View style={styles.menuRow}>
              <Text style={styles.menuLabel}>{t.settings.componentPreview}</Text>
              <Text style={styles.menuArrow}>→</Text>
            </View>
          </Card>
        </Pressable>

        {/* --- CSV Export --- */}
        <SectionTitle title={t.settings.exportCsv} />
        <Card>
          <Button
            title={t.settings.exportCsv}
            variant="outline"
            onPress={() => {
              const csv = applicationsToCsv(applications);
              if (Platform.OS === 'web') {
                downloadCsvWeb(csv, 'applyhoff-export.csv');
              } else {
                // Native: copy to clipboard as fallback
                import('react-native').then(({ Clipboard }) => {
                  Clipboard?.setString?.(csv);
                });
              }
              showToast(t.settings.exportSuccess);
            }}
          />
        </Card>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      <Footer />
    </View>
  );
}

// --- Screen Styles ---

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  bodyText: {
    ...typography.body,
    color: colors.text,
  },
  captionText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  backText: {
    ...typography.label,
    color: colors.primary,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuLabel: {
    ...typography.body,
    color: colors.text,
  },
  menuArrow: {
    ...typography.body,
    color: colors.textLight,
  },
});
