/**
 * ApplyHoff — SQLite Database Layer
 *
 * Handles all local persistence using expo-sqlite.
 * Tables: applications, status_history, settings
 */

import * as SQLite from 'expo-sqlite';
import type { Application, StatusEvent, ApplicationStatus, ApplicationSource, Reminder } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

/** Open (or create) the database and run migrations */
export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync('applyhoff.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY NOT NULL,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      location TEXT NOT NULL DEFAULT '',
      remote INTEGER NOT NULL DEFAULT 0,
      url TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT 'other',
      status TEXT NOT NULL DEFAULT 'draft',
      salary TEXT NOT NULL DEFAULT '',
      contact TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      appliedAt TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS status_history (
      id TEXT PRIMARY KEY NOT NULL,
      applicationId TEXT NOT NULL,
      fromStatus TEXT,
      toStatus TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL,
      FOREIGN KEY (applicationId) REFERENCES applications(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY NOT NULL,
      applicationId TEXT NOT NULL,
      dueAt TEXT NOT NULL,
      message TEXT NOT NULL DEFAULT '',
      done INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (applicationId) REFERENCES applications(id) ON DELETE CASCADE
    );
  `);
}

function getDb(): SQLite.SQLiteDatabase {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
  return db;
}

// ─── Applications ────────────────────────────────────────────

export async function getAllApplications(): Promise<Application[]> {
  const rows = await getDb().getAllAsync<Record<string, unknown>>(
    'SELECT * FROM applications ORDER BY createdAt DESC'
  );
  return rows.map(rowToApplication);
}

export async function getApplicationById(id: string): Promise<Application | undefined> {
  const row = await getDb().getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM applications WHERE id = ?',
    [id]
  );
  return row ? rowToApplication(row) : undefined;
}

export async function insertApplication(app: Application): Promise<void> {
  await getDb().runAsync(
    `INSERT INTO applications (id, company, position, location, remote, url, source, status, salary, contact, notes, appliedAt, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      app.id, app.company, app.position, app.location,
      app.remote ? 1 : 0, app.url, app.source, app.status,
      app.salary, app.contact, app.notes,
      app.appliedAt, app.createdAt, app.updatedAt,
    ]
  );
}

export async function updateApplicationInDb(
  id: string,
  data: Partial<Omit<Application, 'id' | 'createdAt'>>
): Promise<void> {
  const fields: string[] = [];
  const values: unknown[] = [];

  const fieldMap: Record<string, (v: unknown) => unknown> = {
    company: (v) => v,
    position: (v) => v,
    location: (v) => v,
    remote: (v) => (v ? 1 : 0),
    url: (v) => v,
    source: (v) => v,
    status: (v) => v,
    salary: (v) => v,
    contact: (v) => v,
    notes: (v) => v,
    appliedAt: (v) => v,
    updatedAt: (v) => v,
  };

  for (const [key, transform] of Object.entries(fieldMap)) {
    if (key in data) {
      fields.push(`${key} = ?`);
      values.push(transform((data as Record<string, unknown>)[key]));
    }
  }

  if (fields.length === 0) return;
  values.push(id);

  await getDb().runAsync(
    `UPDATE applications SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}

export async function deleteApplicationFromDb(id: string): Promise<void> {
  await getDb().runAsync('DELETE FROM status_history WHERE applicationId = ?', [id]);
  await getDb().runAsync('DELETE FROM applications WHERE id = ?', [id]);
}

// ─── Status History ──────────────────────────────────────────

export async function getHistoryForApplication(applicationId: string): Promise<StatusEvent[]> {
  const rows = await getDb().getAllAsync<Record<string, unknown>>(
    'SELECT * FROM status_history WHERE applicationId = ? ORDER BY createdAt DESC',
    [applicationId]
  );
  return rows.map(rowToStatusEvent);
}

export async function getAllHistory(): Promise<StatusEvent[]> {
  const rows = await getDb().getAllAsync<Record<string, unknown>>(
    'SELECT * FROM status_history ORDER BY createdAt DESC'
  );
  return rows.map(rowToStatusEvent);
}

export async function insertStatusEvent(event: StatusEvent): Promise<void> {
  await getDb().runAsync(
    `INSERT INTO status_history (id, applicationId, fromStatus, toStatus, note, createdAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [event.id, event.applicationId, event.fromStatus, event.toStatus, event.note, event.createdAt]
  );
}

// ─── Settings (key-value) ────────────────────────────────────

export async function getSetting(key: string): Promise<string | null> {
  const row = await getDb().getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    [key]
  );
  return row ? row.value : null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await getDb().runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    [key, value]
  );
}
// ─── Reminders ──────────────────────────────────────────────────

export async function getAllReminders(): Promise<Reminder[]> {
  const rows = await getDb().getAllAsync<Record<string, unknown>>(
    'SELECT * FROM reminders ORDER BY dueAt ASC'
  );
  return rows.map(rowToReminder);
}

export async function getRemindersForApplication(applicationId: string): Promise<Reminder[]> {
  const rows = await getDb().getAllAsync<Record<string, unknown>>(
    'SELECT * FROM reminders WHERE applicationId = ? ORDER BY dueAt ASC',
    [applicationId]
  );
  return rows.map(rowToReminder);
}

export async function insertReminder(reminder: Reminder): Promise<void> {
  await getDb().runAsync(
    `INSERT INTO reminders (id, applicationId, dueAt, message, done, createdAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [reminder.id, reminder.applicationId, reminder.dueAt, reminder.message, reminder.done ? 1 : 0, reminder.createdAt]
  );
}

export async function updateReminderInDb(id: string, data: Partial<Omit<Reminder, 'id' | 'createdAt'>>): Promise<void> {
  const fields: string[] = [];
  const values: unknown[] = [];
  if (data.done !== undefined) { fields.push('done = ?'); values.push(data.done ? 1 : 0); }
  if (data.message !== undefined) { fields.push('message = ?'); values.push(data.message); }
  if (data.dueAt !== undefined) { fields.push('dueAt = ?'); values.push(data.dueAt); }
  if (fields.length === 0) return;
  values.push(id);
  await getDb().runAsync(`UPDATE reminders SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function deleteReminderFromDb(id: string): Promise<void> {
  await getDb().runAsync('DELETE FROM reminders WHERE id = ?', [id]);
}
// ─── Row Mappers ─────────────────────────────────────────────

function rowToApplication(row: Record<string, unknown>): Application {
  return {
    id: row.id as string,
    company: row.company as string,
    position: row.position as string,
    location: (row.location as string) ?? '',
    remote: Boolean(row.remote),
    url: (row.url as string) ?? '',
    source: (row.source as ApplicationSource) ?? 'other',
    status: (row.status as ApplicationStatus) ?? 'draft',
    salary: (row.salary as string) ?? '',
    contact: (row.contact as string) ?? '',
    notes: (row.notes as string) ?? '',
    appliedAt: row.appliedAt as string,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  };
}

function rowToStatusEvent(row: Record<string, unknown>): StatusEvent {
  return {
    id: row.id as string,
    applicationId: row.applicationId as string,
    fromStatus: (row.fromStatus as ApplicationStatus) ?? null,
    toStatus: row.toStatus as ApplicationStatus,
    note: (row.note as string) ?? '',
    createdAt: row.createdAt as string,
  };
}

function rowToReminder(row: Record<string, unknown>): Reminder {
  return {
    id: row.id as string,
    applicationId: row.applicationId as string,
    dueAt: row.dueAt as string,
    message: (row.message as string) ?? '',
    done: Boolean(row.done),
    createdAt: row.createdAt as string,
  };
}
