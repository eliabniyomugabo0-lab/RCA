import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Language, SUPPORTED_LANGUAGES, LanguageInfo } from '../i18n/types';
import { TRANSLATIONS } from '../i18n/translations';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { Task, DirectMessage, Announcement, InventoryItem, CalendarEvent } from '../types';
import {
  translateEntityText,
  translateTaskEntity,
  translateMessageEntity,
  translateAnnouncementEntity,
  translateInventoryEntity,
  translateEventEntity
} from '../i18n/contentTranslations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
  translateText: (text: string) => string;
  translateTask: (task: Task) => Task;
  translateTasks: (tasks: Task[]) => Task[];
  translateMessage: (msg: DirectMessage) => DirectMessage;
  translateMessages: (msgs: DirectMessage[]) => DirectMessage[];
  translateAnnouncement: (anc: Announcement) => Announcement;
  translateAnnouncements: (ancs: Announcement[]) => Announcement[];
  translateInventoryItem: (item: InventoryItem) => InventoryItem;
  translateInventory: (items: InventoryItem[]) => InventoryItem[];
  translateEvent: (event: CalendarEvent) => CalendarEvent;
  translateEvents: (events: CalendarEvent[]) => CalendarEvent[];
  supportedLanguages: LanguageInfo[];
  currentLanguageInfo: LanguageInfo;
  isGTranslateActive: boolean;
  toggleGTranslate: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to configure Google Translate cookies and triggers for entire system DOM translation
export function applyGoogleTranslate(targetLang: Language) {
  try {
    const isEn = targetLang === 'en';
    const cookieVal = isEn ? '' : `/auto/${targetLang}`;

    // 1. Root-level cookie (effective for localhost and all hosts)
    if (isEn) {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=/en/en; path=/;';
    } else {
      document.cookie = `googtrans=${cookieVal}; path=/;`;
      document.cookie = `googtrans=/en/${targetLang}; path=/;`;
    }

    // 2. Domain-level cookie (only for standard FQDNs with dots, avoiding localhost rejection)
    const host = window.location.hostname;
    if (host && host.includes('.')) {
      if (isEn) {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${host}`;
        document.cookie = `googtrans=/en/en; path=/; domain=.${host}`;
      } else {
        document.cookie = `googtrans=${cookieVal}; path=/; domain=.${host}`;
        document.cookie = `googtrans=/en/${targetLang}; path=/; domain=.${host}`;
      }
    }

    // 3. Trigger Google Translate select element if loaded in DOM
    const triggerCombo = (): boolean => {
      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (combo) {
        combo.value = isEn ? '' : targetLang;
        combo.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
      return false;
    };

    // Attempt immediately and retry periodically until Google's script mounts the combo
    if (!triggerCombo()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (triggerCombo() || attempts > 25) {
          clearInterval(interval);
        }
      }, 200);
    }
  } catch (err) {
    console.debug('Google Translate trigger note:', err);
  }
}

// Dynamically ensure Google Translate script is in document if not loaded
function ensureGoogleTranslateScriptLoaded() {
  if (document.getElementById('google-translate-script')) return;

  const script = document.createElement('script');
  script.id = 'google-translate-script';
  script.type = 'text/javascript';
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;

  (window as any).googleTranslateElementInit = () => {
    try {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,rw,fr,sw',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        'google_translate_element'
      );
    } catch (e) {
      console.debug('GTranslate element init error:', e);
    }
  };

  document.body.appendChild(script);
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = loadFromStorage<Language>('gcs_language', 'en');
    return ['en', 'rw', 'fr', 'sw'].includes(saved) ? saved : 'en';
  });

  const [isGTranslateActive, setIsGTranslateActive] = useState<boolean>(() => {
    return loadFromStorage<boolean>('gcs_gtranslate_active', true);
  });

  // Keep HTML lang attribute, localStorage, and Google Translate in sync
  useEffect(() => {
    document.documentElement.lang = language;
    saveToStorage('gcs_language', language);
    ensureGoogleTranslateScriptLoaded();

    if (language !== 'en' || isGTranslateActive) {
      applyGoogleTranslate(language);
    }
  }, [language, isGTranslateActive]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    document.documentElement.lang = newLang;
    saveToStorage('gcs_language', newLang);
    applyGoogleTranslate(newLang);
  };

  const toggleGTranslate = () => {
    const nextVal = !isGTranslateActive;
    setIsGTranslateActive(nextVal);
    saveToStorage('gcs_gtranslate_active', nextVal);
    if (nextVal) {
      applyGoogleTranslate(language);
    }
  };

  const t = useCallback((key: string, defaultText?: string): string => {
    const currentDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (currentDict && currentDict[key]) {
      return currentDict[key];
    }
    // Fallback to English dictionary
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    // Default text fallback or key itself
    return defaultText !== undefined ? defaultText : key;
  }, [language]);

  // Content entity translation helpers
  const translateText = useCallback((text: string): string => {
    return translateEntityText(text, language);
  }, [language]);

  const translateTask = useCallback((task: Task): Task => {
    return translateTaskEntity(task, language);
  }, [language]);

  const translateTasks = useCallback((tasks: Task[]): Task[] => {
    if (language === 'en') return tasks;
    return tasks.map((task) => translateTaskEntity(task, language));
  }, [language]);

  const translateMessage = useCallback((msg: DirectMessage): DirectMessage => {
    return translateMessageEntity(msg, language);
  }, [language]);

  const translateMessages = useCallback((msgs: DirectMessage[]): DirectMessage[] => {
    if (language === 'en') return msgs;
    return msgs.map((msg) => translateMessageEntity(msg, language));
  }, [language]);

  const translateAnnouncement = useCallback((anc: Announcement): Announcement => {
    return translateAnnouncementEntity(anc, language);
  }, [language]);

  const translateAnnouncements = useCallback((ancs: Announcement[]): Announcement[] => {
    if (language === 'en') return ancs;
    return ancs.map((anc) => translateAnnouncementEntity(anc, language));
  }, [language]);

  const translateInventoryItem = useCallback((item: InventoryItem): InventoryItem => {
    return translateInventoryEntity(item, language);
  }, [language]);

  const translateInventory = useCallback((items: InventoryItem[]): InventoryItem[] => {
    if (language === 'en') return items;
    return items.map((item) => translateInventoryEntity(item, language));
  }, [language]);

  const translateEvent = useCallback((event: CalendarEvent): CalendarEvent => {
    return translateEventEntity(event, language);
  }, [language]);

  const translateEvents = useCallback((events: CalendarEvent[]): CalendarEvent[] => {
    if (language === 'en') return events;
    return events.map((event) => translateEventEntity(event, language));
  }, [language]);

  const currentLanguageInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translateText,
        translateTask,
        translateTasks,
        translateMessage,
        translateMessages,
        translateAnnouncement,
        translateAnnouncements,
        translateInventoryItem,
        translateInventory,
        translateEvent,
        translateEvents,
        supportedLanguages: SUPPORTED_LANGUAGES,
        currentLanguageInfo,
        isGTranslateActive,
        toggleGTranslate
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
