import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
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
import { StatusPill } from '../src/components/StatusPill';
import { useApplicationStore } from '../src/store';
import { STATUS_COLORS } from '../src/types';
import { useI18n } from '../src/i18n';

/**
 * Dashboard — main entry screen.
 * Shows an overview of job applications with live stats from the store.
 */
export default function DashboardScreen() {
  const router = useRouter();
  const applications = useApplicationStore((s) => s.applications);
  const t = useI18n((s) => s.t);

  const menuItems = [
    { label: t.nav.dashboard, route: '/' },
    { label: t.nav.newApplication, route: '/new' },
    { label: t.nav.allApplications, route: '/applications' },
    { label: t.nav.settings, route: '/settings' },
  ];

  // Compute stats
  const total = applications.length;
  const pending = applications.filter(
    (a) => ['applied', 'acknowledged'].includes(a.status)
  ).length;
  const interviews = applications.filter(
    (a) => ['interview_1', 'interview_2', 'assignment'].includes(a.status)
  ).length;

  // Latest 5 applications
  const recent = applications.slice(0, 5);

  return (
    <View style={styles.screen}>
      <Header
        title="ApplyHoff"
        subtitle={t.nav.dashboard}
        left={<BurgerMenu items={menuItems} />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Quick Stats --- */}
        <SectionTitle title={t.dashboard.overview} />
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{total}</Text>
            <Text style={styles.statLabel}>{t.dashboard.total}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{pending}</Text>
            <Text style={styles.statLabel}>{t.dashboard.pending}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{interviews}</Text>
            <Text style={styles.statLabel}>{t.dashboard.interviews}</Text>
          </Card>
        </View>

        {/* --- Recent Applications --- */}
        <SectionTitle title={t.dashboard.recentApplications} />
        {recent.length === 0 ? (
          <EmptyState
            title={t.dashboard.noApplicationsTitle}
            description={t.dashboard.noApplicationsDescription}
            action={
              <Button
                title={t.dashboard.addApplication}
                onPress={() => router.push('/new')}
              />
            }
          />
        ) : (
          <>
            {recent.map((app) => (
              <Pressable
                key={app.id}
                onPress={() => router.push(`/detail?id=${app.id}`)}
              >
                <Card style={styles.appCard}>
                  <View style={styles.appCardHeader}>
                    <Text style={styles.appCompany} numberOfLines={1}>
                      {app.company}
                    </Text>
                    <StatusPill
                      label={t.status[app.status]}
                      color={STATUS_COLORS[app.status]}
                    />
                  </View>
                  <Text style={styles.appPosition} numberOfLines={1}>
                    {app.position}
                  </Text>
                  {app.location ? (
                    <Text style={styles.appMeta}>
                      {app.location}
                      {app.remote ? ` · ${t.dashboard.remote}` : ''}
                    </Text>
                  ) : null}
                </Card>
              </Pressable>
            ))}

            {total > 5 && (
              <Button
                title={t.dashboard.viewAll}
                variant="ghost"
                onPress={() => router.push('/applications')}
                style={styles.viewAll}
              />
            )}
          </>
        )}

        {/* --- FAB-style add button when there are already applications --- */}
        {recent.length > 0 && (
          <Button
            title={t.dashboard.addApplication}
            onPress={() => router.push('/new')}
            style={styles.addButton}
          />
        )}

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
  appCard: {
    marginBottom: spacing.sm,
  },
  appCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  appCompany: {
    ...typography.heading3,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  appPosition: {
    ...typography.body,
    color: colors.textSecondary,
  },
  appMeta: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  viewAll: {
    marginTop: spacing.sm,
    alignSelf: 'center',
  },
  addButton: {
    marginTop: spacing.lg,
  },
});
