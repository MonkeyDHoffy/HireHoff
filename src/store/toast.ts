/**
 * ApplyHoff — Toast Store
 *
 * Global toast notification state managed by Zustand.
 * Supports success, error, and info variants.
 */

import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info';

interface ToastState {
  visible: boolean;
  message: string;
  variant: ToastVariant;
  undoAction: (() => void) | null;
  show: (message: string, variant?: ToastVariant, undoAction?: () => void) => void;
  hide: () => void;
  undo: () => void;
}

let hideTimeout: ReturnType<typeof setTimeout> | null = null;

export const useToast = create<ToastState>((set, get) => ({
  visible: false,
  message: '',
  variant: 'success',
  undoAction: null,

  show: (message, variant = 'success', undoAction) => {
    if (hideTimeout) clearTimeout(hideTimeout);
    set({ visible: true, message, variant, undoAction: undoAction ?? null });
    const duration = undoAction ? 4000 : 2500;
    hideTimeout = setTimeout(() => {
      set({ visible: false, undoAction: null });
      hideTimeout = null;
    }, duration);
  },

  hide: () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    set({ visible: false, undoAction: null });
  },

  undo: () => {
    const action = get().undoAction;
    if (action) {
      action();
      if (hideTimeout) clearTimeout(hideTimeout);
      set({ visible: false, undoAction: null });
    }
  },
}));
