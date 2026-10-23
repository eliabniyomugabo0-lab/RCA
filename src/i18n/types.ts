export type Language = 'en' | 'rw' | 'fr' | 'sw';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  tagline: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    tagline: 'Standard Operations & International Cricket'
  },
  {
    code: 'rw',
    name: 'Kinyarwanda',
    nativeName: 'Ikinyarwanda',
    flag: '🇷🇼',
    tagline: 'Ururimi rw\'Igihugu · Sitade ya Gahanga'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    tagline: 'Langue Officielle du Rwanda & Administration'
  },
  {
    code: 'sw',
    name: 'Kiswahili',
    nativeName: 'Kiswahili',
    flag: '🇹🇿',
    tagline: 'Lugha Rasmi ya Jumuiya ya Afrika Mashariki'
  }
];
