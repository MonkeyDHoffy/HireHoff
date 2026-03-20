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
  const addTemplate = useApplicationStore((s) => s.addTemplate);
  const [reminderMsg, setReminderMsg] = useState('');
  const [reminderDays, setReminderDays] = useState('14');
  const [statusNote, setStatusNote] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [showTemplateInput, setShowTemplateInput] = useState(false);

  if (!app) {
    return (
      <View style={[styles.screen, { backgroundColor: c.background }]}>
        <Header
          title={t.detail.notFoundTitle}
          left={
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={[styles.backText, { color: c.primary }]}>{t.nav.back}</Text>
            </Pressable>
          }
        />
        <View style={styles.center}>
          <Text style={[styles.notFound, { color: c.textSecondary }]}>{t.detail.notFoundMessage}</Text>
        </View>
      </View>
    );
  }

  const statusOptions = APPLICATION_STATUSES.map((s) => ({
    value: s,
    label: t.status[s],
  }));

  const handleStatusChange = async (newStatus: string) => {
    await changeStatus(app.id, newStatus as ApplicationStatus, statusNote.trim());
    setStatusNote('');
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
            <Text style={[styles.backText, { color: c.primary }]}>{t.nav.back}</Text>
          </Pressable>
        }
        right={
          <Pressable onPress={() => router.push(`/edit?id=${app.id}`)} hitSlop={8}>
            <Text style={[styles.editText, { color: c.primary }]}>{t.detail.edit}</Text>
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
            <Text style={[styles.dateText, { color: c.textSecondary }]}>{t.detail.appliedDate.replace('{date}', appliedDate)}</Text>
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
              <Text style={[styles.notesText, { color: c.text }]}>{app.notes}</Text>
            </Card>
          </>
        ) : null}

        {/* --- Tags --- */}
        {app.tags && app.tags.length > 0 ? (
          <>
            <SectionTitle title={t.form.tagsLabel} />
            <View style={styles.tagsRow}>
              {app.tags.map((tag) => (
                <Badge key={tag} label={tag} variant="primary" />
              ))}
            </View>
          </>
        ) : null}

        {/* --- Reminders --- */}
        <SectionTitle title={t.reminder.title} />
        <Card>
          {appReminders.length === 0 ? (
            <Text style={[styles.emptyHistory, { color: c.textLight }]}>{t.reminder.noReminders}</Text>
          ) : (
            appReminders.map((rem) => {
              const dueDate = new Date(rem.dueAt);
              const now = new Date();
              const isOverdue = !rem.done && dueDate < now;
              const isToday = !rem.done && dueDate.toDateString() === now.toDateString();
              return (
                <View key={rem.id} style={[styles.reminderItem, { borderBottomColor: c.border }]}>
                  <Pressable onPress={async () => { await toggleReminder(rem.id); showToast(t.toast.reminderToggled); }} style={styles.reminderCheck}>
                    <Text style={{ fontSize: 18 }}>{rem.done ? '☑' : '☐'}</Text>
                  </Pressable>
                  <View style={styles.reminderContent}>
                    <Text style={[styles.reminderMsg, { color: c.text }, rem.done && [styles.reminderDone, { color: c.textLight }]]}>{rem.message}</Text>
                    <Text style={[
                      styles.reminderDate,
                      { color: c.textSecondary },
                      isOverdue && [styles.reminderOverdue, { color: c.error }],
                      isToday && [styles.reminderToday, { color: c.primary }],
                    ]}>
                      {isOverdue ? `${t.reminder.overdue}: ` : isToday ? `${t.reminder.dueToday}: ` : `${t.reminder.due}: `}
                      {dueDate.toLocaleDateString()}
                    </Text>
                  </View>
                  <Pressable onPress={async () => { await deleteReminder(rem.id); showToast(t.toast.reminderDeleted); }} hitSlop={8}>
                    <Text style={[styles.reminderDeleteIcon, { color: c.error }]}>×</Text>
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
              <Text style={[styles.reminderDaysLabel, { color: c.textSecondary }]}>{t.reminder.dateLabel}</Text>
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
          <Input
            placeholder={t.detail.statusNotePlaceholder}
            value={statusNote}
            onChangeText={setStatusNote}
            style={{ marginTop: spacing.sm }}
          />
        </Card>

        {/* --- Status History --- */}
        <SectionTitle title={t.detail.timeline} />
        <Card>
          {history.length === 0 ? (
            <Text style={[styles.emptyHistory, { color: c.textLight }]}>{t.detail.noHistory}</Text>
          ) : (
            history.map((event, index) => (
              <View
                key={event.id}
                style={[
                  styles.historyItem,
                  index < history.length - 1 && [styles.historyItemBorder, { borderBottomColor: c.border }],
                ]}
              >
                <View style={[styles.historyDot, { backgroundColor: c.primary }]} />
                <View style={styles.historyContent}>
                  <Text style={[styles.historyStatus, { color: c.text }]}>
                    {event.fromStatus
                      ? `${t.status[event.fromStatus]} → ${t.status[event.toStatus]}`
                      : t.status[event.toStatus]}
                  </Text>
                  {event.note ? (
                    <Text style={[styles.historyNote, { color: c.textSecondary }]}>{event.note}</Text>
                  ) : null}
                  <Text style={[styles.historyDate, { color: c.textLight }]}>
                    {new Date(event.createdAt).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>

        {/* --- Actions --- */}
        <View style={styles.deleteSection}>
          {showTemplateInput ? (
            <Card style={{ width: '100%' }}>
              <Input
                label={t.template.templateName}
                placeholder={t.template.templateNamePlaceholder}
                value={templateName}
                onChangeText={setTemplateName}
              />
              <View style={styles.templateBtnRow}>
                <Button
                  title={t.template.cancelTemplate}
                  variant="ghost"
                  size="sm"
                  onPress={() => { setShowTemplateInput(false); setTemplateName(''); }}
                />
                <Button
                  title={t.template.saveTemplate}
                  size="sm"
                  onPress={async () => {
                    const name = templateName.trim() || `${app.company} — ${app.position}`;
                    await addTemplate(name, {
                      company: app.company,
                      position: app.position,
                      location: app.location,
                      remote: app.remote,
                      url: app.url,
                      source: app.source,
                      salary: app.salary,
                      contact: app.contact,
                      notes: app.notes,
                      tags: app.tags,
                    });
                    setShowTemplateInput(false);
                    setTemplateName('');
                    showToast(t.template.templateSaved);
                  }}
                />
              </View>
            </Card>
          ) : (
            <Button
              title={t.template.saveAsTemplate}
              variant="ghost"
              onPress={() => setShowTemplateInput(true)}
              style={styles.duplicateButton}
            />
          )}
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
            style={{ borderColor: c.error }}
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
  const c = useTheme((s) => s.colors);
  return (
    <View style={[styles.detailRow, { borderBottomColor: c.border }]}>
      <Text style={[styles.detailLabel, { color: c.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: c.text }]} selectable>
        {value}
      </Text>
    </View>
  );
}

// --- Styles ---

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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    ...typography.body,
  },
  backText: {
    ...typography.label,
  },
  editText: {
    ...typography.label,
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
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  detailLabel: {
    ...typography.label,
    flex: 1,
  },
  detailValue: {
    ...typography.body,
    flex: 2,
    textAlign: 'right',
  },
  notesText: {
    ...typography.body,
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  emptyHistory: {
    ...typography.bodySmall,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  historyItem: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
  },
  historyItemBorder: {
    borderBottomWidth: 1,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    marginRight: spacing.sm,
  },
  historyContent: {
    flex: 1,
  },
  historyStatus: {
    ...typography.label,
  },
  historyNote: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  historyDate: {
    ...typography.caption,
    marginTop: 2,
  },
  deleteSection: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  templateBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  duplicateButton: {
    width: '100%',
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  reminderCheck: {
    marginRight: spacing.sm,
  },
  reminderContent: {
    flex: 1,
  },
  reminderMsg: {
    ...typography.body,
  },
  reminderDone: {
    textDecorationLine: 'line-through',
  },
  reminderDate: {
    ...typography.caption,
    marginTop: 2,
  },
  reminderOverdue: {
    fontWeight: '700',
  },
  reminderToday: {
    fontWeight: '700',
  },
  reminderDeleteIcon: {
    fontSize: 20,
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
  },
});
