/**
 * ApplyHoff — Web Database Layer (localStorage)
 *
 * Drop-in replacement for the SQLite layer on web.
 * Metro resolves this file automatically for web builds.
 * Same public API as index.ts (native SQLite version).
 */

import type { Application, StatusEvent, ApplicationStatus, ApplicationSource, Reminder } from '../types';

const STORAGE_KEYS = {
  applications: 'applyhoff_applications',
  statusHistory: 'applyhoff_status_history',
  settings: 'applyhoff_settings',
  reminders: 'applyhoff_reminders',
} as const;

// ─── Helpers ─────────────────────────────────────────────────

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Init (no-op on web, localStorage is always available) ───

export async function initDatabase(): Promise<void> {
  // Nothing to initialise — localStorage is ready immediately.
}

// ─── Applications ────────────────────────────────────────────

export async function getAllApplications(): Promise<Application[]> {
  const apps = loadJSON<Application[]>(STORAGE_KEYS.applications, []);
  return apps.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getApplicationById(id: string): Promise<Application | undefined> {
  const apps = loadJSON<Application[]>(STORAGE_KEYS.applications, []);
  return apps.find((a) => a.id === id);
}

export async function insertApplication(app: Application): Promise<void> {
  const apps = loadJSON<Application[]>(STORAGE_KEYS.applications, []);
  apps.push(app);
  saveJSON(STORAGE_KEYS.applications, apps);
}

export async function updateApplicationInDb(
  id: string,
  data: Partial<Omit<Application, 'id' | 'createdAt'>>
): Promise<void> {
  const apps = loadJSON<Application[]>(STORAGE_KEYS.applications, []);
  const idx = apps.findIndex((a) => a.id === id);
  if (idx === -1) return;
  apps[idx] = { ...apps[idx], ...data };
  saveJSON(STORAGE_KEYS.applications, apps);
}

export async function deleteApplicationFromDb(id: string): Promise<void> {
  // Remove status history entries for this application
  const history = loadJSON<StatusEvent[]>(STORAGE_KEYS.statusHistory, []);
  saveJSON(
    STORAGE_KEYS.statusHistory,
    history.filter((ev) => ev.applicationId !== id)
  );

  // Remove the application itself
  const apps = loadJSON<Application[]>(STORAGE_KEYS.applications, []);
  saveJSON(
    STORAGE_KEYS.applications,
    apps.filter((a) => a.id !== id)
  );
}

// ─── Status History ──────────────────────────────────────────

export async function getHistoryForApplication(applicationId: string): Promise<StatusEvent[]> {
  const history = loadJSON<StatusEvent[]>(STORAGE_KEYS.statusHistory, []);
  return history
    .filter((ev) => ev.applicationId === applicationId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAllHistory(): Promise<StatusEvent[]> {
  const history = loadJSON<StatusEvent[]>(STORAGE_KEYS.statusHistory, []);
  return history.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function insertStatusEvent(event: StatusEvent): Promise<void> {
  const history = loadJSON<StatusEvent[]>(STORAGE_KEYS.statusHistory, []);
  history.push(event);
  saveJSON(STORAGE_KEYS.statusHistory, history);
}

// ─── Settings (key-value) ────────────────────────────────────

export async function getSetting(key: string): Promise<string | null> {
  const settings = loadJSON<Record<string, string>>(STORAGE_KEYS.settings, {});
  return settings[key] ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const settings = loadJSON<Record<string, string>>(STORAGE_KEYS.settings, {});
  settings[key] = value;
  saveJSON(STORAGE_KEYS.settings, settings);
}

// ─── Reminders ──────────────────────────────────────────────────

export async function getAllReminders(): Promise<Reminder[]> {
  const reminders = loadJSON<Reminder[]>(STORAGE_KEYS.reminders, []);
  return reminders.sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
}

export async function getRemindersForApplication(applicationId: string): Promise<Reminder[]> {
  const reminders = loadJSON<Reminder[]>(STORAGE_KEYS.reminders, []);
  return reminders
    .filter((r) => r.applicationId === applicationId)
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
}

export async function insertReminder(reminder: Reminder): Promise<void> {
  const reminders = loadJSON<Reminder[]>(STORAGE_KEYS.reminders, []);
  reminders.push(reminder);
  saveJSON(STORAGE_KEYS.reminders, reminders);
}

export async function updateReminderInDb(id: string, data: Partial<Omit<Reminder, 'id' | 'createdAt'>>): Promise<void> {
  const reminders = loadJSON<Reminder[]>(STORAGE_KEYS.reminders, []);
  const idx = reminders.findIndex((r) => r.id === id);
  if (idx === -1) return;
  reminders[idx] = { ...reminders[idx], ...data };
  saveJSON(STORAGE_KEYS.reminders, reminders);
}

export async function deleteReminderFromDb(id: string): Promise<void> {
  const reminders = loadJSON<Reminder[]>(STORAGE_KEYS.reminders, []);
  saveJSON(STORAGE_KEYS.reminders, reminders.filter((r) => r.id !== id));
}
