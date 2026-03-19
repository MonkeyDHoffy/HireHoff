import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Platform, Alert } from 'react-native';
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
import { Select } from '../src/components/Select';
import { useApplicationStore } from '../src/store';
import { STATUS_COLORS, APPLICATION_STATUSES, ApplicationStatus } from '../src/types';
import { useI18n } from '../src/i18n';
import { useToast } from '../src/store/toast';

/**
 * Dashboard — main entry screen.
 * Shows an overview of job applications with live stats from the store.
 */
export default function DashboardScreen() {
  const router = useRouter();
  const applications = useApplicationStore((s) => s.applications);
  const changeStatus = useApplicationStore((s) => s.changeStatus);
  const allReminders = useApplicationStore((s) => s.reminders);
  const t = useI18n((s) => s.t);
  const showToast = useToast((s) => s.show);

  const dueReminders = useMemo(() => {
    const now = new Date();
    return allReminders
      .filter((r) => !r.done && new Date(r.dueAt) <= new Date(now.getTime() + 3 * 86400000))
      .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  }, [allReminders]);

  const statusOptions = APPLICATION_STATUSES.map((s) => ({
    value: s,
    label: t.status[s],
  }));

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
        right={
          <Pressable onPress={() => router.push('/new')} hitSlop={8}>
            <Text style={styles.addIcon}>+</Text>
          </Pressable>
        }
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

        {/* --- Upcoming Reminders --- */}
        {dueReminders.length > 0 && (
          <>
            <SectionTitle title={t.reminder.upcomingReminders} />
            {dueReminders.map((rem) => {
              const dueDate = new Date(rem.dueAt);
              const now = new Date();
              const isOverdue = dueDate < now;
              const isToday = dueDate.toDateString() === now.toDateString();
              const app = applications.find((a) => a.id === rem.applicationId);
              return (
                <Pressable key={rem.id} onPress={() => app && router.push(`/detail?id=${app.id}`)}>
                  <Card style={styles.reminderCard}>
                    <Text style={styles.reminderCompany}>{app?.company ?? '—'}</Text>
                    <Text style={styles.reminderMsg}>{rem.message}</Text>
                    <Text style={[
                      styles.reminderDue,
                      isOverdue && styles.reminderOverdue,
                      isToday && styles.reminderDueToday,
                    ]}>
                      {isOverdue ? t.reminder.overdue : isToday ? t.reminder.dueToday : t.reminder.due}: {dueDate.toLocaleDateString()}
                    </Text>
                  </Card>
                </Pressable>
              );
            })}
          </>
        )}

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
                <Card style={styles.appCard} accentColor={STATUS_COLORS[app.status]}>
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
                  <View style={styles.statusSelect}>
                    <Select
                      value={app.status}
                      options={statusOptions}
                      onChange={(val) => {
                        const label = t.status[val as ApplicationStatus];
                        const msg = t.dashboard.confirmStatusMessage.replace('{status}', label);
                        const doChange = async () => {
                          await changeStatus(app.id, val as ApplicationStatus);
                          showToast(t.toast.statusChanged);
                        };
                        if (Platform.OS === 'web') {
                          if (window.confirm(msg)) doChange();
                        } else {
                          Alert.alert(t.dashboard.confirmStatusTitle, msg, [
                            { text: t.dashboard.confirmCancel, style: 'cancel' },
                            { text: t.dashboard.confirmOk, onPress: doChange },
                          ]);
                        }
                      }}
                    />
                  </View>
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
  statusSelect: {
    marginTop: spacing.sm,
  },
  viewAll: {
    marginTop: spacing.sm,
    alignSelf: 'center',
  },
  addButton: {
    marginTop: spacing.lg,
  },
  addIcon: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.primary,
    lineHeight: 32,
  },
  reminderCard: {
    marginBottom: spacing.sm,
  },
  reminderCompany: {
    ...typography.label,
    color: colors.text,
    marginBottom: 2,
  },
  reminderMsg: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  reminderDue: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  reminderOverdue: {
    color: colors.error,
    fontWeight: '700',
  },
  reminderDueToday: {
    color: colors.primary,
    fontWeight: '700',
  },
});
