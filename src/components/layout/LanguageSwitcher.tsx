import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage, LanguageOption } from '../../i18n/LanguageContext';
import { Language } from '../../types';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full' | 'dropdown';
  className?: string;
  showLabel?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dropdown',
  className = '',
  showLabel = true
}) => {
  const { language, setLanguage, availableLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = availableLanguages.find((l) => l.code === language) || availableLanguages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded-lg ${className}`}>
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            title={`${lang.name} (${lang.nativeName})`}
            className={`px-2 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              language === lang.code
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>{lang.flag}</span>
            <span className="uppercase text-[11px] font-mono">{lang.code}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('switch_language')}
        title={t('switch_language')}
        className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700/90 border border-slate-700/80 rounded-lg transition-colors cursor-pointer"
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        {showLabel && (
          <span className="font-semibold text-slate-100 hidden sm:inline">
            {currentLang.nativeName}
          </span>
        )}
        <span className="text-[11px] uppercase font-mono text-slate-400 sm:hidden">
          {currentLang.code}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-teal-400" />
                {t('switch_language')}
              </span>
              <span className="text-[10px] text-teal-400 font-mono">{availableLanguages.length} Languages</span>
            </div>
          </div>

          <div className="py-1">
            {availableLanguages.map((lang: LanguageOption) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800 transition-colors cursor-pointer ${
                    isSelected ? 'bg-slate-800/80 text-teal-300 font-semibold' : 'text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-100">{lang.name}</span>
                      <span className="text-[10px] text-slate-400">{lang.nativeName}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-teal-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="mt-1 pt-2 px-3 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-teal-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              <span>React i18n + GTranslate Synced</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Instant UI localization for English, Kinyarwanda & French.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
