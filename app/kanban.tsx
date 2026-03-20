import React, { useMemo } from 'react';
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
import { APPLICATION_STATUSES, STATUS_COLORS, ApplicationStatus } from '../src/types';
import { useI18n } from '../src/i18n';

export default function KanbanScreen() {
  const router = useRouter();
  const applications = useApplicationStore((s) => s.applications);
  const c = useTheme((s) => s.colors);
  const t = useI18n((s) => s.t);

  const columns = useMemo(() => {
    const map: Record<ApplicationStatus, typeof applications> = {} as never;
    for (const s of APPLICATION_STATUSES) map[s] = [];
    for (const app of applications) map[app.status].push(app);
    return APPLICATION_STATUSES.map((status) => ({
      status,
      label: t.status[status],
      color: STATUS_COLORS[status],
      apps: map[status],
    }));
  }, [applications, t]);

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      <Header
        title={t.kanban.title}
        left={
          <Text style={[styles.backText, { color: c.primary }]} onPress={() => router.back()}>
            {t.nav.back}
          </Text>
        }
      />

      <ScrollView
        horizontal
        style={styles.board}
        contentContainerStyle={styles.boardContent}
        showsHorizontalScrollIndicator={false}
      >
        {columns.map((col) => (
          <View key={col.status} style={[styles.column, { backgroundColor: c.surfaceAlt }]}>
            <View style={styles.columnHeader}>
              <StatusPill label={col.label} color={col.color} />
              <Text style={[styles.columnCount, { color: c.textSecondary }]}>{col.apps.length}</Text>
            </View>

            <ScrollView
              style={styles.columnScroll}
              showsVerticalScrollIndicator={false}
            >
              {col.apps.length === 0 ? (
                <Text style={[styles.emptyCol, { color: c.textLight }]}>{t.kanban.emptyColumn}</Text>
              ) : (
                col.apps.map((app) => (
                  <Pressable
                    key={app.id}
                    onPress={() => router.push(`/detail?id=${app.id}`)}
                  >
                    <Card style={styles.kanbanCard} accentColor={col.color}>
                      <Text style={[styles.cardCompany, { color: c.text }]} numberOfLines={1}>
                        {app.company}
                      </Text>
                      <Text style={[styles.cardPosition, { color: c.textSecondary }]} numberOfLines={1}>
                        {app.position}
                      </Text>
                      {app.location ? (
                        <Text style={[styles.cardMeta, { color: c.textLight }]} numberOfLines={1}>
                          {app.location}
                        </Text>
                      ) : null}
                    </Card>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        ))}
      </ScrollView>

      <Footer />
    </View>
  );
}

const COLUMN_WIDTH = 220;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  backText: {
    ...typography.label,
  },
  board: {
    flex: 1,
  },
  boardContent: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  column: {
    width: COLUMN_WIDTH,
    marginHorizontal: spacing.xs,
    borderRadius: 12,
    padding: spacing.sm,
    maxHeight: '100%',
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  columnCount: {
    ...typography.label,
  },
  columnScroll: {
    flex: 1,
  },
  emptyCol: {
    ...typography.caption,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  kanbanCard: {
    marginBottom: spacing.sm,
  },
  cardCompany: {
    ...typography.label,
  },
  cardPosition: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  cardMeta: {
    ...typography.caption,
    marginTop: 2,
  },
});
