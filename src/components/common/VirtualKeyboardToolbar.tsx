import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  getMappedChar,
  insertTextIntoActiveElement,
  QUICK_ISLAMIC_PHRASES,
  URDU_PHONETIC_MAP,
  ARABIC_PHONETIC_MAP,
  HINDI_PHONETIC_MAP,
  BENGALI_PHONETIC_MAP,
  URDU_DIGITS_MAP,
} from '../../services/phoneticKeyboard';
import {
  Keyboard,
  ToggleLeft,
  ToggleRight,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Delete,
  Space,
  X,
  Info,
} from 'lucide-react';

export const VirtualKeyboardToolbar: React.FC = () => {
  const { language } = useApp();

  // Phonetic typing enabled state (active by default for non-English languages)
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
  const [isShiftActive, setIsShiftActive] = useState<boolean>(false);
  const [showPhrases, setShowPhrases] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'letters' | 'digits' | 'phrases'>('letters');

  // Track the most recently focused input/textarea so virtual buttons type into it
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  // Focus listener to retain active element
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
      ) {
        lastActiveElementRef.current = target;
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  // Global keydown interceptor for hardware keyboard typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle shortcut: Ctrl + Space or Alt + K
      if ((e.ctrlKey && e.code === 'Space') || (e.altKey && (e.key === 'k' || e.key === 'K'))) {
        e.preventDefault();
        setIsEnabled((prev) => !prev);
        return;
      }

      // If phonetic mode is toggled off or language is English, let default typing happen
      if (!isEnabled || language === 'en') {
        return;
      }

      // Do not intercept if Ctrl, Alt, or Meta keys are held (allow Ctrl+C, Ctrl+V, Ctrl+Z, etc.)
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      const activeEl = document.activeElement;
      if (
        !activeEl ||
        !(activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement)
      ) {
        return;
      }

      // Exclude non-text inputs such as password, email, number, date, time
      if (activeEl.getAttribute('data-no-phonetic') === 'true') {
        return;
      }

      if (activeEl instanceof HTMLInputElement) {
        const type = (activeEl.type || 'text').toLowerCase();
        if (
          [
            'password',
            'email',
            'number',
            'date',
            'time',
            'datetime-local',
            'file',
            'color',
            'range',
          ].includes(type)
        ) {
          return;
        }
      }

      // Single printable character
      if (e.key && e.key.length === 1) {
        const mapped = getMappedChar(e.key, language, false);
        if (mapped) {
          e.preventDefault();
          insertTextIntoActiveElement(mapped, activeEl);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isEnabled, language]);

  // If language is English, do not display the toolbar
  if (language === 'en') {
    return null;
  }

  // Language name badge
  const langLabels: Record<string, { name: string; native: string; font: string }> = {
    ur: { name: 'Urdu', native: 'اردو فونیتک کی بورڈ', font: 'font-urdu' },
    ar: { name: 'Arabic', native: 'لوحة المفاتيح الصوتية العربية', font: 'font-arabic' },
    hi: { name: 'Hindi', native: 'हिंदी फोनेटिक कीबोर्ड', font: 'font-hindi' },
    bn: { name: 'Bengali', native: 'বাংলা ফোনেটিক কীবোর্ড', font: 'font-bengali' },
  };

  const currentLangMeta = langLabels[language] || {
    name: 'Phonetic',
    native: 'فونیتک کی بورڈ',
    font: 'font-urdu',
  };

  // Keys for visual on-screen keyboard
  const getVisualKeys = () => {
    if (language === 'ur') {
      return isShiftActive
        ? [
            { key: 'A', char: 'آ', sub: 'A' },
            { key: 'B', char: '﷽', sub: 'B' },
            { key: 'C', char: 'ث', sub: 'C' },
            { key: 'D', char: 'ڈ', sub: 'D' },
            { key: 'E', char: 'ؑ', sub: 'E' },
            { key: 'G', char: 'غ', sub: 'G' },
            { key: 'H', char: 'ح', sub: 'H' },
            { key: 'I', char: 'ٰ', sub: 'I' },
            { key: 'J', char: 'ض', sub: 'J' },
            { key: 'K', char: 'خ', sub: 'K' },
            { key: 'N', char: 'ں', sub: 'N' },
            { key: 'O', char: 'ۃ', sub: 'O' },
            { key: 'P', char: 'ُ', sub: 'P' },
            { key: 'R', char: 'ڑ', sub: 'R' },
            { key: 'S', char: 'ص', sub: 'S' },
            { key: 'T', char: 'ٹ', sub: 'T' },
            { key: 'U', char: 'ئ', sub: 'U' },
            { key: 'V', char: 'ظ', sub: 'V' },
            { key: 'W', char: 'ؤ', sub: 'W' },
            { key: 'X', char: 'ژ', sub: 'X' },
            { key: 'Y', char: 'ي', sub: 'Y' },
            { key: 'Z', char: 'ذ', sub: 'Z' },
            { key: '?', char: '؟', sub: '?' },
            { key: ',', char: '،', sub: ',' },
            { key: ';', char: '؛', sub: ';' },
          ]
        : [
            { key: 'a', char: 'ا', sub: 'a' },
            { key: 'b', char: 'ب', sub: 'b' },
            { key: 'p', char: 'پ', sub: 'p' },
            { key: 't', char: 'ت', sub: 't' },
            { key: 's', char: 'س', sub: 's' },
            { key: 'j', char: 'ج', sub: 'j' },
            { key: 'c', char: 'چ', sub: 'c' },
            { key: 'h', char: 'ھ', sub: 'h' },
            { key: 'd', char: 'د', sub: 'd' },
            { key: 'r', char: 'ر', sub: 'r' },
            { key: 'z', char: 'ز', sub: 'z' },
            { key: 'x', char: 'ش', sub: 'x' },
            { key: 'f', char: 'ف', sub: 'f' },
            { key: 'q', char: 'ق', sub: 'q' },
            { key: 'k', char: 'ک', sub: 'k' },
            { key: 'g', char: 'گ', sub: 'g' },
            { key: 'l', char: 'ل', sub: 'l' },
            { key: 'm', char: 'م', sub: 'm' },
            { key: 'n', char: 'ن', sub: 'n' },
            { key: 'w', char: 'و', sub: 'w' },
            { key: 'o', char: 'ہ', sub: 'o' },
            { key: 'i', char: 'ی', sub: 'i' },
            { key: 'y', char: 'ے', sub: 'y' },
            { key: 'u', char: 'ء', sub: 'u' },
            { key: 'v', char: 'ط', sub: 'v' },
            { key: 'e', char: 'ع', sub: 'e' },
          ];
    } else if (language === 'ar') {
      return Object.entries(ARABIC_PHONETIC_MAP).map(([key, char]) => ({
        key,
        char,
        sub: key,
      }));
    } else if (language === 'hi') {
      return Object.entries(HINDI_PHONETIC_MAP).map(([key, char]) => ({
        key,
        char,
        sub: key,
      }));
    } else {
      return Object.entries(BENGALI_PHONETIC_MAP).map(([key, char]) => ({
        key,
        char,
        sub: key,
      }));
    }
  };

  const handleKeyClick = (char: string) => {
    insertTextIntoActiveElement(char, lastActiveElementRef.current);
  };

  const handleBackspace = () => {
    const el = lastActiveElementRef.current || (document.activeElement as HTMLElement | null);
    if (el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
      el.focus();
      const start = el.selectionStart ?? el.value.length;
      const end = el.selectionEnd ?? el.value.length;
      if (start === end && start > 0) {
        const nextVal = el.value.slice(0, start - 1) + el.value.slice(end);
        el.value = nextVal;
        el.setSelectionRange(start - 1, start - 1);
      } else if (start !== end) {
        const nextVal = el.value.slice(0, start) + el.value.slice(end);
        el.value = nextVal;
        el.setSelectionRange(start, start);
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const handleSpace = () => {
    handleKeyClick(' ');
  };

  const phrases = QUICK_ISLAMIC_PHRASES[language] || QUICK_ISLAMIC_PHRASES.ur;

  return (
    <aside aria-label="Phonetic input assistant" className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50 flex flex-col items-end gap-2 pointer-events-auto">
      {/* EXPANDABLE VIRTUAL KEYBOARD WINDOW */}
      {isKeyboardOpen && (
        <div className="w-[95vw] sm:w-[540px] max-w-[96vw] bg-[#0B2E1C] text-white border-2 border-[#C89B2E] rounded-3xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[#123D28]">
            <div className="flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-[#FBBF24]" />
              <div>
                <h4 className={`text-sm font-bold text-[#F3F0E4] ${currentLangMeta.font}`}>
                  {currentLangMeta.native}
                </h4>
                <p className="text-[10px] text-[#9FB6A3]">
                  Type on physical keyboard or tap keys below (Ctrl+Space to toggle)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsEnabled(!isEnabled)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors ${
                  isEnabled
                    ? 'bg-[#2E8B4F] text-white'
                    : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
                title="Toggle Phonetic Input"
              >
                {isEnabled ? '✓ اردو فعال' : 'انگریزی (EN)'}
              </button>

              <button
                onClick={() => setIsKeyboardOpen(false)}
                className="p-1.5 text-[#9FB6A3] hover:text-white hover:bg-[#123D28] rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subtabs: Alphabet, Digits, Islamic Phrases */}
          <div className="flex items-center gap-1 mt-2.5 mb-3 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('letters')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                activeTab === 'letters'
                  ? 'bg-[#123D28] text-[#FBBF24] border border-[#C89B2E]/50'
                  : 'text-[#9FB6A3] hover:bg-[#123D28]/60'
              }`}
            >
              حروف (Letters)
            </button>
            <button
              onClick={() => setActiveTab('digits')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                activeTab === 'digits'
                  ? 'bg-[#123D28] text-[#FBBF24] border border-[#C89B2E]/50'
                  : 'text-[#9FB6A3] hover:bg-[#123D28]/60'
              }`}
            >
              ۰-۹ ہندسے (Digits)
            </button>
            <button
              onClick={() => setActiveTab('phrases')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                activeTab === 'phrases'
                  ? 'bg-[#123D28] text-[#FBBF24] border border-[#C89B2E]/50'
                  : 'text-[#9FB6A3] hover:bg-[#123D28]/60'
              }`}
            >
              کلمات و دعائیں (Phrases)
            </button>
          </div>

          {/* TAB 1: LETTERS GRID */}
          {activeTab === 'letters' && (
            <div className="space-y-2">
              <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 max-h-52 overflow-y-auto p-1">
                {getVisualKeys().map(({ key, char, sub }) => (
                  <button
                    key={`${key}-${char}`}
                    type="button"
                    onClick={() => handleKeyClick(char)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#123D28] hover:bg-[#1c5035] active:scale-95 border border-[#C89B2E]/20 text-white font-medium transition-all group"
                  >
                    <span className={`text-base sm:text-lg font-bold leading-none ${currentLangMeta.font}`}>
                      {char}
                    </span>
                    <span className="text-[9px] text-[#9FB6A3] group-hover:text-[#FBBF24] mt-0.5 uppercase">
                      {sub}
                    </span>
                  </button>
                ))}
              </div>

              {/* Bottom Keyboard Controls (Shift, Space, Backspace) */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#123D28]">
                <button
                  type="button"
                  onClick={() => setIsShiftActive(!isShiftActive)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    isShiftActive
                      ? 'bg-[#C89B2E] text-[#0B2E1C]'
                      : 'bg-[#123D28] text-[#9FB6A3] hover:text-white'
                  }`}
                >
                  Shift ⇧
                </button>

                <button
                  type="button"
                  onClick={handleSpace}
                  className="flex-1 py-2 rounded-xl bg-[#123D28] hover:bg-[#1c5035] text-xs font-semibold flex items-center justify-center gap-1.5 text-white"
                >
                  <Space className="w-3.5 h-3.5 text-[#C89B2E]" />
                  <span>فاصلہ (Space)</span>
                </button>

                <button
                  type="button"
                  onClick={handleBackspace}
                  className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-xs font-semibold flex items-center gap-1 text-red-200"
                >
                  <Delete className="w-3.5 h-3.5" />
                  <span>حذف (Backspace)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DIGITS */}
          {activeTab === 'digits' && (
            <div className="grid grid-cols-5 gap-2 p-2">
              {Object.entries(URDU_DIGITS_MAP).map(([eng, ur]) => (
                <button
                  key={eng}
                  type="button"
                  onClick={() => handleKeyClick(ur)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#123D28] hover:bg-[#1c5035] active:scale-95 border border-[#C89B2E]/30 text-white transition-all"
                >
                  <span className={`text-xl font-bold ${currentLangMeta.font}`}>{ur}</span>
                  <span className="text-[10px] text-[#9FB6A3]">{eng}</span>
                </button>
              ))}
            </div>
          )}

          {/* TAB 3: ISLAMIC PHRASES */}
          {activeTab === 'phrases' && (
            <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto p-1">
              {phrases.map((phrase, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleKeyClick(phrase + ' ')}
                  className={`px-3 py-2 rounded-xl bg-[#123D28] hover:bg-[#1c5035] text-white border border-[#C89B2E]/30 text-xs font-bold leading-normal active:scale-95 transition-all ${currentLangMeta.font}`}
                >
                  {phrase}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* COMPACT FLOATING STATUS BAR & TOGGLE PILL */}
      <div className="flex items-center gap-1.5 bg-[#0B2E1C] border border-[#C89B2E] text-white px-3 py-1.5 rounded-2xl shadow-xl backdrop-blur-md">
        {/* Toggle Language Mode */}
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className="flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-90"
          title="Toggle phonetic typing (Ctrl + Space)"
        >
          {isEnabled ? (
            <ToggleRight className="w-5 h-5 text-[#4ADE80]" />
          ) : (
            <ToggleLeft className="w-5 h-5 text-stone-400" />
          )}
          <span className={`text-xs ${isEnabled ? 'text-[#4ADE80]' : 'text-stone-300'}`}>
            {isEnabled ? 'اردو کی بورڈ (ON)' : 'English (OFF)'}
          </span>
        </button>

        <span className="w-px h-4 bg-[#123D28]" />

        {/* Visual Keyboard Drawer Button */}
        <button
          onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
          className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-semibold transition-colors ${
            isKeyboardOpen
              ? 'bg-[#123D28] text-[#FBBF24]'
              : 'text-[#9FB6A3] hover:text-white hover:bg-[#123D28]'
          }`}
          title="Show / Hide On-Screen Visual Keyboard"
        >
          <Keyboard className="w-3.5 h-3.5 text-[#FBBF24]" />
          <span className="hidden sm:inline">کی بورڈ کھولیں</span>
          {isKeyboardOpen ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronUp className="w-3 h-3" />
          )}
        </button>
      </div>
    </aside>
  );
};
