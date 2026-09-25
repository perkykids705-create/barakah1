/**
 * Multilingual Phonetic Keyboard Engine
 * Provides instant in-browser transliteration for Urdu, Arabic, Hindi, and Bengali.
 * When a user types on their standard Latin/QWERTY keyboard, this intercepts input
 * and produces genuine native script characters.
 */

import { Language } from '../types';

export interface KeyMapping {
  char: string;
  name: string;
  qwertyKey: string;
}

// Urdu Phonetic Keyboard Layout (Pak Urdu Installer / CRULP Standard)
export const URDU_PHONETIC_MAP: Record<string, string> = {
  // Lowercase keys
  'a': 'ا', // Alif
  'b': 'ب', // Bay
  'c': 'چ', // Chay
  'd': 'د', // Daal
  'e': 'ع', // Ain
  'f': 'ف', // Fay
  'g': 'گ', // Gaaf
  'h': 'ھ', // Do Chashmi He
  'i': 'ی', // Choti Ye
  'j': 'ج', // Jeem
  'k': 'ک', // Kaaf
  'l': 'ل', // Laam
  'm': 'م', // Meem
  'n': 'ن', // Noon
  'o': 'ہ', // Gol / Choti He
  'p': 'پ', // Pay
  'q': 'ق', // Qaaf
  'r': 'ر', // Ray
  's': 'س', // Seen
  't': 'ت', // Tay
  'u': 'ء', // Hamza
  'v': 'ط', // Toyen
  'w': 'و', // Waao
  'x': 'ش', // Sheen
  'y': 'ے', // Bari Ye
  'z': 'ز', // Zay

  // Uppercase / Shift keys
  'A': 'آ', // Alif Madd
  'B': '﷽', // Bismillah or Bay
  'C': 'ث', // Say
  'D': 'ڈ', // Daal hard (Ddaal)
  'E': 'ؑ', // Alaihis-Salam
  'F': 'ف', // Fay
  'G': 'غ', // Ghain
  'H': 'ح', // Bari He
  'I': 'ٰ', // Khari Zabar
  'J': 'ض', // Zuaad
  'K': 'خ', // Khay
  'L': 'ل', // Laam
  'M': 'ؐ', // Sallallahu alaihi wasallam
  'N': 'ں', // Noon Ghunna
  'O': 'ۃ', // Te Marbuta
  'P': 'ُ', // Pesh
  'Q': 'ق', // Qaaf
  'R': 'ڑ', // Aray hard
  'S': 'ص', // Suad
  'T': 'ٹ', // Tay hard (Ttay)
  'U': 'ئ', // Hamza Ye
  'V': 'ظ', // Zoyen
  'W': 'ؤ', // Wao with Hamza
  'X': 'ژ', // Zhaye
  'Y': 'ي', // Arabic Yeh
  'Z': 'ذ', // Zaal

  // Punctuation and symbols
  '?': '؟', // Urdu question mark
  ',': '،', // Urdu comma
  ';': '؛', // Urdu semicolon
  '%': '٪', // Urdu percent
  '*': '٭', // Urdu asterisk
};

// Urdu Digits
export const URDU_DIGITS_MAP: Record<string, string> = {
  '0': '۰',
  '1': '۱',
  '2': '۲',
  '3': '۳',
  '4': '۴',
  '5': '۵',
  '6': '۶',
  '7': '۷',
  '8': '۸',
  '9': '۹',
};

// Arabic Phonetic / Standard Map
export const ARABIC_PHONETIC_MAP: Record<string, string> = {
  'a': 'ا',
  'A': 'أ',
  'b': 'ب',
  'c': 'ش',
  'C': 'ث',
  'd': 'د',
  'D': 'ض',
  'e': 'ع',
  'E': 'إ',
  'f': 'ف',
  'g': 'غ',
  'h': 'ه',
  'H': 'ح',
  'i': 'ي',
  'I': 'ئ',
  'j': 'ج',
  'k': 'ك',
  'l': 'ل',
  'm': 'م',
  'n': 'ن',
  'o': 'ة',
  'p': 'ب',
  'q': 'ق',
  'r': 'ر',
  's': 'س',
  'S': 'ص',
  't': 'ت',
  'T': 'ط',
  'u': 'ء',
  'U': 'ؤ',
  'v': 'ث',
  'w': 'و',
  'W': 'ؤ',
  'x': 'خ',
  'y': 'ى',
  'Y': 'ي',
  'z': 'ز',
  'Z': 'ظ',
  '?': '؟',
  ',': '،',
  ';': '؛',
};

// Hindi Phonetic Map
export const HINDI_PHONETIC_MAP: Record<string, string> = {
  'a': 'अ',
  'A': 'आ',
  'i': 'इ',
  'I': 'ई',
  'u': 'उ',
  'U': 'ऊ',
  'e': 'ए',
  'E': 'ऐ',
  'o': 'ओ',
  'O': 'औ',
  'k': 'क',
  'K': 'ख',
  'g': 'ग',
  'G': 'घ',
  'c': 'च',
  'C': 'छ',
  'j': 'ज',
  'J': 'झ',
  't': 'त',
  'T': 'ट',
  'd': 'द',
  'D': 'ड',
  'n': 'न',
  'N': 'ण',
  'p': 'प',
  'P': 'फ',
  'b': 'ब',
  'B': 'भ',
  'm': 'म',
  'y': 'य',
  'r': 'र',
  'l': 'ल',
  'v': 'व',
  'w': 'व',
  's': 'स',
  'S': 'श',
  'R': 'ष',
  'h': 'ह',
  'M': 'ं',
  'H': 'ः',
  '?': '?',
  ',': ',',
};

// Bengali Phonetic Map
export const BENGALI_PHONETIC_MAP: Record<string, string> = {
  'a': 'অ',
  'A': 'আ',
  'i': 'ই',
  'I': 'ঈ',
  'u': 'উ',
  'U': 'ঊ',
  'e': 'এ',
  'o': 'ও',
  'k': 'ক',
  'K': 'খ',
  'g': 'গ',
  'G': 'ঘ',
  'c': 'চ',
  'C': 'ছ',
  'j': 'জ',
  'J': 'ঝ',
  't': 'ত',
  'T': 'ট',
  'd': 'দ',
  'D': 'ড',
  'n': 'ন',
  'N': 'ণ',
  'p': 'প',
  'P': 'ফ',
  'b': 'ব',
  'B': 'ভ',
  'm': 'ম',
  'y': 'য',
  'r': 'র',
  'l': 'ল',
  's': 'স',
  'S': 'শ',
  'h': 'হ',
};

// Quick Islamic and common phrases for instant 1-tap typing
export const QUICK_ISLAMIC_PHRASES: Record<Language, string[]> = {
  ur: [
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    'الْحَمْدُ لِلَّهِ',
    'سُبْحَانَ اللَّهِ',
    'مَا شَاءَ اللَّهُ',
    'إِنْ شَاءَ اللَّهُ',
    'جَزَاكَ اللَّهُ خَيْرًا',
    'رَمَضَان مُبَارَك',
    'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
    'وَعَلَيْكُمُ السَّلَامُ',
    'آمِين يَا رَبَّ الْعَالَمِينَ',
    'أَسْتَغْفِرُ اللَّهَ',
    'لَا إِلَٰهَ إِلَّا اللَّهُ',
    'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
  ],
  ar: [
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    'مَا شَاءَ اللَّهُ تَبَارَكَ اللَّهُ',
    'إِنْ شَاءَ اللَّهُ تَعَالَى',
    'جَزَاكَ اللَّهُ خَيْرًا',
    'رَمَضَان كَرِيم',
    'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
    'آمِينَ يَا رَبَّ الْعَالَمِينَ',
    'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ',
  ],
  hi: [
    'बिस्मिल्लाहिर्रहमानिर्रहीम',
    'अल्हम्दुलिल्लाह',
    'सुब्हानअल्लाह',
    'माशाअल्लाह',
    'इंशाअल्लाह',
    'जज़ाकअल्लाह ख़ैर',
    'रमज़ान मुबारक',
    'अस्सलाम वालेकुम',
    'आमीन या रब्बल आलमीन',
  ],
  bn: [
    'বিসমিল্লাহির রাহমানির রাহিম',
    'আলহামদুলিল্লাহ',
    'সুবহানাল্লাহ',
    'মাশাআল্লাহ',
    'ইনশাআল্লাহ',
    'জাজাকাল্লাহু খাইরান',
    'রমজান মোবারক',
    'আসসালামু আলাইকুম',
    'আমিন ইয়া রব্বুল আলামিন',
  ],
  en: [
    'Bismillah',
    'Alhamdulillah',
    'SubhanAllah',
    'MashaAllah',
    'InshaAllah',
    'JazakAllah Khair',
    'Ramadan Mubarak',
    'As-salamu alaykum',
    'Ameen',
  ],
};

/**
 * Returns mapped character for the key in the given language
 */
export function getMappedChar(key: string, lang: Language, convertDigits: boolean = false): string | null {
  if (lang === 'en') return null;

  // Handle digits if digit conversion is requested
  if (convertDigits && lang === 'ur' && URDU_DIGITS_MAP[key]) {
    return URDU_DIGITS_MAP[key];
  }

  switch (lang) {
    case 'ur':
      return URDU_PHONETIC_MAP[key] || null;
    case 'ar':
      return ARABIC_PHONETIC_MAP[key] || null;
    case 'hi':
      return HINDI_PHONETIC_MAP[key] || null;
    case 'bn':
      return BENGALI_PHONETIC_MAP[key] || null;
    default:
      return null;
  }
}

/**
 * Inserts text into the currently active or specified input/textarea element
 * while preserving React synthetic events and browser undo/redo history.
 */
export function insertTextIntoActiveElement(text: string, targetEl?: HTMLElement | null): boolean {
  const el = targetEl || (document.activeElement as HTMLElement | null);
  if (!el) return false;

  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    if (el.readOnly || el.disabled) return false;

    // Give focus back to the target element
    el.focus();

    // 1. Try document.execCommand('insertText') which integrates with native undo/redo & events
    let succeeded = false;
    try {
      succeeded = document.execCommand('insertText', false, text);
    } catch {
      succeeded = false;
    }

    // 2. Fallback to prototype value setter if execCommand failed
    if (!succeeded) {
      const start = el.selectionStart ?? el.value.length;
      const end = el.selectionEnd ?? el.value.length;
      const currentVal = el.value;
      const nextVal = currentVal.slice(0, start) + text + currentVal.slice(end);

      const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
      if (descriptor && descriptor.set) {
        descriptor.set.call(el, nextVal);
      } else {
        el.value = nextVal;
      }

      const newPos = start + text.length;
      el.setSelectionRange(newPos, newPos);

      // Dispatch standard input and change events so React picks up the state update
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    return true;
  }

  return false;
}
