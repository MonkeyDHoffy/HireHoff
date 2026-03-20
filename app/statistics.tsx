import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';
import { Header } from '../src/components/Header';
import { Card } from '../src/components/Card';
import { SectionTitle } from '../src/components/SectionTitle';
import { Footer } from '../src/components/Footer';
import { useApplicationStore } from '../src/store';
import { useTheme } from '../src/store/theme';
import {
  APPLICATION_STATUSES,
  STATUS_COLORS,
  ApplicationStatus,
  ApplicationSource,
} from '../src/types';
import { useI18n } from '../src/i18n';

export default function StatisticsScreen() {
  const router = useRouter();
  const applications = useApplicationStore((s) => s.applications);
  const statusHistory = useApplicationStore((s) => s.statusHistory);
  const c = useTheme((s) => s.colors);
  const t = useI18n((s) => s.t);

  // --- Status breakdown ---
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of APPLICATION_STATUSES) counts[s] = 0;
    for (const app of applications) counts[app.status]++;
    return counts;
  }, [applications]);

  const maxCount = useMemo(
    () => Math.max(1, ...Object.values(statusCounts)),
    [statusCounts],
  );

  // --- Applications by month ---
  const monthlyData = useMemo(() => {
    const map = new Map<string, number>();
    for (const app of applications) {
      const d = new Date(app.appliedAt || app.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6);
  }, [applications]);

  const maxMonthly = useMemo(
    () => Math.max(1, ...monthlyData.map(([, v]) => v)),
    [monthlyData],
  );

  // --- Top sources ---
  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const app of applications) {
      const src = app.source || 'other';
      counts[src] = (counts[src] || 0) + 1;
    }
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [applications]);

  // --- Avg response time (applied → next status change) ---
  const avgResponseDays = useMemo(() => {
    const times: number[] = [];
    for (const app of applications) {
      if (!app.appliedAt) continue;
      const events = statusHistory
        .filter((ev) => ev.applicationId === app.id && ev.fromStatus === 'applied')
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      if (events.length > 0) {
        const diff =
          new Date(events[0].createdAt).getTime() -
          new Date(app.appliedAt).getTime();
        times.push(diff / 86400000);
      }
    }
    if (times.length === 0) return null;
    return Math.round(times.reduce((s, v) => s + v, 0) / times.length);
  }, [applications, statusHistory]);

  // --- Success / active rates ---
  const total = applications.length;
  const activeStatuses: ApplicationStatus[] = [
    'applied',
    'acknowledged',
    'interview_1',
    'interview_2',
    'assignment',
  ];
  const active = applications.filter((a) =>
    activeStatuses.includes(a.status),
  ).length;
  const offers = statusCounts['offer'] || 0;
  const successPct = total > 0 ? Math.round((offers / total) * 100) : 0;
  const activePct = total > 0 ? Math.round((active / total) * 100) : 0;

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      <Header
        title={t.statistics.title}
        left={
          <Text style={[styles.backText, { color: c.primary }]} onPress={() => router.back()}>
            {t.nav.back}
          </Text>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {total === 0 ? (
          <Card>
            <Text style={[styles.noData, { color: c.textSecondary }]}>{t.statistics.noData}</Text>
          </Card>
        ) : (
          <>
            {/* --- Overview cards --- */}
            <SectionTitle title={t.dashboard.overview} />
            <View style={styles.overviewRow}>
              <Card style={styles.overviewCard}>
                <Text style={[styles.bigNumber, { color: c.primary }]}>{total}</Text>
                <Text style={[styles.overviewLabel, { color: c.textSecondary }]}>{t.statistics.total}</Text>
              </Card>
              <Card style={styles.overviewCard}>
                <Text style={[styles.bigNumber, { color: c.primary }]}>{active}</Text>
                <Text style={[styles.overviewLabel, { color: c.textSecondary }]}>{t.statistics.active}</Text>
              </Card>
              <Card style={styles.overviewCard}>
                <Text style={[styles.bigNumber, { color: c.primary }]}>{successPct}%</Text>
                <Text style={[styles.overviewLabel, { color: c.textSecondary }]}>{t.statistics.successRate}</Text>
              </Card>
            </View>

            {/* --- Avg Response Time --- */}
            {avgResponseDays !== null && (
              <>
                <SectionTitle title={t.statistics.responseTime} />
                <Card>
                  <View style={styles.responseRow}>
                    <Text style={[styles.bigNumber, { color: c.primary }]}>{avgResponseDays}</Text>
                    <Text style={[styles.responseUnit, { color: c.textSecondary }]}>{t.statistics.days}</Text>
                  </View>
                  <Text style={[styles.responseCaption, { color: c.textLight }]}>
                    {t.statistics.avgResponseTime}
                  </Text>
                </Card>
              </>
            )}

            {/* --- Status Breakdown --- */}
            <SectionTitle title={t.statistics.statusBreakdown} />
            <Card>
              {APPLICATION_STATUSES.map((status) => {
                const count = statusCounts[status];
                const pct = (count / maxCount) * 100;
                return (
                  <View key={status} style={styles.barRow}>
                    <Text style={[styles.barLabel, { color: c.text }]} numberOfLines={1}>
                      {t.status[status]}
                    </Text>
                    <View style={[styles.barTrack, { backgroundColor: c.border }]}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            width: `${pct}%`,
                            backgroundColor: STATUS_COLORS[status],
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.barCount, { color: c.text }]}>{count}</Text>
                  </View>
                );
              })}
            </Card>

            {/* --- Applications by Month --- */}
            {monthlyData.length > 0 && (
              <>
                <SectionTitle title={t.statistics.applicationsByMonth} />
                <Card>
                  {monthlyData.map(([month, count]) => {
                    const pct = (count / maxMonthly) * 100;
                    return (
                      <View key={month} style={styles.barRow}>
                        <Text style={[styles.barLabel, { color: c.text }]}>{month}</Text>
                        <View style={[styles.barTrack, { backgroundColor: c.border }]}>
                          <View
                            style={[
                              styles.barFill,
                              {
                                width: `${pct}%`,
                                backgroundColor: c.primary,
                              },
                            ]}
                          />
                        </View>
                        <Text style={[styles.barCount, { color: c.text }]}>{count}</Text>
                      </View>
                    );
                  })}
                </Card>
              </>
            )}

            {/* --- Top Sources --- */}
            {sourceCounts.length > 0 && (
              <>
                <SectionTitle title={t.statistics.topSources} />
                <Card>
                  {sourceCounts.map(([src, count]) => (
                    <View key={src} style={[styles.sourceRow, { borderBottomColor: c.border }]}>
                      <Text style={[styles.sourceLabel, { color: c.text }]}>
                        {(t.source as Record<string, string>)[src] ?? src}
                      </Text>
                      <Text style={[styles.sourceCount, { color: c.primary }]}>{count}</Text>
                    </View>
                  ))}
                </Card>
              </>
            )}
          </>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      <Footer />
    </View>
  );
}

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
  backText: {
    ...typography.label,
  },
  noData: {
    ...typography.body,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  overviewRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  overviewCard: {
    flex: 1,
    alignItems: 'center',
  },
  bigNumber: {
    ...typography.heading1,
    fontSize: 28,
  },
  overviewLabel: {
    ...typography.caption,
    marginTop: 2,
  },
  responseRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  responseUnit: {
    ...typography.body,
  },
  responseCaption: {
    ...typography.caption,
    marginTop: 2,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  barLabel: {
    ...typography.caption,
    width: 90,
  },
  barTrack: {
    flex: 1,
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    marginHorizontal: spacing.sm,
  },
  barFill: {
    height: '100%',
    borderRadius: 7,
  },
  barCount: {
    ...typography.label,
    width: 28,
    textAlign: 'right',
  },
  sourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
  },
  sourceLabel: {
    ...typography.body,
  },
  sourceCount: {
    ...typography.label,
  },
});
