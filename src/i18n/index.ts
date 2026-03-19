/**
 * ApplyHoff — i18n System
 *
 * Lightweight internationalisation with Zustand.
 * Supports English and German with typed translation keys.
 */

import { create } from 'zustand';
import { en, type Translations } from './en';
import { de } from './de';

export type Language = 'en' | 'de';

const translations: Record<Language, Translations> = { en, de };

interface I18nStore {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
}

/**
 * Global i18n store.
 * `t` always points to the active translation object.
 */
export const useI18n = create<I18nStore>((set) => ({
  language: 'en',
  t: en,
  setLanguage: (lang) =>
    set({ language: lang, t: translations[lang] }),
}));

export type { Translations };
