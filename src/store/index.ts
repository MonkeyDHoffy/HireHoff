/**
 * ApplyHoff — Zustand Application Store
 *
 * Central state management for job applications.
 * All mutations are persisted to SQLite automatically.
 */

import { create } from 'zustand';
import {
  Application,
  StatusEvent,
  ApplicationStatus,
  generateId,
} from '../types';
import {
  getAllApplications,
  getAllHistory,
  insertApplication,
  updateApplicationInDb,
  deleteApplicationFromDb,
  insertStatusEvent,
} from '../db';

// --- Store Types ---

interface ApplicationStore {
  /** All stored applications */
  applications: Application[];
  /** Status change history for all applications */
  statusHistory: StatusEvent[];
  /** Whether the store has loaded data from SQLite */
  hydrated: boolean;

  // --- Actions ---

  /** Load data from SQLite into the store */
  hydrate: () => Promise<void>;

  /** Add a new application */
  addApplication: (
    data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>,
    initialNote?: string
  ) => Promise<string>;

  /** Update an existing application (partial update) */
  updateApplication: (
    id: string,
    data: Partial<Omit<Application, 'id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<void>;

  /** Delete an application and its history */
  deleteApplication: (id: string) => Promise<void>;

  /** Change the status of an application (creates a history entry) */
  changeStatus: (
    id: string,
    newStatus: ApplicationStatus,
    note?: string
  ) => Promise<void>;

  /** Get a single application by ID */
  getApplication: (id: string) => Application | undefined;

  /** Get status history for a specific application */
  getHistory: (applicationId: string) => StatusEvent[];
}

// --- Store ---

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  applications: [],
  statusHistory: [],
  hydrated: false,

  hydrate: async () => {
    const [applications, statusHistory] = await Promise.all([
      getAllApplications(),
      getAllHistory(),
    ]);
    set({ applications, statusHistory, hydrated: true });
  },

  addApplication: async (data, initialNote) => {
    const now = new Date().toISOString();
    const id = generateId();
    const newApp: Application = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };

    const statusEvent: StatusEvent = {
      id: generateId(),
      applicationId: id,
      fromStatus: null,
      toStatus: data.status,
      note: initialNote ?? 'Application created',
      createdAt: now,
    };

    // Persist to SQLite
    await insertApplication(newApp);
    await insertStatusEvent(statusEvent);

    set((state) => ({
      applications: [newApp, ...state.applications],
      statusHistory: [statusEvent, ...state.statusHistory],
    }));

    return id;
  },

  updateApplication: async (id, data) => {
    const updatedAt = new Date().toISOString();

    await updateApplicationInDb(id, { ...data, updatedAt });

    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...data, updatedAt } : app
      ),
    }));
  },

  deleteApplication: async (id) => {
    await deleteApplicationFromDb(id);

    set((state) => ({
      applications: state.applications.filter((app) => app.id !== id),
      statusHistory: state.statusHistory.filter(
        (ev) => ev.applicationId !== id
      ),
    }));
  },

  changeStatus: async (id, newStatus, note = '') => {
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

    await updateApplicationInDb(id, { status: newStatus, updatedAt: now });
    await insertStatusEvent(statusEvent);

    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id ? { ...a, status: newStatus, updatedAt: now } : a
      ),
      statusHistory: [statusEvent, ...state.statusHistory],
    }));
  },

  getApplication: (id) => {
    return get().applications.find((a) => a.id === id);
  },

  getHistory: (applicationId) => {
    return get()
      .statusHistory.filter((ev) => ev.applicationId === applicationId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },
}));

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
