import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';
import { Header } from '../src/components/Header';
import { Card } from '../src/components/Card';
import { StatusPill } from '../src/components/StatusPill';
import { Footer } from '../src/components/Footer';
import { useApplicationStore } from '../src/store';
import { useTheme } from '../src/store/theme';
import { STATUS_COLORS } from '../src/types';
import { useI18n } from '../src/i18n';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarScreen() {
  const router = useRouter();
  const applications = useApplicationStore((s) => s.applications);
  const c = useTheme((s) => s.colors);
  const t = useI18n((s) => s.t);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const monthLabel = new Date(year, month).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  // Group applications by day of the current month
  const dayMap = useMemo(() => {
    const map = new Map<number, typeof applications>();
    for (const app of applications) {
      const d = new Date(app.appliedAt || app.createdAt);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map.has(day)) map.set(day, []);
        map.get(day)!.push(app);
      }
    }
    return map;
  }, [applications, year, month]);

  // Build calendar grid
  const firstDay = new Date(year, month, 1);
  // Monday = 0, Sunday = 6
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const goPrev = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); }
    else setMonth(month - 1);
  };
  const goNext = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); }
    else setMonth(month + 1);
  };

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      <Header
        title={t.calendar.title}
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
        {/* Month navigation */}
        <View style={styles.monthNav}>
          <Pressable onPress={goPrev} hitSlop={12}>
            <Text style={[styles.navArrow, { color: c.primary }]}>←</Text>
          </Pressable>
          <Text style={[styles.monthLabel, { color: c.text }]}>{monthLabel}</Text>
          <Pressable onPress={goNext} hitSlop={12}>
            <Text style={[styles.navArrow, { color: c.primary }]}>→</Text>
          </Pressable>
        </View>

        {/* Weekday headers */}
        <View style={styles.weekRow}>
          {WEEKDAYS.map((wd) => (
            <Text key={wd} style={[styles.weekDay, { color: c.textSecondary }]}>{wd}</Text>
          ))}
        </View>

        {/* Calendar grid */}
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.weekRow}>
            {week.map((day, di) => {
              const apps = day ? dayMap.get(day) : undefined;
              return (
                <View
                  key={di}
                  style={[
                    styles.dayCell,
                    { borderColor: c.border },
                    isToday(day!) && styles.todayCell,
                  ]}
                >
                  {day !== null && (
                    <>
                      <Text style={[styles.dayNumber, { color: c.text }, isToday(day) && [styles.todayNumber, { color: c.primary }]]}>
                        {day}
                      </Text>
                      {apps?.map((app) => (
                        <Pressable
                          key={app.id}
                          onPress={() => router.push(`/detail?id=${app.id}`)}
                        >
                          <View
                            style={[
                              styles.dot,
                              { backgroundColor: STATUS_COLORS[app.status] },
                            ]}
                          />
                        </Pressable>
                      ))}
                    </>
                  )}
                </View>
              );
            })}
          </View>
        ))}

        {/* List of apps for this month */}
        {dayMap.size > 0 ? (
          [...dayMap.entries()]
            .sort(([a], [b]) => a - b)
            .map(([day, apps]) => (
              <View key={day} style={styles.daySection}>
                <Text style={[styles.daySectionTitle, { color: c.textSecondary }]}>
                  {day}. {monthLabel}
                </Text>
                {apps.map((app) => (
                  <Pressable
                    key={app.id}
                    onPress={() => router.push(`/detail?id=${app.id}`)}
                  >
                    <Card style={styles.appCard} accentColor={STATUS_COLORS[app.status]}>
                      <Text style={[styles.appCompany, { color: c.text }]}>{app.company}</Text>
                      <Text style={[styles.appPosition, { color: c.textSecondary }]}>{app.position}</Text>
                      <StatusPill
                        label={t.status[app.status]}
                        color={STATUS_COLORS[app.status]}
                      />
                    </Card>
                  </Pressable>
                ))}
              </View>
            ))
        ) : (
          <Card>
            <Text style={[styles.emptyText, { color: c.textLight }]}>
              {t.calendar.noApplications}
            </Text>
          </Card>
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
  scroll: { flex: 1 },
  content: { padding: spacing.md },
  backText: {
    ...typography.label,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  navArrow: {
    ...typography.heading2,
  },
  monthLabel: {
    ...typography.heading3,
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    ...typography.caption,
    paddingBottom: spacing.xs,
  },
  dayCell: {
    flex: 1,
    minHeight: 44,
    borderWidth: 0.5,
    padding: 2,
    alignItems: 'center',
  },
  todayCell: {
    backgroundColor: 'rgba(224, 122, 58, 0.1)',
  },
  dayNumber: {
    ...typography.caption,
    marginBottom: 2,
  },
  todayNumber: {
    fontWeight: '700',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginVertical: 1,
  },
  daySection: {
    marginTop: spacing.md,
  },
  daySectionTitle: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  appCard: {
    marginBottom: spacing.sm,
  },
  appCompany: {
    ...typography.label,
  },
  appPosition: {
    ...typography.bodySmall,
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
});
