import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../src/theme/colors';
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

/**
 * Component Preview — Design System Showcase.
 * Accessible via Settings > Component Preview.
 */
export default function ComponentPreviewScreen() {
  const router = useRouter();
  const t = useI18n((s) => s.t);

  return (
    <View style={styles.screen}>
      <Header
        title={t.settings.componentPreview}
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
        {/* --- Buttons --- */}
        <Text style={styles.subheading}>{t.settings.buttons}</Text>
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
        <Text style={styles.subheading}>{t.settings.buttonSizes}</Text>
        <Card>
          <Button title={t.settings.small} onPress={() => {}} size="sm" />
          <View style={styles.spacer} />
          <Button title={t.settings.medium} onPress={() => {}} size="md" />
          <View style={styles.spacer} />
          <Button title={t.settings.large} onPress={() => {}} size="lg" />
        </Card>

        {/* --- Badges --- */}
        <Text style={styles.subheading}>{t.settings.badges}</Text>
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
        <Text style={styles.subheading}>{t.settings.statusPills}</Text>
        <Card>
          <View style={styles.row}>
            <StatusPill label={t.settings.statusApplied} color={colors.primary} />
            <StatusPill label={t.settings.statusInterview} color={colors.success} />
            <StatusPill label={t.settings.statusRejected} color={colors.error} />
          </View>
        </Card>

        {/* --- Surfaces --- */}
        <Text style={styles.subheading}>{t.settings.surfaces}</Text>
        <Surface>
          <Text style={styles.bodyText}>{t.settings.defaultSurface}</Text>
        </Surface>
        <View style={styles.spacer} />
        <Surface variant="alt">
          <Text style={styles.bodyText}>{t.settings.altSurface}</Text>
        </Surface>

        {/* --- Input Fields --- */}
        <Text style={styles.subheading}>{t.settings.inputFields}</Text>
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
        <Text style={styles.subheading}>{t.settings.emptyState}</Text>
        <Card>
          <EmptyState
            title={t.settings.emptyStateTitle}
            description={t.settings.emptyStateDescription}
            action={<Button title={t.settings.addApplication} onPress={() => {}} size="sm" />}
          />
        </Card>

        {/* --- Typography Preview --- */}
        <Text style={styles.subheading}>{t.settings.typographyPreview}</Text>
        <Card>
          <Text style={[typography.heading1, { color: colors.text }]}>{t.settings.heading1}</Text>
          <Text style={[typography.heading2, { color: colors.text }]}>{t.settings.heading2}</Text>
          <Text style={[typography.heading3, { color: colors.text }]}>{t.settings.heading3}</Text>
          <Text style={[typography.body, { color: colors.text }]}>{t.settings.bodyText}</Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>{t.settings.bodySmall}</Text>
          <Text style={[typography.caption, { color: colors.textLight }]}>{t.settings.caption}</Text>
          <Text style={[typography.label, { color: colors.text }]}>{t.settings.labelText}</Text>
        </Card>

        {/* --- Color Palette --- */}
        <Text style={styles.subheading}>{t.settings.colorPalette}</Text>
        <Card>
          <View style={styles.row}>
            <ColorSwatch color={colors.background} name="bg" />
            <ColorSwatch color={colors.surface} name="surface" />
            <ColorSwatch color={colors.surfaceAlt} name="surfAlt" />
            <ColorSwatch color={colors.primary} name="primary" />
            <ColorSwatch color={colors.primaryLight} name="priLight" />
            <ColorSwatch color={colors.primaryDark} name="priDark" />
            <ColorSwatch color={colors.accent} name="accent" />
          </View>
          <View style={[styles.row, { marginTop: spacing.sm }]}>
            <ColorSwatch color={colors.success} name="success" />
            <ColorSwatch color={colors.warning} name="warning" />
            <ColorSwatch color={colors.error} name="error" />
            <ColorSwatch color={colors.text} name="text" />
            <ColorSwatch color={colors.textSecondary} name="txtSec" />
            <ColorSwatch color={colors.textLight} name="txtLight" />
            <ColorSwatch color={colors.border} name="border" />
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
  return (
    <View style={swatchStyles.container}>
      <View style={[swatchStyles.swatch, { backgroundColor: color }]} />
      <Text style={swatchStyles.label}>{name}</Text>
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
    borderColor: colors.border,
  },
  label: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});

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
    color: colors.text,
  },
  subheading: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  backText: {
    ...typography.label,
    color: colors.primary,
  },
});
