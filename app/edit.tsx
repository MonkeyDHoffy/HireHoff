import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';
import { Header } from '../src/components/Header';
import { Card } from '../src/components/Card';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { Select } from '../src/components/Select';
import { Toggle } from '../src/components/Toggle';
import { Footer } from '../src/components/Footer';
import { SectionTitle } from '../src/components/SectionTitle';
import { useApplicationStore } from '../src/store';
import {
  APPLICATION_SOURCES,
  APPLICATION_STATUSES,
  ApplicationSource,
  ApplicationStatus,
} from '../src/types';
import { useI18n } from '../src/i18n';

/**
 * Edit Application form screen.
 * Pre-fills all fields from the existing application.
 */
export default function EditApplicationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const app = useApplicationStore((s) => s.getApplication(id ?? ''));
  const updateApplication = useApplicationStore((s) => s.updateApplication);
  const t = useI18n((s) => s.t);

  const [form, setForm] = useState(() => {
    if (!app) return null;
    return {
      company: app.company,
      position: app.position,
      location: app.location,
      remote: app.remote,
      url: app.url,
      source: app.source,
      status: app.status,
      salary: app.salary,
      contact: app.contact,
      notes: app.notes,
      appliedAt: app.appliedAt,
    };
  });

  if (!app || !form) {
    return (
      <View style={styles.screen}>
        <Header
          title={t.detail.notFoundTitle}
          left={
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={styles.backText}>{t.nav.back}</Text>
            </Pressable>
          }
        />
        <View style={styles.center}>
          <Text style={styles.notFoundText}>{t.detail.notFoundMessage}</Text>
        </View>
      </View>
    );
  }

  const sourceOptions = APPLICATION_SOURCES.map((s) => ({
    value: s,
    label: t.source[s],
  }));

  const statusOptions = APPLICATION_STATUSES.map((s) => ({
    value: s,
    label: t.status[s],
  }));

  const updateField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = async () => {
    if (!form.company.trim()) {
      showAlert(t.form.validationCompany);
      return;
    }
    if (!form.position.trim()) {
      showAlert(t.form.validationPosition);
      return;
    }

    await updateApplication(app.id, form);
    router.back();
  };

  const showAlert = (message: string) => {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert(t.form.validationTitle, message);
    }
  };

  return (
    <View style={styles.screen}>
      <Header
        title={t.form.editTitle}
        left={
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={styles.backText}>{t.nav.back}</Text>
          </Pressable>
        }
        right={
          <Pressable onPress={handleSave} hitSlop={8}>
            <Text style={styles.saveText}>{t.form.save}</Text>
          </Pressable>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* --- Required Fields --- */}
        <SectionTitle title={t.form.sectionCompany} />
        <Card>
          <Input
            label={t.form.companyLabel}
            placeholder={t.form.companyPlaceholder}
            value={form.company}
            onChangeText={(v) => updateField('company', v)}
            autoCapitalize="words"
          />
          <Input
            label={t.form.positionLabel}
            placeholder={t.form.positionPlaceholder}
            value={form.position}
            onChangeText={(v) => updateField('position', v)}
          />
          <Input
            label={t.form.locationLabel}
            placeholder={t.form.locationPlaceholder}
            value={form.location}
            onChangeText={(v) => updateField('location', v)}
          />
          <Toggle
            label={t.form.remoteLabel}
            value={form.remote}
            onToggle={(v) => updateField('remote', v)}
          />
        </Card>

        {/* --- Details --- */}
        <SectionTitle title={t.form.sectionDetails} />
        <Card>
          <Select
            label={t.form.sourceLabel}
            value={form.source}
            options={sourceOptions}
            onChange={(v) => updateField('source', v as ApplicationSource)}
          />
          <Input
            label={t.form.urlLabel}
            placeholder={t.form.urlPlaceholder}
            value={form.url}
            onChangeText={(v) => updateField('url', v)}
            keyboardType="url"
            autoCapitalize="none"
          />
          <Input
            label={t.form.salaryLabel}
            placeholder={t.form.salaryPlaceholder}
            value={form.salary}
            onChangeText={(v) => updateField('salary', v)}
          />
          <Input
            label={t.form.contactLabel}
            placeholder={t.form.contactPlaceholder}
            value={form.contact}
            onChangeText={(v) => updateField('contact', v)}
          />
        </Card>

        {/* --- Notes --- */}
        <SectionTitle title={t.form.sectionNotes} />
        <Card>
          <Input
            label={t.form.notesLabel}
            placeholder={t.form.notesPlaceholder}
            value={form.notes}
            onChangeText={(v) => updateField('notes', v)}
            multiline
            numberOfLines={4}
          />
        </Card>

        {/* --- Save Button --- */}
        <View style={styles.buttonRow}>
          <Button
            title={t.form.saveApplication}
            onPress={handleSave}
            size="lg"
            style={styles.saveButton}
          />
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      <Footer />
    </View>
  );
}

// --- Styles ---

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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  backText: {
    ...typography.label,
    color: colors.primary,
  },
  saveText: {
    ...typography.label,
    color: colors.primary,
    fontWeight: '700',
  },
  buttonRow: {
    marginTop: spacing.lg,
  },
  saveButton: {
    width: '100%',
  },
});
