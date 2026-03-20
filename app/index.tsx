import React, { useMemo, useRef, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Platform, Alert, ActionSheetIOS } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';
import { radii } from '../src/theme/radii';
import { Header } from '../src/components/Header';
import { Card } from '../src/components/Card';
import { SectionTitle } from '../src/components/SectionTitle';
import { EmptyState } from '../src/components/EmptyState';
import { Button } from '../src/components/Button';
import { Footer } from '../src/components/Footer';
import { BurgerMenu } from '../src/components/BurgerMenu';
import { StatusPill } from '../src/components/StatusPill';
import { Select } from '../src/components/Select';
import { CountUp } from '../src/components/CountUp';
import { SwipeableCard } from '../src/components/SwipeableCard';
import { ScrollToTop } from '../src/components/ScrollToTop';
import { useApplicationStore } from '../src/store';
import { useTheme } from '../src/store/theme';
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
  const deleteApplication = useApplicationStore((s) => s.deleteApplication);
  const toggleFavorite = useApplicationStore((s) => s.toggleFavorite);
  const addApplication = useApplicationStore((s) => s.addApplication);
  const allReminders = useApplicationStore((s) => s.reminders);
  const c = useTheme((s) => s.colors);
  const t = useI18n((s) => s.t);
  const showToast = useToast((s) => s.show);

  const scrollRef = useRef<ScrollView>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [glowCardId, setGlowCardId] = useState<string | null>(null);

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
    { label: t.nav.statistics, route: '/statistics' },
    { label: t.kanban.title, route: '/kanban' },
    { label: t.calendar.title, route: '/calendar' },
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

  // Application streak — consecutive days with at least one application
  const streak = useMemo(() => {
    if (applications.length === 0) return 0;
    const daySet = new Set(
      applications.map((a) => new Date(a.createdAt).toDateString())
    );
    let count = 0;
    const d = new Date();
    // start from today and walk backwards
    while (true) {
      if (daySet.has(d.toDateString())) {
        count++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  }, [applications]);

  // Weekly digest — last week's stats
  const weeklyDigest = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const lastWeekApps = applications.filter(
      (a) => new Date(a.createdAt) >= weekAgo && new Date(a.createdAt) <= now
    );
    const applied = lastWeekApps.filter((a) =>
      ['applied', 'acknowledged'].includes(a.status)
    ).length;
    const interviews = lastWeekApps.filter((a) =>
      ['interview_1', 'interview_2', 'assignment'].includes(a.status)
    ).length;
    return { applied, interviews, total: lastWeekApps.length };
  }, [applications]);

  // Sort: favorites first, then by createdAt
  const sortedApplications = useMemo(() => {
    return [...applications].sort((a, b) => {
      if (a.favorited && !b.favorited) return -1;
      if (!a.favorited && b.favorited) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [applications]);

  // Latest 5 applications (with favorites on top)
  const recent = sortedApplications.slice(0, 5);

  // Long-press quick actions handler
  const handleLongPress = useCallback((appId: string) => {
    const options = [
      t.quickAction.edit,
      t.quickAction.duplicate,
      t.quickAction.toggleFavorite,
      t.quickAction.delete,
      t.dashboard.confirmCancel,
    ];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, destructiveButtonIndex: 3, cancelButtonIndex: 4, title: t.quickAction.title },
        (idx) => handleQuickAction(appId, idx)
      );
    } else if (Platform.OS === 'web') {
      // Web: use simple prompt-style
      const choice = window.prompt(
        `${t.quickAction.title}\n1. ${options[0]}\n2. ${options[1]}\n3. ${options[2]}\n4. ${options[3]}`
      );
      if (choice) handleQuickAction(appId, parseInt(choice, 10) - 1);
    } else {
      Alert.alert(t.quickAction.title, undefined, [
        { text: options[0], onPress: () => handleQuickAction(appId, 0) },
        { text: options[1], onPress: () => handleQuickAction(appId, 1) },
        { text: options[2], onPress: () => handleQuickAction(appId, 2) },
        { text: options[3], style: 'destructive', onPress: () => handleQuickAction(appId, 3) },
        { text: options[4], style: 'cancel' },
      ]);
    }
  }, [t, applications]);

  const handleQuickAction = useCallback(async (appId: string, actionIndex: number) => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;
    switch (actionIndex) {
      case 0: // Edit
        router.push(`/edit?id=${appId}`);
        break;
      case 1: // Duplicate
        router.push(`/new?duplicate=${appId}`);
        break;
      case 2: // Toggle Favorite
        await toggleFavorite(appId);
        showToast(app.favorited ? t.dashboard.unfavorited : t.dashboard.favorited);
        break;
      case 3: { // Delete with undo
        const snapshot = { ...app };
        await deleteApplication(appId);
        showToast(t.toast.applicationDeleted, 'error', async () => {
          const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = snapshot;
          await addApplication(rest);
        });
        break;
      }
    }
  }, [applications, toggleFavorite, deleteApplication, addApplication, showToast, t, router]);

  // Swipe handlers
  const handleSwipeDelete = useCallback(async (appId: string) => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;
    const snapshot = { ...app };
    await deleteApplication(appId);
    showToast(t.toast.applicationDeleted, 'error', async () => {
      const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = snapshot;
      await addApplication(rest);
    });
  }, [applications, deleteApplication, addApplication, showToast, t]);

  // Status change with glow animation
  const handleStatusChange = useCallback(async (appId: string, newStatus: ApplicationStatus) => {
    await changeStatus(appId, newStatus);
    setGlowCardId(appId);
    showToast(t.toast.statusChanged);
    setTimeout(() => setGlowCardId(null), 1500);
  }, [changeStatus, showToast, t]);

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      <Header
        title="ApplyHoff"
        subtitle={t.nav.dashboard}
        left={<BurgerMenu items={menuItems} />}
        right={
          <Pressable onPress={() => router.push('/new')} hitSlop={8}>
            <Text style={[styles.addIcon, { color: c.primary }]}>+</Text>
          </Pressable>
        }
      />

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => setShowScrollTop(e.nativeEvent.contentOffset.y > 300)}
        scrollEventThrottle={100}
      >
        {/* --- Welcome Hero --- */}
        <LinearGradient
          colors={[c.primary, c.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroGreeting}>{t.dashboard.overview}</Text>
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <CountUp value={total} style={styles.heroStatNumber} />
              <Text style={styles.heroStatLabel}>{t.dashboard.total}</Text>
            </View>
            <View style={[styles.heroStatDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
            <View style={styles.heroStat}>
              <CountUp value={pending} style={styles.heroStatNumber} />
              <Text style={styles.heroStatLabel}>{t.dashboard.pending}</Text>
            </View>
            <View style={[styles.heroStatDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
            <View style={styles.heroStat}>
              <CountUp value={interviews} style={styles.heroStatNumber} />
              <Text style={styles.heroStatLabel}>{t.dashboard.interviews}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* --- Application Streak --- */}
        {streak >= 2 && (
          <View style={[styles.streakBanner, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <View style={styles.streakTextWrap}>
              <Text style={[styles.streakLabel, { color: c.textSecondary }]}>{t.dashboard.streakLabel}</Text>
              <Text style={[styles.streakValue, { color: c.primary }]}>
                {t.dashboard.streak.replace('{count}', String(streak))}
              </Text>
            </View>
          </View>
        )}

        {/* --- Weekly Digest --- */}
        {weeklyDigest.total > 0 && (
          <View style={[styles.weeklyDigest, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={styles.weeklyEmoji}>📊</Text>
            <View style={styles.streakTextWrap}>
              <Text style={[styles.streakLabel, { color: c.textSecondary }]}>{t.dashboard.weeklyDigestLabel}</Text>
              <Text style={[styles.weeklyText, { color: c.text }]}>
                {t.dashboard.weeklyDigest
                  .replace('{applied}', String(weeklyDigest.applied))
                  .replace('{interviews}', String(weeklyDigest.interviews))}
              </Text>
            </View>
          </View>
        )}

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
                <Card key={rem.id} style={styles.reminderCard} onPress={() => app && router.push(`/detail?id=${app.id}`)}>
                    <Text style={[styles.reminderCompany, { color: c.text }]}>{app?.company ?? '—'}</Text>
                    <Text style={[styles.reminderMsg, { color: c.textSecondary }]}>{rem.message}</Text>
                    <Text style={[
                      styles.reminderDue,
                      { color: c.textSecondary },
                      isOverdue && { color: c.error, fontWeight: '700' },
                      isToday && { color: c.primary, fontWeight: '700' },
                    ]}>
                      {isOverdue ? t.reminder.overdue : isToday ? t.reminder.dueToday : t.reminder.due}: {dueDate.toLocaleDateString()}
                    </Text>
                  </Card>
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
              <SwipeableCard
                key={app.id}
                onSwipeLeft={() => handleSwipeDelete(app.id)}
                onSwipeRight={() => router.push(`/edit?id=${app.id}`)}
                leftLabel="🗑️"
                rightLabel="✏️"
              >
                <Card
                  style={styles.appCard}
                  accentColor={STATUS_COLORS[app.status]}
                  onPress={() => router.push(`/detail?id=${app.id}`)}
                  onLongPress={() => handleLongPress(app.id)}
                  glowColor={glowCardId === app.id ? STATUS_COLORS[app.status] : null}
                >
                  <View style={styles.appCardHeader}>
                    <View style={styles.appCardTitleRow}>
                      <Pressable
                        onPress={() => {
                          toggleFavorite(app.id);
                          showToast(app.favorited ? t.dashboard.unfavorited : t.dashboard.favorited);
                        }}
                        hitSlop={8}
                        style={styles.favButton}
                      >
                        <Text style={styles.favStar}>{app.favorited ? '⭐' : '☆'}</Text>
                      </Pressable>
                      <Text style={[styles.appCompany, { color: c.text }]} numberOfLines={1}>
                        {app.company}
                      </Text>
                    </View>
                    <StatusPill
                      label={t.status[app.status]}
                      color={STATUS_COLORS[app.status]}
                    />
                  </View>
                  <Text style={[styles.appPosition, { color: c.textSecondary }]} numberOfLines={1}>
                    {app.position}
                  </Text>
                  {app.location ? (
                    <Text style={[styles.appMeta, { color: c.textLight }]}>
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
                        const doChange = () => handleStatusChange(app.id, val as ApplicationStatus);
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
              </SwipeableCard>
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

      <ScrollToTop
        visible={showScrollTop}
        onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
      />

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
  hero: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  streakEmoji: {
    fontSize: 28,
    marginRight: spacing.sm,
  },
  streakTextWrap: {
    flex: 1,
  },
  streakLabel: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  streakValue: {
    ...typography.heading3,
    marginTop: 2,
  },
  weeklyDigest: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  weeklyEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  weeklyText: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  heroGreeting: {
    ...typography.heading2,
    color: '#FFFFFF',
    marginBottom: spacing.md,
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  heroStat: {
    alignItems: 'center',
    flex: 1,
  },
  heroStatNumber: {
    ...typography.heading1,
    color: '#FFFFFF',
    fontSize: 32,
  },
  heroStatLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xxs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroStatDivider: {
    width: 1,
    height: 36,
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
  appCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  favButton: {
    padding: 4,
  },
  favStar: {
    fontSize: 18,
    marginRight: 4,
  },
  appCompany: {
    ...typography.heading3,
    flex: 1,
  },
  appPosition: {
    ...typography.body,
  },
  appMeta: {
    ...typography.caption,
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
    lineHeight: 32,
  },
  reminderCard: {
    marginBottom: spacing.sm,
  },
  reminderCompany: {
    ...typography.label,
    marginBottom: 2,
  },
  reminderMsg: {
    ...typography.bodySmall,
  },
  reminderDue: {
    ...typography.caption,
    marginTop: 2,
  },
});
