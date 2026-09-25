import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import { Language } from '../../types';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageDropdownProps {
  variant?: 'light' | 'dark';
  align?: 'left' | 'right' | 'auto';
  className?: string;
}

const LANGUAGES: { code: Language; label: string; native: string; subtitle: string }[] = [
  { code: 'en', label: 'English', native: 'English', subtitle: 'International' },
  { code: 'ar', label: 'العربية', native: 'Arabic', subtitle: 'لغة القرآن' },
  { code: 'ur', label: 'اردو', native: 'Urdu', subtitle: 'برصغیر' },
  { code: 'hi', label: 'हिन्दी', native: 'Hindi', subtitle: 'भारत' },
  { code: 'bn', label: 'বাংলা', native: 'Bengali', subtitle: 'বাংলাদেশ ও ভারত' },
];

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  variant = 'light',
  align = 'auto',
  className = '',
}) => {
  const { language, setLanguage } = useApp();
  const t = useTranslation(language);
  const rtl = isRTL(language);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Determine alignment
  const isAlignRight = align === 'right' || (align === 'auto' && !rtl);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2 px-3.5 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-xs ${
          variant === 'dark'
            ? 'bg-[#123D28] hover:bg-[#1a4a33] text-[#F3F0E4] border border-[#C89B2E]/40 hover:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/30'
            : 'bg-white hover:bg-[#FAF8F2] text-[#16241A] border border-[#0B2E1C]/15 hover:border-[#2E8B4F]/50 focus:ring-2 focus:ring-[#2E8B4F]/20'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={t('selectLanguage') || 'Select Language'}
      >
        <Globe
          className={`w-4 h-4 transition-transform group-hover:rotate-12 ${
            variant === 'dark' ? 'text-[#FBBF24]' : 'text-[#2E8B4F]'
          }`}
        />
        <span className="uppercase tracking-wider font-extrabold">{language}</span>
        <span className={`text-xs opacity-75 hidden md:inline font-medium ${variant === 'dark' ? 'text-[#9FB6A3]' : 'text-stone-500'}`}>
          ({currentLangObj.native})
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${variant === 'dark' ? 'text-[#FBBF24]/80' : 'text-stone-500'}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute ${
            isAlignRight ? 'right-0' : 'left-0'
          } mt-2.5 w-60 rounded-3xl p-2 z-50 shadow-2xl border transition-all animate-in fade-in zoom-in-95 duration-150 ${
            variant === 'dark'
              ? 'bg-[#0B2E1C]/98 backdrop-blur-xl border-[#C89B2E]/40 text-[#F3F0E4] divide-y divide-[#123D28]'
              : 'bg-white/98 backdrop-blur-xl border-stone-200/90 text-[#16241A] divide-y divide-stone-100'
          }`}
          role="menu"
        >
          {/* Header Title inside Dropdown */}
          <div className="px-3 py-2">
            <p
              className={`text-[11px] font-black uppercase tracking-widest ${
                variant === 'dark' ? 'text-[#FBBF24]' : 'text-[#2E8B4F]'
              }`}
            >
              {t('selectLanguage') || 'Select Language'}
            </p>
          </div>

          {/* Language Options List */}
          <div className="py-1.5 space-y-1">
            {LANGUAGES.map((item) => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? variant === 'dark'
                        ? 'bg-[#123D28] text-[#FBBF24] font-black border border-[#C89B2E]/50 shadow-inner'
                        : 'bg-[#E1F2E7] text-[#0B2E1C] font-black border border-[#2E8B4F]/30 shadow-xs'
                      : variant === 'dark'
                      ? 'text-[#F3F0E4] hover:bg-[#123D28]/60 font-semibold'
                      : 'text-stone-700 hover:bg-[#FAF8F2] font-semibold'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black uppercase ${
                        isSelected
                          ? variant === 'dark'
                            ? 'bg-[#FBBF24] text-[#0B2E1C]'
                            : 'bg-[#2E8B4F] text-white'
                          : variant === 'dark'
                          ? 'bg-[#123D28] text-[#9FB6A3]'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {item.code}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold">{item.label}</span>
                        {item.native !== item.label && (
                          <span
                            className={`text-xs font-medium ${
                              variant === 'dark' ? 'text-[#9FB6A3]' : 'text-stone-400'
                            }`}
                          >
                            ({item.native})
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] block font-medium ${
                          variant === 'dark' ? 'text-[#9FB6A3]/70' : 'text-stone-400'
                        }`}
                      >
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        variant === 'dark'
                          ? 'bg-[#FBBF24] text-[#0B2E1C]'
                          : 'bg-[#2E8B4F] text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
