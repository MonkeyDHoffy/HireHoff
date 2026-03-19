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
  show: (message: string, variant?: ToastVariant) => void;
  hide: () => void;
}

let hideTimeout: ReturnType<typeof setTimeout> | null = null;

export const useToast = create<ToastState>((set) => ({
  visible: false,
  message: '',
  variant: 'success',

  show: (message, variant = 'success') => {
    if (hideTimeout) clearTimeout(hideTimeout);
    set({ visible: true, message, variant });
    hideTimeout = setTimeout(() => {
      set({ visible: false });
      hideTimeout = null;
    }, 2500);
  },

  hide: () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    set({ visible: false });
  },
}));
