/**
 * ApplyHoff — Zustand Application Store
 *
 * Central state management for job applications.
 * Persists in memory for now — SQLite integration planned.
 */

import { create } from 'zustand';
import {
  Application,
  StatusEvent,
  ApplicationStatus,
  generateId,
} from '../types';

// --- Store Types ---

interface ApplicationStore {
  /** All stored applications */
  applications: Application[];
  /** Status change history for all applications */
  statusHistory: StatusEvent[];

  // --- Actions ---

  /** Add a new application */
  addApplication: (
    data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>,
    initialNote?: string
  ) => string;

  /** Update an existing application (partial update) */
  updateApplication: (
    id: string,
    data: Partial<Omit<Application, 'id' | 'createdAt' | 'updatedAt'>>
  ) => void;

  /** Delete an application and its history */
  deleteApplication: (id: string) => void;

  /** Change the status of an application (creates a history entry) */
  changeStatus: (
    id: string,
    newStatus: ApplicationStatus,
    note?: string
  ) => void;

  /** Get a single application by ID */
  getApplication: (id: string) => Application | undefined;

  /** Get status history for a specific application */
  getHistory: (applicationId: string) => StatusEvent[];
}

// --- Store ---

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  applications: [],
  statusHistory: [],

  addApplication: (data, initialNote) => {
    const now = new Date().toISOString();
    const id = generateId();
    const newApp: Application = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };

    // Create initial status event
    const statusEvent: StatusEvent = {
      id: generateId(),
      applicationId: id,
      fromStatus: null,
      toStatus: data.status,
      note: initialNote ?? 'Application created',
      createdAt: now,
    };

    set((state) => ({
      applications: [newApp, ...state.applications],
      statusHistory: [statusEvent, ...state.statusHistory],
    }));

    return id;
  },

  updateApplication: (id, data) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id
          ? { ...app, ...data, updatedAt: new Date().toISOString() }
          : app
      ),
    }));
  },

  deleteApplication: (id) => {
    set((state) => ({
      applications: state.applications.filter((app) => app.id !== id),
      statusHistory: state.statusHistory.filter(
        (ev) => ev.applicationId !== id
      ),
    }));
  },

  changeStatus: (id, newStatus, note = '') => {
    const app = get().applications.find((a) => a.id === id);
    if (!app || app.status === newStatus) return;

    const now = new Date().toISOString();
    const statusEvent: StatusEvent = {
      id: generateId(),
      applicationId: id,
      fromStatus: app.status,
      toStatus: newStatus,
      note,
      createdAt: now,
    };

    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id
          ? { ...a, status: newStatus, updatedAt: now }
          : a
      ),
      statusHistory: [statusEvent, ...state.statusHistory],
    }));
  },

  getApplication: (id) => {
    return get().applications.find((app) => app.id === id);
  },

  getHistory: (applicationId) => {
    return get()
      .statusHistory.filter((ev) => ev.applicationId === applicationId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },
}))
