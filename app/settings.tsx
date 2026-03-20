import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
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
import { useTheme, type ThemeMode } from '../src/store/theme';
import { applicationsToCsv, applicationsToDetailedText, applicationsToSimpleList, exportFile } from '../src/utils/csv';

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
  const themeMode = useTheme((s) => s.mode);
  const setThemeMode = useTheme((s) => s.setMode);
  const c = useTheme((s) => s.colors);
  const templates = useApplicationStore((s) => s.templates);
  const deleteTemplate = useApplicationStore((s) => s.deleteTemplate);

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      <Header
        title={t.settings.title}
        left={
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={[styles.backText, { color: c.primary }]}>{t.nav.back}</Text>
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
          <Text style={[styles.bodyText, { color: c.text }]}>{t.settings.version}</Text>
          <Text style={[styles.captionText, { color: c.textSecondary }]}>
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

        {/* --- Theme Toggle --- */}
        <SectionTitle title={t.settings.theme} />
        <Card>
          <Select
            label={t.settings.themeLabel}
            value={themeMode}
            options={themeOptions}
            onChange={(v) => setThemeMode(v as ThemeMode)}
          />
        </Card>

        {/* --- Component Preview Link --- */}
        <SectionTitle title={t.settings.componentPreview} />
        <Pressable onPress={() => router.push('/component-preview')}>
          <Card>
            <View style={styles.menuRow}>
              <Text style={[styles.menuLabel, { color: c.text }]}>{t.settings.componentPreview}</Text>
              <Text style={[styles.menuArrow, { color: c.textLight }]}>→</Text>
            </View>
          </Card>
        </Pressable>

        {/* --- Export --- */}
        <SectionTitle title={t.settings.exportTitle} />
        <Card>
          <Button
            title={t.settings.exportCsv}
            variant="outline"
            onPress={async () => {
              await exportFile(applicationsToCsv(applications), 'applyhoff-export.csv');
              showToast(t.settings.exportSuccess);
            }}
          />
          <View style={{ height: spacing.sm }} />
          <Button
            title={t.settings.exportDetailed}
            variant="outline"
            onPress={async () => {
              await exportFile(applicationsToDetailedText(applications), 'applyhoff-detailed.txt');
              showToast(t.settings.exportSuccess);
            }}
          />
          <View style={{ height: spacing.sm }} />
          <Button
            title={t.settings.exportList}
            variant="outline"
            onPress={async () => {
              await exportFile(applicationsToSimpleList(applications), 'applyhoff-list.txt');
              showToast(t.settings.exportSuccess);
            }}
          />
        </Card>

        {/* --- Templates --- */}
        <SectionTitle title={t.template.title} />
        <Card>
          {templates.length === 0 ? (
            <Text style={[styles.captionText, { color: c.textSecondary }]}>{t.template.noTemplates}</Text>
          ) : (
            templates.map((tpl) => (
              <View key={tpl.id} style={[styles.templateRow, { borderBottomColor: c.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bodyText, { color: c.text }]}>{tpl.name}</Text>
                  <Text style={[styles.captionText, { color: c.textSecondary }]}>
                    {[tpl.company, tpl.position].filter(Boolean).join(' — ') || '—'}
                  </Text>
                </View>
                <Pressable
                  hitSlop={8}
                  onPress={() => {
                    const doDelete = async () => {
                      await deleteTemplate(tpl.id);
                      showToast(t.template.templateDeleted);
                    };
                    if (Platform.OS === 'web') {
                      if (window.confirm(t.template.deleteConfirm.replace('{name}', tpl.name))) {
                        doDelete();
                      }
                    } else {
                      import('react-native').then(({ Alert: A }) => {
                        A.alert(
                          t.template.title,
                          t.template.deleteConfirm.replace('{name}', tpl.name),
                          [
                            { text: t.dashboard.confirmCancel, style: 'cancel' },
                            { text: t.detail.deleteConfirm, style: 'destructive', onPress: doDelete },
                          ]
                        );
                      });
                    }
                  }}
                >
                  <Text style={[styles.deleteIcon, { color: c.error }]}>×</Text>
                </Pressable>
              </View>
            ))
          )}
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
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  bodyText: {
    ...typography.body,
  },
  captionText: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  backText: {
    ...typography.label,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuLabel: {
    ...typography.body,
  },
  menuArrow: {
    ...typography.body,
  },
  templateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  deleteIcon: {
    fontSize: 20,
    paddingHorizontal: spacing.sm,
  },
});
