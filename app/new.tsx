import React, { useState, useMemo } from 'react';
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
  createEmptyApplication,
  ApplicationSource,
  ApplicationStatus,
} from '../src/types';
import { useI18n } from '../src/i18n';
import { useToast } from '../src/store/toast';
import { useTheme } from '../src/store/theme';

/**
 * New Application form screen.
 * Allows the user to quickly add a new job application.
 */
export default function NewApplicationScreen() {
  const router = useRouter();
  const { duplicate } = useLocalSearchParams<{ duplicate?: string }>();
  const applications = useApplicationStore((s) => s.applications);
  const addApplication = useApplicationStore((s) => s.addApplication);
  const t = useI18n((s) => s.t);
  const showToast = useToast((s) => s.show);
  const c = useTheme((s) => s.colors);

  const templates = useApplicationStore((s) => s.templates);

  const templateApp = useMemo(
    () => (duplicate ? applications.find((a) => a.id === duplicate) : undefined),
    [duplicate, applications]
  );

  const [form, setForm] = useState(() => {
    if (templateApp) {
      return {
        company: templateApp.company,
        position: templateApp.position,
        location: templateApp.location,
        remote: templateApp.remote,
        url: templateApp.url,
        source: templateApp.source,
        status: 'draft' as const,
        salary: templateApp.salary,
        contact: templateApp.contact,
        notes: templateApp.notes,
        tags: templateApp.tags ?? [],
        appliedAt: new Date().toISOString(),
      };
    }
    return createEmptyApplication();
  });

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
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!form.company.trim()) {
      showAlert(t.form.validationCompany);
      return;
    }
    if (!form.position.trim()) {
      showAlert(t.form.validationPosition);
      return;
    }

    await addApplication(form, t.store.applicationCreated);
    showToast(t.toast.applicationSaved);
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
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      <Header
        title={t.form.title}
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
        {/* --- Template Selector --- */}
        {templates.length > 0 && (
          <>
            <SectionTitle title={t.template.useTemplate} />
            <Card>
              <Select
                label={t.template.selectTemplate}
                value=""
                options={[
                  { value: '', label: t.template.none },
                  ...templates.map((tpl) => ({ value: tpl.id, label: tpl.name })),
                ]}
                onChange={(tplId) => {
                  const tpl = templates.find((t) => t.id === tplId);
                  if (!tpl) return;
                  setForm({
                    company: tpl.company,
                    position: tpl.position,
                    location: tpl.location,
                    remote: tpl.remote,
                    url: tpl.url,
                    source: tpl.source,
                    status: 'draft',
                    salary: tpl.salary,
                    contact: tpl.contact,
                    notes: tpl.notes,
                    tags: tpl.tags ?? [],
                    appliedAt: new Date().toISOString(),
                  });
                }}
              />
            </Card>
          </>
        )}

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
          <Select
            label={t.form.statusLabel}
            value={form.status}
            options={statusOptions}
            onChange={(v) => updateField('status', v as ApplicationStatus)}
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
          <Input
            label={t.form.tagsLabel}
            placeholder={t.form.tagsPlaceholder}
            value={(form.tags ?? []).join(', ')}
            onChangeText={(v) => updateField('tags', v.split(',').map((t) => t.trim()).filter(Boolean))}
            style={{ marginTop: spacing.sm }}
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
