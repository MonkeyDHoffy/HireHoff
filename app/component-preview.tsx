import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';
import { Header } from '../src/components/Header';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';
import { Badge } from '../src/components/Badge';
import { StatusPill } from '../src/components/StatusPill';
import { SectionTitle } from '../src/components/SectionTitle';
import { Surface } from '../src/components/Surface';
import { Input } from '../src/components/Input';
import { EmptyState } from '../src/components/EmptyState';
import { Footer } from '../src/components/Footer';
import { useI18n } from '../src/i18n';
import { useTheme } from '../src/store/theme';

/**
 * Component Preview — Design System Showcase.
 * Accessible via Settings > Component Preview.
 */
export default function ComponentPreviewScreen() {
  const router = useRouter();
  const t = useI18n((s) => s.t);
  const c = useTheme((s) => s.colors);

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      <Header
        title={t.settings.componentPreview}
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
        {/* --- Buttons --- */}
        <Text style={[styles.subheading, { color: c.textSecondary }]}>{t.settings.buttons}</Text>
        <Card>
          <Button title={t.settings.primaryButton} onPress={() => {}} />
          <View style={styles.spacer} />
          <Button title={t.settings.secondary} onPress={() => {}} variant="secondary" />
          <View style={styles.spacer} />
          <Button title={t.settings.outline} onPress={() => {}} variant="outline" />
          <View style={styles.spacer} />
          <Button title={t.settings.ghost} onPress={() => {}} variant="ghost" />
          <View style={styles.spacer} />
          <Button title={t.settings.disabled} onPress={() => {}} disabled />
          <View style={styles.spacer} />
          <Button title={t.settings.loading} onPress={() => {}} loading />
        </Card>

        {/* --- Button Sizes --- */}
        <Text style={[styles.subheading, { color: c.textSecondary }]}>{t.settings.buttonSizes}</Text>
        <Card>
          <Button title={t.settings.small} onPress={() => {}} size="sm" />
          <View style={styles.spacer} />
          <Button title={t.settings.medium} onPress={() => {}} size="md" />
          <View style={styles.spacer} />
          <Button title={t.settings.large} onPress={() => {}} size="lg" />
        </Card>

        {/* --- Badges --- */}
        <Text style={[styles.subheading, { color: c.textSecondary }]}>{t.settings.badges}</Text>
        <Card>
          <View style={styles.row}>
            <Badge label={t.settings.badgeDefault} />
            <Badge label={t.settings.badgePrimary} variant="primary" />
            <Badge label={t.settings.badgeSuccess} variant="success" />
            <Badge label={t.settings.badgeWarning} variant="warning" />
            <Badge label={t.settings.badgeError} variant="error" />
          </View>
        </Card>

        {/* --- Status Pills --- */}
        <Text style={[styles.subheading, { color: c.textSecondary }]}>{t.settings.statusPills}</Text>
        <Card>
          <View style={styles.row}>
            <StatusPill label={t.settings.statusApplied} color={c.primary} />
            <StatusPill label={t.settings.statusInterview} color={c.success} />
            <StatusPill label={t.settings.statusRejected} color={c.error} />
          </View>
        </Card>

        {/* --- Surfaces --- */}
        <Text style={[styles.subheading, { color: c.textSecondary }]}>{t.settings.surfaces}</Text>
        <Surface>
          <Text style={[styles.bodyText, { color: c.text }]}>{t.settings.defaultSurface}</Text>
        </Surface>
        <View style={styles.spacer} />
        <Surface variant="alt">
          <Text style={[styles.bodyText, { color: c.text }]}>{t.settings.altSurface}</Text>
        </Surface>

        {/* --- Input Fields --- */}
        <Text style={[styles.subheading, { color: c.textSecondary }]}>{t.settings.inputFields}</Text>
        <Card>
          <Input label={t.settings.companyLabel} placeholder={t.settings.companyPlaceholder} />
          <Input label={t.settings.positionLabel} placeholder={t.settings.positionPlaceholder} />
          <Input
            label={t.settings.notesLabel}
            placeholder={t.settings.notesPlaceholder}
            multiline
            numberOfLines={3}
          />
          <Input
            label={t.settings.withError}
            placeholder={t.settings.requiredField}
            error
            helperText={t.settings.fieldRequired}
          />
        </Card>

        {/* --- Empty State --- */}
        <Text style={[styles.subheading, { color: c.textSecondary }]}>{t.settings.emptyState}</Text>
        <Card>
          <EmptyState
            title={t.settings.emptyStateTitle}
            description={t.settings.emptyStateDescription}
            action={<Button title={t.settings.addApplication} onPress={() => {}} size="sm" />}
          />
        </Card>

        {/* --- Typography Preview --- */}
        <Text style={[styles.subheading, { color: c.textSecondary }]}>{t.settings.typographyPreview}</Text>
        <Card>
          <Text style={[typography.heading1, { color: c.text }]}>{t.settings.heading1}</Text>
          <Text style={[typography.heading2, { color: c.text }]}>{t.settings.heading2}</Text>
          <Text style={[typography.heading3, { color: c.text }]}>{t.settings.heading3}</Text>
          <Text style={[typography.body, { color: c.text }]}>{t.settings.bodyText}</Text>
          <Text style={[typography.bodySmall, { color: c.textSecondary }]}>{t.settings.bodySmall}</Text>
          <Text style={[typography.caption, { color: c.textLight }]}>{t.settings.caption}</Text>
          <Text style={[typography.label, { color: c.text }]}>{t.settings.labelText}</Text>
        </Card>

        {/* --- Color Palette --- */}
        <Text style={[styles.subheading, { color: c.textSecondary }]}>{t.settings.colorPalette}</Text>
        <Card>
          <View style={styles.row}>
            <ColorSwatch color={c.background} name="bg" />
            <ColorSwatch color={c.surface} name="surface" />
            <ColorSwatch color={c.surfaceAlt} name="surfAlt" />
            <ColorSwatch color={c.primary} name="primary" />
            <ColorSwatch color={c.primaryLight} name="priLight" />
            <ColorSwatch color={c.primaryDark} name="priDark" />
            <ColorSwatch color={c.accent} name="accent" />
          </View>
          <View style={[styles.row, { marginTop: spacing.sm }]}>
            <ColorSwatch color={c.success} name="success" />
            <ColorSwatch color={c.warning} name="warning" />
            <ColorSwatch color={c.error} name="error" />
            <ColorSwatch color={c.text} name="text" />
            <ColorSwatch color={c.textSecondary} name="txtSec" />
            <ColorSwatch color={c.textLight} name="txtLight" />
            <ColorSwatch color={c.border} name="border" />
          </View>
        </Card>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      <Footer />
    </View>
  );
}

// --- Helper: Color Swatch ---

function ColorSwatch({ color, name }: { color: string; name: string }) {
  const c = useTheme((s) => s.colors);
  return (
    <View style={swatchStyles.container}>
      <View style={[swatchStyles.swatch, { backgroundColor: color, borderColor: c.border }]} />
      <Text style={[swatchStyles.label, { color: c.textSecondary }]}>{name}</Text>
    </View>
  );
}

const swatchStyles = StyleSheet.create({
  container: { alignItems: 'center', marginRight: spacing.sm },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
  },
  label: { ...typography.caption, marginTop: 2 },
});

// --- Styles ---

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
  spacer: {
    height: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  bodyText: {
    ...typography.body,
  },
  subheading: {
    ...typography.label,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  backText: {
    ...typography.label,
  },
});
