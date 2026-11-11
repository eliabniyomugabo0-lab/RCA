import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, Translations } from './translations';
import { loadFromStorage, saveToStorage } from '../utils/storage';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English (US/UK)', flag: '🇬🇧' },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', flag: '🇷🇼' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'sw', name: 'Kiswahili', nativeName: 'Kiswahili (EAC)', flag: '🇹🇿' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations, fallback?: string) => string;
  translations: Translations;
  availableLanguages: LanguageOption[];
  syncWithGoogleTranslate: (targetLang?: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to set Google Translate cookie across root and host domain
function setGoogTransCookie(lang: Language) {
  try {
    const cookieValue = `/en/${lang}`;
    document.cookie = `googtrans=${cookieValue}; path=/; SameSite=Lax`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}; SameSite=Lax`;
    // If on subdomain
    const hostParts = window.location.hostname.split('.');
    if (hostParts.length > 1) {
      const rootDomain = hostParts.slice(-2).join('.');
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${rootDomain}; SameSite=Lax`;
    }
  } catch {
    // ignore cookie restriction errors
  }
}

// Trigger Google Translate combo dropdown if initialized
function triggerGoogleTranslateCombo(lang: Language) {
  try {
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (combo && combo.value !== lang) {
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
    }
  } catch {
    // ignore
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = loadFromStorage<Language>('gcs_language', 'en');
    return (['en', 'rw', 'fr', 'sw'].includes(saved) ? saved : 'en') as Language;
  });

  const syncWithGoogleTranslate = useCallback((targetLang?: Language) => {
    const lang = targetLang || language;
    setGoogTransCookie(lang);
    triggerGoogleTranslateCombo(lang);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveToStorage('gcs_language', lang);
    document.documentElement.lang = lang;
    setGoogTransCookie(lang);
    triggerGoogleTranslateCombo(lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    saveToStorage('gcs_language', language);
    setGoogTransCookie(language);

    // Check after brief interval when GTranslate script finishes loading
    const timer = setTimeout(() => {
      triggerGoogleTranslateCombo(language);
    }, 1200);

    return () => clearTimeout(timer);
  }, [language]);

  const translations = TRANSLATIONS[language] || TRANSLATIONS.en;

  const t = (key: keyof Translations, fallback?: string): string => {
    return translations[key] || fallback || TRANSLATIONS.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translations,
        availableLanguages: AVAILABLE_LANGUAGES,
        syncWithGoogleTranslate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
