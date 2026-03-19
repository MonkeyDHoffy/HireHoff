import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';
import { Header } from '../src/components/Header';
import { Card } from '../src/components/Card';
import { Badge } from '../src/components/Badge';
import { StatusPill } from '../src/components/StatusPill';
import { SectionTitle } from '../src/components/SectionTitle';
import { Button } from '../src/components/Button';
import { Select } from '../src/components/Select';
import { Input } from '../src/components/Input';
import { Footer } from '../src/components/Footer';
import { useApplicationStore } from '../src/store';
import { useTheme } from '../src/store/theme';
import {
  STATUS_COLORS,
  APPLICATION_STATUSES,
  ApplicationStatus,
} from '../src/types';
import { useI18n } from '../src/i18n';
import { useToast } from '../src/store/toast';

/**
 * Application detail screen.
 * Shows all details, status history, and allows status changes.
 */
export default function DetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const applications = useApplicationStore((s) => s.applications);
  const statusHistory = useApplicationStore((s) => s.statusHistory);
  const allReminders = useApplicationStore((s) => s.reminders);
  const changeStatus = useApplicationStore((s) => s.changeStatus);

  const app = useMemo(() => applications.find((a) => a.id === id), [applications, id]);
  const history = useMemo(
    () =>
      statusHistory
        .filter((ev) => ev.applicationId === id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [statusHistory, id]
  );
  const appReminders = useMemo(
    () => allReminders.filter((r) => r.applicationId === id).sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()),
    [allReminders, id]
  );
  const deleteApplication = useApplicationStore((s) => s.deleteApplication);
  const addReminder = useApplicationStore((s) => s.addReminder);
  const toggleReminder = useApplicationStore((s) => s.toggleReminder);
  const deleteReminder = useApplicationStore((s) => s.deleteReminder);
  const t = useI18n((s) => s.t);
  const showToast = useToast((s) => s.show);
  const c = useTheme((s) => s.colors);
  const [reminderDays, setReminderDays] = useState('14');

  if (!app) {
    return (
      <View style={[styles.screen, { backgroundColor: c.background }]}>
        <Header
          title={t.detail.notFoundTitle}
          left={
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={styles.backText}>{t.nav.back}</Text>
            </Pressable>
          }
        />
        <View style={styles.center}>
          <Text style={styles.notFound}>{t.detail.notFoundMessage}</Text>
        </View>
      </View>
    );
  }

  const statusOptions = APPLICATION_STATUSES.map((s) => ({
    value: s,
    label: t.status[s],
  }));

  const handleStatusChange = async (newStatus: string) => {
    await changeStatus(app.id, newStatus as ApplicationStatus);
    showToast(t.toast.statusChanged);
  };

  const handleDelete = () => {
    const doDelete = async () => {
      await deleteApplication(app.id);
      showToast(t.toast.applicationDeleted);
      router.back();
    };

    if (Platform.OS === 'web') {
      if (window.confirm(t.detail.deleteMessage.replace('{company}', app.company))) {
        doDelete();
      }
    } else {
      Alert.alert(
        t.detail.deleteTitle,
        t.detail.deleteMessage.replace('{company}', app.company),
        [
          { text: t.detail.deleteCancel, style: 'cancel' },
          { text: t.detail.deleteConfirm, style: 'destructive', onPress: doDelete },
        ]
      );
    }
  };

  const handleDuplicate = () => {
    router.push(`/new?duplicate=${app.id}`);
    showToast(t.toast.applicationDuplicated, 'info');
  };

  const appliedDate = new Date(app.appliedAt).toLocaleDateString();

  return (
    <View style={[styles.screen, { backgroundColor: c.background }]}>
      <Header
        title={app.company}
        subtitle={app.position}
        left={
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={styles.backText}>{t.nav.back}</Text>
          </Pressable>
        }
        right={
          <Pressable onPress={() => router.push(`/edit?id=${app.id}`)} hitSlop={8}>
            <Text style={styles.editText}>{t.detail.edit}</Text>
          </Pressable>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Status --- */}
        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <StatusPill
              label={t.status[app.status]}
              color={STATUS_COLORS[app.status]}
            />
            <Text style={styles.dateText}>{t.detail.appliedDate.replace('{date}', appliedDate)}</Text>
          </View>
        </Card>

        {/* --- Details --- */}
        <SectionTitle title={t.detail.details} />
        <Card>
          <DetailRow label={t.detail.company} value={app.company} />
          <DetailRow label={t.detail.position} value={app.position} />
          <DetailRow
            label={t.detail.location}
            value={
              app.location
                ? `${app.location}${app.remote ? ` · ${t.detail.remote}` : ''}`
                : app.remote
                ? t.detail.remote
                : t.detail.emptyValue
            }
          />
          <DetailRow label={t.detail.source} value={t.source[app.source]} />
          {app.salary ? <DetailRow label={t.detail.salary} value={app.salary} /> : null}
          {app.contact ? (
            <DetailRow label={t.detail.contact} value={app.contact} />
          ) : null}
          {app.url ? <DetailRow label={t.detail.url} value={app.url} /> : null}
        </Card>

        {/* --- Notes --- */}
        {app.notes ? (
          <>
            <SectionTitle title={t.detail.notes} />
            <Card>
              <Text style={styles.notesText}>{app.notes}</Text>
            </Card>
          </>
        ) : null}

        {/* --- Reminders --- */}
        <SectionTitle title={t.reminder.title} />
        <Card>
          {appReminders.length === 0 ? (
            <Text style={styles.emptyHistory}>{t.reminder.noReminders}</Text>
          ) : (
            appReminders.map((rem) => {
              const dueDate = new Date(rem.dueAt);
              const now = new Date();
              const isOverdue = !rem.done && dueDate < now;
              const isToday = !rem.done && dueDate.toDateString() === now.toDateString();
              return (
                <View key={rem.id} style={styles.reminderItem}>
                  <Pressable onPress={async () => { await toggleReminder(rem.id); showToast(t.toast.reminderToggled); }} style={styles.reminderCheck}>
                    <Text style={{ fontSize: 18 }}>{rem.done ? '☑' : '☐'}</Text>
                  </Pressable>
                  <View style={styles.reminderContent}>
                    <Text style={[styles.reminderMsg, rem.done && styles.reminderDone]}>{rem.message}</Text>
                    <Text style={[
                      styles.reminderDate,
                      isOverdue && styles.reminderOverdue,
                      isToday && styles.reminderToday,
                    ]}>
                      {isOverdue ? `${t.reminder.overdue}: ` : isToday ? `${t.reminder.dueToday}: ` : `${t.reminder.due}: `}
                      {dueDate.toLocaleDateString()}
                    </Text>
                  </View>
                  <Pressable onPress={async () => { await deleteReminder(rem.id); showToast(t.toast.reminderDeleted); }} hitSlop={8}>
                    <Text style={styles.reminderDeleteIcon}>×</Text>
                  </Pressable>
                </View>
              );
            })
          )}
          <View style={styles.addReminderRow}>
            <View style={styles.addReminderInputs}>
              <Input
                placeholder={t.reminder.messagePlaceholder}
                value={reminderMsg}
                onChangeText={setReminderMsg}
                style={styles.reminderInput}
              />
              <Input
                placeholder="14"
                value={reminderDays}
                onChangeText={setReminderDays}
                keyboardType="numeric"
                style={styles.reminderDaysInput}
              />
              <Text style={styles.reminderDaysLabel}>{t.reminder.dateLabel}</Text>
            </View>
            <Button
              title={t.reminder.addReminder}
              size="sm"
              onPress={async () => {
                const days = parseInt(reminderDays, 10) || 14;
                const dueAt = new Date(Date.now() + days * 86400000).toISOString();
                const msg = reminderMsg.trim() || t.reminder.messagePlaceholder;
                await addReminder(app.id, dueAt, msg);
                setReminderMsg('');
                setReminderDays('14');
                showToast(t.toast.reminderAdded);
              }}
            />
          </View>
        </Card>

        {/* --- Change Status --- */}
        <SectionTitle title={t.detail.changeStatus} />
        <Card>
          <Select
            label={t.detail.status}
            value={app.status}
            options={statusOptions}
            onChange={handleStatusChange}
          />
        </Card>

        {/* --- Status History --- */}
        <SectionTitle title={t.detail.timeline} />
        <Card>
          {history.length === 0 ? (
            <Text style={styles.emptyHistory}>{t.detail.noHistory}</Text>
          ) : (
            history.map((event, index) => (
              <View
                key={event.id}
                style={[
                  styles.historyItem,
                  index < history.length - 1 && styles.historyItemBorder,
                ]}
              >
                <View style={styles.historyDot} />
                <View style={styles.historyContent}>
                  <Text style={styles.historyStatus}>
                    {event.fromStatus
                      ? `${t.status[event.fromStatus]} → ${t.status[event.toStatus]}`
                      : t.status[event.toStatus]}
                  </Text>
                  {event.note ? (
                    <Text style={styles.historyNote}>{event.note}</Text>
                  ) : null}
                  <Text style={styles.historyDate}>
                    {new Date(event.createdAt).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>

        {/* --- Actions --- */}
        <View style={styles.deleteSection}>
          <Button
            title={t.detail.duplicate}
            variant="ghost"
            onPress={handleDuplicate}
            style={styles.duplicateButton}
          />
          <Button
            title={t.detail.deleteButton}
            variant="outline"
            onPress={handleDelete}
            style={styles.deleteButton}
          />
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      <Footer />
    </View>
  );
}

// --- Helper Component ---

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} selectable>
        {value}
      </Text>
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
    padding: spacing.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    ...typography.body,
    color: colors.textSecondary,
  },
  backText: {
    ...typography.label,
    color: colors.primary,
  },
  editText: {
    ...typography.label,
    color: colors.primary,
    fontWeight: '700',
  },
  statusCard: {
    marginTop: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    ...typography.label,
    color: colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    ...typography.body,
    color: colors.text,
    flex: 2,
    textAlign: 'right',
  },
  notesText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  emptyHistory: {
    ...typography.bodySmall,
    color: colors.textLight,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  historyItem: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
  },
  historyItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 5,
    marginRight: spacing.sm,
  },
  historyContent: {
    flex: 1,
  },
  historyStatus: {
    ...typography.label,
    color: colors.text,
  },
  historyNote: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  historyDate: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: 2,
  },
  deleteSection: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  duplicateButton: {
    width: '100%',
  },
  deleteButton: {
    borderColor: colors.error,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reminderCheck: {
    marginRight: spacing.sm,
  },
  reminderContent: {
    flex: 1,
  },
  reminderMsg: {
    ...typography.body,
    color: colors.text,
  },
  reminderDone: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
  reminderDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  reminderOverdue: {
    color: colors.error,
    fontWeight: '700',
  },
  reminderToday: {
    color: colors.primary,
    fontWeight: '700',
  },
  reminderDeleteIcon: {
    fontSize: 20,
    color: colors.error,
    paddingHorizontal: spacing.sm,
  },
  addReminderRow: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  addReminderInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  reminderInput: {
    flex: 1,
  },
  reminderDaysInput: {
    width: 50,
  },
  reminderDaysLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
