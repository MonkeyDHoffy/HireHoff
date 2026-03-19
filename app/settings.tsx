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

/**
 * Settings screen — includes the component preview.
 * Accessible via the burger menu in the header.
 */
export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <Header
        title="Settings"
        left={
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Settings Section --- */}
        <SectionTitle title="App Info" />
        <Card>
          <Text style={styles.bodyText}>ApplyHoff v1.0.0</Text>
          <Text style={styles.captionText}>
            Job application tracker built with Expo + React Native
          </Text>
        </Card>

        {/* ========================================= */}
        {/* Component Preview — Design System Showcase */}
        {/* ========================================= */}

        <SectionTitle title="Component Preview" />

        {/* --- Buttons --- */}
        <Text style={styles.subheading}>Buttons</Text>
        <Card>
          <Button title="Primary Button" onPress={() => {}} />
          <View style={styles.spacer} />
          <Button title="Secondary" onPress={() => {}} variant="secondary" />
          <View style={styles.spacer} />
          <Button title="Outline" onPress={() => {}} variant="outline" />
          <View style={styles.spacer} />
          <Button title="Ghost" onPress={() => {}} variant="ghost" />
          <View style={styles.spacer} />
          <Button title="Disabled" onPress={() => {}} disabled />
          <View style={styles.spacer} />
          <Button title="Loading..." onPress={() => {}} loading />
        </Card>

        {/* --- Button Sizes --- */}
        <Text style={styles.subheading}>Button Sizes</Text>
        <Card>
          <Button title="Small" onPress={() => {}} size="sm" />
          <View style={styles.spacer} />
          <Button title="Medium" onPress={() => {}} size="md" />
          <View style={styles.spacer} />
          <Button title="Large" onPress={() => {}} size="lg" />
        </Card>

        {/* --- Badges --- */}
        <Text style={styles.subheading}>Badges</Text>
        <Card>
          <View style={styles.row}>
            <Badge label="Default" />
            <Badge label="Primary" variant="primary" />
            <Badge label="Success" variant="success" />
            <Badge label="Warning" variant="warning" />
            <Badge label="Error" variant="error" />
          </View>
        </Card>

        {/* --- Status Pills --- */}
        <Text style={styles.subheading}>Status Pills</Text>
        <Card>
          <View style={styles.row}>
            <StatusPill label="Applied" color={colors.primary} />
            <StatusPill label="Interview" color={colors.success} />
            <StatusPill label="Rejected" color={colors.error} />
          </View>
        </Card>

        {/* --- Surfaces --- */}
        <Text style={styles.subheading}>Surfaces</Text>
        <Surface>
          <Text style={styles.bodyText}>Default Surface</Text>
        </Surface>
        <View style={styles.spacer} />
        <Surface variant="alt">
          <Text style={styles.bodyText}>Alt Surface</Text>
        </Surface>

        {/* --- Input Fields --- */}
        <Text style={styles.subheading}>Input Fields</Text>
        <Card>
          <Input label="Company" placeholder="e.g. Acme Corp" />
          <Input label="Position" placeholder="e.g. Frontend Developer" />
          <Input
            label="Notes"
            placeholder="Any additional notes..."
            multiline
            numberOfLines={3}
          />
          <Input
            label="With Error"
            placeholder="Required field"
            error
            helperText="This field is required"
          />
        </Card>

        {/* --- Empty State --- */}
        <Text style={styles.subheading}>Empty State</Text>
        <Card>
          <EmptyState
            title="No applications yet"
            description="Start tracking your job applications by adding your first one."
            action={<Button title="Add Application" onPress={() => {}} size="sm" />}
          />
        </Card>

        {/* --- Typography Preview --- */}
        <Text style={styles.subheading}>Typography</Text>
        <Card>
          <Text style={[typography.heading1, { color: colors.text }]}>Heading 1</Text>
          <Text style={[typography.heading2, { color: colors.text }]}>Heading 2</Text>
          <Text style={[typography.heading3, { color: colors.text }]}>Heading 3</Text>
          <Text style={[typography.body, { color: colors.text }]}>Body text — regular</Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>Body small — secondary</Text>
          <Text style={[typography.caption, { color: colors.textLight }]}>Caption — light</Text>
          <Text style={[typography.label, { color: colors.text }]}>Label — medium weight</Text>
        </Card>

        {/* --- Color Palette --- */}
        <Text style={styles.subheading}>Color Palette</Text>
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
  captionText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
