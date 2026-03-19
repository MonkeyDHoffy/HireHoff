import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';
import { Header } from '../src/components/Header';
import { Card } from '../src/components/Card';
import { Input } from '../src/components/Input';
import { StatusPill } from '../src/components/StatusPill';
import { EmptyState } from '../src/components/EmptyState';
import { Badge } from '../src/components/Badge';
import { Footer } from '../src/components/Footer';
import { useApplicationStore } from '../src/store';
import {
  APPLICATION_STATUSES,
  STATUS_COLORS,
  ApplicationStatus,
} from '../src/types';
import { useI18n } from '../src/i18n';
import { useTheme } from '../src/store/theme';

/**
 * Application list — shows all applications with search and status filter.
 */
export default function ApplicationListScreen() {
  const router = useRouter();
  const applications = useApplicationStore((s) => s.applications);
  const c = useTheme((s) => s.colors);
  const t = useI18n((s) => s.t);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'company'>('date');

  const statusOrder = useMemo(
    () => new Map(APPLICATION_STATUSES.map((s, i) => [s, i])),
    []
  );

  const filtered = useMemo(() => {
    let list = [...applications];

    if (statusFilter !== 'all') {
      list = list.filter((a) => a.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.company.toLowerCase().includes(q) ||
          a.position.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'status':
        list.sort((a, b) => (statusOrder.get(a.status) ?? 0) - (statusOrder.get(b.status) ?? 0));
        break;
      case 'company':
        list.sort((a, b) => a.company.localeCompare(b.company));
        break;
      case 'date':
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return list;
  }, [applications, search, statusFilter, sortBy, statusOrder]);

  const filterOptions: { value: ApplicationStatus | 'all'; label: string }[] = [
    { value: 'all', label: t.list.filterAll },
    ...APPLICATION_STATUSES.map((s) => ({ value: s, label: t.status[s] })),
  ];

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      <Header
        title={t.list.title}
        left={
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={styles.backText}>{t.nav.back}</Text>
          </Pressable>
        }
      />

      <View style={styles.searchContainer}>
        <Input
          placeholder={t.list.searchPlaceholder}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
      </View>

      {/* --- Status Filter Chips --- */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {filterOptions.map((opt) => (
          <Pressable
            key={opt.value}
            onPress={() => setStatusFilter(opt.value)}
            style={[
              styles.filterChip,
              statusFilter === opt.value && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === opt.value && styles.filterChipTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* --- Sort Chips --- */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>{t.list.sortBy}:</Text>
        {(['date', 'status', 'company'] as const).map((option) => (
          <Pressable
            key={option}
            onPress={() => setSortBy(option)}
            style={[
              styles.sortChip,
              sortBy === option && styles.sortChipActive,
            ]}
          >
            <Text
              style={[
                styles.sortChipText,
                sortBy === option && styles.sortChipTextActive,
              ]}
            >
              {t.list[`sort${option.charAt(0).toUpperCase() + option.slice(1)}` as 'sortDate' | 'sortStatus' | 'sortCompany']}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.countText}>
        {t.list.count.replace('{count}', String(filtered.length))}
      </Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <EmptyState
            title={t.list.noResults}
            description={t.list.noResultsDescription}
          />
        ) : (
          filtered.map((app) => (
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
                <View style={styles.appMeta}>
                  {app.location ? (
                    <Text style={styles.appMetaText}>
                      {app.location}
                      {app.remote ? ` · ${t.dashboard.remote}` : ''}
                    </Text>
                  ) : app.remote ? (
                    <Text style={styles.appMetaText}>{t.dashboard.remote}</Text>
                  ) : null}
                  <Text style={styles.appMetaText}>
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </Text>
                </View>
              </Card>
            </Pressable>
          ))
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      <Footer />
    </View>
  );
}

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
    paddingHorizontal: spacing.md,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  filterScroll: {
    maxHeight: 44,
    marginTop: spacing.sm,
  },
  filterContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  sortLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  sortChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  sortChipText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sortChipTextActive: {
    color: '#FFFFFF',
  },
  countText: {
    ...typography.caption,
    color: colors.textLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backText: {
    ...typography.label,
    color: colors.primary,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  appMetaText: {
    ...typography.caption,
    color: colors.textLight,
  },
});
