import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, Sparkles, ChevronDown } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { Language } from '../../i18n/types';

interface LanguageSelectorProps {
  variant?: 'navbar' | 'landing' | 'compact' | 'drawer';
  className?: string;
  onLanguageChange?: (lang: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'navbar',
  className = '',
  onLanguageChange
}) => {
  const {
    language,
    setLanguage,
    t,
    supportedLanguages,
    currentLanguageInfo,
    isGTranslateActive,
    toggleGTranslate
  } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    if (onLanguageChange) {
      onLanguageChange(code);
    }
    setIsOpen(false);
  };

  // Button styling variants
  let buttonClasses = 'flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ';
  if (variant === 'landing') {
    buttonClasses += 'text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 shadow-xs hover:border-teal-500/50';
  } else if (variant === 'compact') {
    buttonClasses += 'p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg';
  } else if (variant === 'drawer') {
    buttonClasses += 'w-full justify-between p-2.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80';
  } else {
    // Default navbar
    buttonClasses += 'text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700';
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
        aria-label="Select system language"
        title={`Language: ${currentLanguageInfo.nativeName} (${currentLanguageInfo.name})`}
      >
        <span className="text-sm select-none">{currentLanguageInfo.flag}</span>
        {variant !== 'compact' && (
          <span className="font-semibold text-white whitespace-nowrap">
            {currentLanguageInfo.code.toUpperCase()}
          </span>
        )}
        {variant === 'drawer' && (
          <span className="text-xs text-slate-400 truncate">
            {currentLanguageInfo.nativeName}
          </span>
        )}
        <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 divide-y divide-slate-800">
          {/* Header */}
          <div className="px-3.5 py-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-400">
                {t('lang.select', 'Select Language')}
              </p>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full font-mono">
                4 Languages
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              English · Ikinyarwanda · Français · Kiswahili
            </p>
            <p className="text-[10px] text-teal-300 mt-1 flex items-center gap-1.5 leading-snug">
              <Sparkles className="w-3 h-3 text-teal-400 shrink-0" />
              <span>{t('lang.auto_sync_notice', 'Auto-translates tasks, comments, messages, fixtures & inventory')}</span>
            </p>
          </div>

          {/* Language Options */}
          <div className="py-1">
            {supportedLanguages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-slate-800/80 transition-colors cursor-pointer ${
                    isSelected ? 'bg-slate-800/90 text-teal-300' : 'text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0 select-none">{lang.flag}</span>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">
                          {lang.nativeName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({lang.name})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {lang.tagline}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-teal-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Google Translate Hybrid Engine Bridge */}
          <div className="px-3.5 py-2.5 bg-slate-950/60">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Google Translate Live Bridge</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  {t('lang.gtranslate_desc', 'Machine-translates custom entries, announcements & remarks dynamically')}
                </p>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={toggleGTranslate}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isGTranslateActive ? 'bg-teal-500' : 'bg-slate-700'
                }`}
                title="Toggle Google Translate live machine translation engine"
                aria-pressed={isGTranslateActive}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isGTranslateActive ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Engine: {isGTranslateActive ? 'GTranslate + Native' : 'Native Dict (Instant)'}</span>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${isGTranslateActive ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
