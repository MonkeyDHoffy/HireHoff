import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';
import { Header } from '../src/components/Header';
import { Card } from '../src/components/Card';
import { SectionTitle } from '../src/components/SectionTitle';
import { EmptyState } from '../src/components/EmptyState';
import { Button } from '../src/components/Button';
import { Footer } from '../src/components/Footer';
import { BurgerMenu } from '../src/components/BurgerMenu';

const MENU_ITEMS = [
  { label: 'Dashboard', route: '/' },
  { label: 'Settings', route: '/settings' },
];

/**
 * Dashboard — main entry screen.
 * Shows an overview of job applications (empty state for now).
 * The burger menu in the header provides access to Settings and Component Preview.
 */
export default function DashboardScreen() {
  return (
    <View style={styles.screen}>
      <Header
        title="ApplyHoff"
        subtitle="Dashboard"
        left={<BurgerMenu items={MENU_ITEMS} />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Quick Stats (placeholder) --- */}
        <SectionTitle title="Overview" />
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Total</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Interviews</Text>
          </Card>
        </View>

        {/* --- Recent Applications --- */}
        <SectionTitle title="Recent Applications" />
        <EmptyState
          title="No applications yet"
          description="Start tracking your job applications by adding your first one."
          action={<Button title="+ Add Application" onPress={() => {}} />}
        />
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statNumber: {
    ...typography.heading1,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
