import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import { calculateNextSpacedRevision } from '../../services/quranData';
import { SurahMeta } from '../../types';
import {
  BookOpen,
  CheckCircle2,
  Calendar,
  Search,
  Bookmark,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Check,
  Award,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Loader2,
  ArrowLeft,
  Settings,
  Music,
} from 'lucide-react';

// Complete static catalog of all 114 Surahs for instant, offline-capable directory access
const ALL_114_SURAH_METAS = [
  { number: 1, name: "Al-Fatihah", arabicName: "الفاتحة", englishTranslation: "The Opening", totalVerses: 7, revelationType: "Meccan", juz: 1 },
  { number: 2, name: "Al-Baqarah", arabicName: "البقرة", englishTranslation: "The Cow", totalVerses: 286, revelationType: "Medinan", juz: 1 },
  { number: 3, name: "Ali 'Imran", arabicName: "آل عمران", englishTranslation: "Family of Imran", totalVerses: 200, revelationType: "Medinan", juz: 3 },
  { number: 4, name: "An-Nisa", arabicName: "النساء", englishTranslation: "The Women", totalVerses: 176, revelationType: "Medinan", juz: 4 },
  { number: 5, name: "Al-Ma'idah", arabicName: "المائدة", englishTranslation: "The Table Spread", totalVerses: 120, revelationType: "Medinan", juz: 6 },
  { number: 6, name: "Al-An'am", arabicName: "الأنعام", englishTranslation: "The Cattle", totalVerses: 165, revelationType: "Meccan", juz: 7 },
  { number: 7, name: "Al-A'raf", arabicName: "الأعراف", englishTranslation: "The Heights", totalVerses: 206, revelationType: "Meccan", juz: 8 },
  { number: 8, name: "Al-Anfal", arabicName: "الأنفال", englishTranslation: "The Spoils of War", totalVerses: 75, revelationType: "Medinan", juz: 9 },
  { number: 9, name: "At-Tawbah", arabicName: "التوبة", englishTranslation: "The Repentance", totalVerses: 129, revelationType: "Medinan", juz: 10 },
  { number: 10, name: "Yunus", arabicName: "يونس", englishTranslation: "Jonah", totalVerses: 109, revelationType: "Meccan", juz: 11 },
  { number: 11, name: "Hud", arabicName: "هود", englishTranslation: "Hud", totalVerses: 123, revelationType: "Meccan", juz: 11 },
  { number: 12, name: "Yusuf", arabicName: "يوسف", englishTranslation: "Joseph", totalVerses: 111, revelationType: "Meccan", juz: 12 },
  { number: 13, name: "Ar-Ra'd", arabicName: "الرعد", englishTranslation: "The Thunder", totalVerses: 43, revelationType: "Medinan", juz: 13 },
  { number: 14, name: "Ibrahim", arabicName: "إبراهيم", englishTranslation: "Abraham", totalVerses: 52, revelationType: "Meccan", juz: 13 },
  { number: 15, name: "Al-Hijr", arabicName: "الحجر", englishTranslation: "The Rocky Tract", totalVerses: 99, revelationType: "Meccan", juz: 14 },
  { number: 16, name: "An-Nahl", arabicName: "النحل", englishTranslation: "The Bee", totalVerses: 128, revelationType: "Meccan", juz: 14 },
  { number: 17, name: "Al-Isra", arabicName: "الإسراء", englishTranslation: "The Night Journey", totalVerses: 111, revelationType: "Meccan", juz: 15 },
  { number: 18, name: "Al-Kahf", arabicName: "الكهف", englishTranslation: "The Cave", totalVerses: 110, revelationType: "Meccan", juz: 15 },
  { number: 19, name: "Maryam", arabicName: "مريم", englishTranslation: "Mary", totalVerses: 98, revelationType: "Meccan", juz: 16 },
  { number: 20, name: "Ta-Ha", arabicName: "طه", englishTranslation: "Ta-Ha", totalVerses: 135, revelationType: "Meccan", juz: 16 },
  { number: 21, name: "Al-Anbiya", arabicName: "الأنبياء", englishTranslation: "The Prophets", totalVerses: 112, revelationType: "Meccan", juz: 17 },
  { number: 22, name: "Al-Hajj", arabicName: "الحج", englishTranslation: "The Pilgrimage", totalVerses: 78, revelationType: "Medinan", juz: 17 },
  { number: 23, name: "Al-Mu'minun", arabicName: "المؤمنون", englishTranslation: "The Believers", totalVerses: 118, revelationType: "Meccan", juz: 18 },
  { number: 24, name: "An-Nur", arabicName: "النور", englishTranslation: "The Light", totalVerses: 64, revelationType: "Medinan", juz: 18 },
  { number: 25, name: "Al-Furqan", arabicName: "الفرقان", englishTranslation: "The Criterion", totalVerses: 77, revelationType: "Meccan", juz: 19 },
  { number: 26, name: "Ash-Shu'ara", arabicName: "الشعراء", englishTranslation: "The Poets", totalVerses: 227, revelationType: "Meccan", juz: 19 },
  { number: 27, name: "An-Naml", arabicName: "النمل", englishTranslation: "The Ant", totalVerses: 93, revelationType: "Meccan", juz: 19 },
  { number: 28, name: "Al-Qasas", arabicName: "القصص", englishTranslation: "The Stories", totalVerses: 88, revelationType: "Meccan", juz: 20 },
  { number: 29, name: "Al-Ankabut", arabicName: "العنكبوت", englishTranslation: "The Spider", totalVerses: 69, revelationType: "Meccan", juz: 20 },
  { number: 30, name: "Ar-Rum", arabicName: "الروم", englishTranslation: "The Romans", totalVerses: 60, revelationType: "Meccan", juz: 21 },
  { number: 31, name: "Luqman", arabicName: "لقمان", englishTranslation: "Luqman", totalVerses: 34, revelationType: "Meccan", juz: 21 },
  { number: 32, name: "As-Sajdah", arabicName: "السجدة", englishTranslation: "The Prostration", totalVerses: 30, revelationType: "Meccan", juz: 21 },
  { number: 33, name: "Al-Ahzab", arabicName: "الأحزاب", englishTranslation: "The Combined Forces", totalVerses: 73, revelationType: "Medinan", juz: 21 },
  { number: 34, name: "Saba", arabicName: "سبأ", englishTranslation: "Sheba", totalVerses: 54, revelationType: "Meccan", juz: 22 },
  { number: 35, name: "Fatir", arabicName: "فاطر", englishTranslation: "Originator", totalVerses: 45, revelationType: "Meccan", juz: 22 },
  { number: 36, name: "Ya-Sin", arabicName: "يس", englishTranslation: "Ya-Sin", totalVerses: 83, revelationType: "Meccan", juz: 22 },
  { number: 37, name: "As-Saffat", arabicName: "الصافات", englishTranslation: "Those who set the Ranks", totalVerses: 182, revelationType: "Meccan", juz: 23 },
  { number: 38, name: "Sad", arabicName: "ص", englishTranslation: "The Letter Sad", totalVerses: 88, revelationType: "Meccan", juz: 23 },
  { number: 39, name: "Az-Zumar", arabicName: "الزمر", englishTranslation: "The Troops", totalVerses: 75, revelationType: "Meccan", juz: 23 },
  { number: 40, name: "Ghafir", arabicName: "غافر", englishTranslation: "The Forgiver", totalVerses: 85, revelationType: "Meccan", juz: 24 },
  { number: 41, name: "Fussilat", arabicName: "فصلت", englishTranslation: "Explained in Detail", totalVerses: 54, revelationType: "Meccan", juz: 24 },
  { number: 42, name: "Ash-Shura", arabicName: "الشورى", englishTranslation: "The Consultation", totalVerses: 53, revelationType: "Meccan", juz: 25 },
  { number: 43, name: "Az-Zukhruf", arabicName: "الزخرف", englishTranslation: "The Ornaments of Gold", totalVerses: 89, revelationType: "Meccan", juz: 25 },
  { number: 44, name: "Ad-Dukhan", arabicName: "الدخان", englishTranslation: "The Smoke", totalVerses: 59, revelationType: "Meccan", juz: 25 },
  { number: 45, name: "Al-Jathiyah", arabicName: "الجاثية", englishTranslation: "The Crouching", totalVerses: 37, revelationType: "Meccan", juz: 25 },
  { number: 46, name: "Al-Ahqaf", arabicName: "الأحقاف", englishTranslation: "The Wind-Curved Sandhills", totalVerses: 35, revelationType: "Meccan", juz: 26 },
  { number: 47, name: "Muhammad", arabicName: "محمد", englishTranslation: "Muhammad", totalVerses: 38, revelationType: "Medinan", juz: 26 },
  { number: 48, name: "Al-Fath", arabicName: "الفتح", englishTranslation: "The Victory", totalVerses: 29, revelationType: "Medinan", juz: 26 },
  { number: 49, name: "Al-Hujurat", arabicName: "الحجرات", englishTranslation: "The Dwellings", totalVerses: 18, revelationType: "Medinan", juz: 26 },
  { number: 50, name: "Qaf", arabicName: "ق", englishTranslation: "The Letter Qaf", totalVerses: 45, revelationType: "Meccan", juz: 26 },
  { number: 51, name: "Adh-Dhariyat", arabicName: "الذاريات", englishTranslation: "The Winnowing Winds", totalVerses: 60, revelationType: "Meccan", juz: 26 },
  { number: 52, name: "At-Tur", arabicName: "الطور", englishTranslation: "The Mount", totalVerses: 49, revelationType: "Meccan", juz: 27 },
  { number: 53, name: "An-Najm", arabicName: "النجم", englishTranslation: "The Star", totalVerses: 62, revelationType: "Meccan", juz: 27 },
  { number: 54, name: "Al-Qamar", arabicName: "القمر", englishTranslation: "The Moon", totalVerses: 55, revelationType: "Meccan", juz: 27 },
  { number: 55, name: "Ar-Rahman", arabicName: "الرحمن", englishTranslation: "The Beneficent", totalVerses: 78, revelationType: "Medinan", juz: 27 },
  { number: 56, name: "Al-Waqi'ah", arabicName: "الواقعة", englishTranslation: "The Inevitable", totalVerses: 96, revelationType: "Meccan", juz: 27 },
  { number: 57, name: "Al-Hadid", arabicName: "الحديد", englishTranslation: "The Iron", totalVerses: 29, revelationType: "Medinan", juz: 27 },
  { number: 58, name: "Al-Mujadilah", arabicName: "المجادلة", englishTranslation: "The Pleading Woman", totalVerses: 22, revelationType: "Medinan", juz: 28 },
  { number: 59, name: "Al-Hashr", arabicName: "الحشر", englishTranslation: "The Exile", totalVerses: 24, revelationType: "Medinan", juz: 28 },
  { number: 60, name: "Al-Mumtahanah", arabicName: "الممتحنة", englishTranslation: "She that is to be examined", totalVerses: 13, revelationType: "Medinan", juz: 28 },
  { number: 61, name: "As-Saff", arabicName: "الصف", englishTranslation: "The Ranks", totalVerses: 14, revelationType: "Medinan", juz: 28 },
  { number: 62, name: "Al-Jumu'ah", arabicName: "الجمعة", englishTranslation: "The Congregation", totalVerses: 11, revelationType: "Medinan", juz: 28 },
  { number: 63, name: "Al-Munafiqun", arabicName: "المنافقون", englishTranslation: "The Hypocrites", totalVerses: 11, revelationType: "Medinan", juz: 28 },
  { number: 64, name: "At-Taghabun", arabicName: "التغابن", englishTranslation: "The Mutual Disillusion", totalVerses: 18, revelationType: "Medinan", juz: 28 },
  { number: 65, name: "At-Talaq", arabicName: "الطلاق", englishTranslation: "The Divorce", totalVerses: 12, revelationType: "Medinan", juz: 28 },
  { number: 66, name: "At-Tahrim", arabicName: "التحريم", englishTranslation: "The Prohibition", totalVerses: 12, revelationType: "Medinan", juz: 28 },
  { number: 67, name: "Al-Mulk", arabicName: "الملك", englishTranslation: "The Sovereignty", totalVerses: 30, revelationType: "Meccan", juz: 29 },
  { number: 68, name: "Al-Qalam", arabicName: "القلم", englishTranslation: "The Pen", totalVerses: 52, revelationType: "Meccan", juz: 29 },
  { number: 69, name: "Al-Haqqah", arabicName: "الحاقة", englishTranslation: "The Sure Reality", totalVerses: 52, revelationType: "Meccan", juz: 29 },
  { number: 70, name: "Al-Ma'arij", arabicName: "المعارج", englishTranslation: "The Ways of Ascent", totalVerses: 44, revelationType: "Meccan", juz: 29 },
  { number: 71, name: "Nuh", arabicName: "نوح", englishTranslation: "Noah", totalVerses: 28, revelationType: "Meccan", juz: 29 },
  { number: 72, name: "Al-Jinn", arabicName: "الجن", englishTranslation: "The Jinn", totalVerses: 28, revelationType: "Meccan", juz: 29 },
  { number: 73, name: "Al-Muzzammil", arabicName: "المزمل", englishTranslation: "The Enshrouded One", totalVerses: 20, revelationType: "Meccan", juz: 29 },
  { number: 74, name: "Al-Muddaththir", arabicName: "المدثر", englishTranslation: "The Cloaked One", totalVerses: 56, revelationType: "Meccan", juz: 29 },
  { number: 75, name: "Al-Qiyamah", arabicName: "القيامة", englishTranslation: "The Resurrection", totalVerses: 40, revelationType: "Meccan", juz: 29 },
  { number: 76, name: "Al-Insan", arabicName: "الإنسان", englishTranslation: "The Man", totalVerses: 31, revelationType: "Medinan", juz: 29 },
  { number: 77, name: "Al-Mursalat", arabicName: "المرسلات", englishTranslation: "The Emissaries", totalVerses: 50, revelationType: "Meccan", juz: 29 },
  { number: 78, name: "An-Naba", arabicName: "النبأ", englishTranslation: "The Tidings", totalVerses: 40, revelationType: "Meccan", juz: 30 },
  { number: 79, name: "An-Nazi'at", arabicName: "النازعات", englishTranslation: "Those who drag forth", totalVerses: 46, revelationType: "Meccan", juz: 30 },
  { number: 80, name: "Abasa", arabicName: "عبس", englishTranslation: "He Frowned", totalVerses: 42, revelationType: "Meccan", juz: 30 },
  { number: 81, name: "At-Takwir", arabicName: "التكوير", englishTranslation: "The Overthrowing", totalVerses: 29, revelationType: "Meccan", juz: 30 },
  { number: 82, name: "Al-Infitar", arabicName: "الانفطار", englishTranslation: "The Cleaving", totalVerses: 19, revelationType: "Meccan", juz: 30 },
  { number: 83, name: "Al-Mutaffifin", arabicName: "المطففين", englishTranslation: "Defrauding", totalVerses: 36, revelationType: "Meccan", juz: 30 },
  { number: 84, name: "Al-Inshiqaq", arabicName: "الانشقاق", englishTranslation: "The Sundering", totalVerses: 25, revelationType: "Meccan", juz: 30 },
  { number: 85, name: "Al-Buruj", arabicName: "البروج", englishTranslation: "The Mansions of the Stars", totalVerses: 22, revelationType: "Meccan", juz: 30 },
  { number: 86, name: "At-Tariq", arabicName: "الطارق", englishTranslation: "The Morning Star", totalVerses: 17, revelationType: "Meccan", juz: 30 },
  { number: 87, name: "Al-A'la", arabicName: "الأعلى", englishTranslation: "The Most High", totalVerses: 19, revelationType: "Meccan", juz: 30 },
  { number: 88, name: "Al-Ghashiyah", arabicName: "الغاشية", englishTranslation: "The Overwhelming", totalVerses: 26, revelationType: "Meccan", juz: 30 },
  { number: 89, name: "Al-Fajr", arabicName: "الفجر", englishTranslation: "The Dawn", totalVerses: 30, revelationType: "Meccan", juz: 30 },
  { number: 90, name: "Al-Balad", arabicName: "البلد", englishTranslation: "The City", totalVerses: 20, revelationType: "Meccan", juz: 30 },
  { number: 91, name: "Ash-Shams", arabicName: "الشمس", englishTranslation: "The Sun", totalVerses: 15, revelationType: "Meccan", juz: 30 },
  { number: 92, name: "Al-Layl", arabicName: "الليل", englishTranslation: "The Night", totalVerses: 21, revelationType: "Meccan", juz: 30 },
  { number: 93, name: "Ad-Duha", arabicName: "الضحى", englishTranslation: "The Morning Hours", totalVerses: 11, revelationType: "Meccan", juz: 30 },
  { number: 94, name: "Ash-Sharh", arabicName: "الشرح", englishTranslation: "The Relief", totalVerses: 8, revelationType: "Meccan", juz: 30 },
  { number: 95, name: "At-Tin", arabicName: "التين", englishTranslation: "The Fig", totalVerses: 8, revelationType: "Meccan", juz: 30 },
  { number: 96, name: "Al-Alaq", arabicName: "العلق", englishTranslation: "The Clot", totalVerses: 19, revelationType: "Meccan", juz: 30 },
  { number: 97, name: "Al-Qadr", arabicName: "القدر", englishTranslation: "The Night of Decree", totalVerses: 5, revelationType: "Meccan", juz: 30 },
  { number: 98, name: "Al-Bayyinah", arabicName: "البينة", englishTranslation: "The Clear Proof", totalVerses: 8, revelationType: "Medinan", juz: 30 },
  { number: 99, name: "Az-Zalzalah", arabicName: "الزلزلة", englishTranslation: "The Earthquake", totalVerses: 8, revelationType: "Medinan", juz: 30 },
  { number: 100, name: "Al-Adiyat", arabicName: "العاديات", englishTranslation: "The Courser", totalVerses: 11, revelationType: "Meccan", juz: 30 },
  { number: 101, name: "Al-Qari'ah", arabicName: "القارعة", englishTranslation: "The Calamity", totalVerses: 11, revelationType: "Meccan", juz: 30 },
  { number: 102, name: "At-Takathur", arabicName: "التكاثر", englishTranslation: "The Rivalry in World Increase", totalVerses: 8, revelationType: "Meccan", juz: 30 },
  { number: 103, name: "Al-'Asr", arabicName: "العصر", englishTranslation: "The Declining Day", totalVerses: 3, revelationType: "Meccan", juz: 30 },
  { number: 104, name: "Al-Humazah", arabicName: "الهمزة", englishTranslation: "The Traducer", totalVerses: 9, revelationType: "Meccan", juz: 30 },
  { number: 105, name: "Al-Fil", arabicName: "الفيل", englishTranslation: "The Elephant", totalVerses: 5, revelationType: "Meccan", juz: 30 },
  { number: 106, name: "Quraysh", arabicName: "قريش", englishTranslation: "Quraysh", totalVerses: 4, revelationType: "Meccan", juz: 30 },
  { number: 107, name: "Al-Ma'un", arabicName: "الماعون", englishTranslation: "The Small Kindnesses", totalVerses: 7, revelationType: "Meccan", juz: 30 },
  { number: 108, name: "Al-Kawthar", arabicName: "الكوثر", englishTranslation: "Abundance", totalVerses: 3, revelationType: "Meccan", juz: 30 },
  { number: 109, name: "Al-Kafirun", arabicName: "الكافرون", englishTranslation: "The Disbelievers", totalVerses: 6, revelationType: "Meccan", juz: 30 },
  { number: 110, name: "An-Nasr", arabicName: "النصر", englishTranslation: "The Divine Support", totalVerses: 3, revelationType: "Medinan", juz: 30 },
  { number: 111, name: "Al-Masad", arabicName: "المسد", englishTranslation: "The Palm Fiber", totalVerses: 5, revelationType: "Meccan", juz: 30 },
  { number: 112, name: "Al-Ikhlas", arabicName: "الإخلاص", englishTranslation: "Sincerity", totalVerses: 4, revelationType: "Meccan", juz: 30 },
  { number: 113, name: "Al-Falaq", arabicName: "الفلق", englishTranslation: "The Daybreak", totalVerses: 5, revelationType: "Meccan", juz: 30 },
  { number: 114, name: "An-Nas", arabicName: "الناس", englishTranslation: "Mankind", totalVerses: 6, revelationType: "Meccan", juz: 30 }
];

const TRANSLATIONS_LIST = [
  { id: 131, name: 'Dr. Mustafa Khattab (The Clear Quran)', lang: 'en' },
  { id: 22, name: 'Sahih International', lang: 'en' },
  { id: 97, name: 'Fateh Muhammad Jalandhri (Urdu)', lang: 'ur' },
  { id: 158, name: 'Maulana Abul A\'la Maududi (Urdu)', lang: 'ur' },
  { id: 84, name: 'Muhammad Hamidullah (French)', lang: 'fr' },
  { id: 83, name: 'Abdel Ghani Melara (Spanish)', lang: 'es' },
  { id: 77, name: 'Diyanet Isleri (Turkish)', lang: 'tr' },
];

const RECITERS_LIST = [
  { id: 'mishari_rashid_al_afasy', name: 'Mishary Rashid Alafasy' },
  { id: 'sudais', name: 'Abdul Rahman Al-Sudais' },
  { id: 'maher_al_muaiqly', name: 'Maher Al-Muaiqly' },
  { id: 'sa3d_al_ghamidi', name: 'Saad Al-Ghamdi' },
];

export const QuranModule: React.FC = () => {
  const {
    language,
    readingLogs,
    logQuranReading,
    khatmGoal,
    updateKhatmGoal,
    hifzRecords,
    updateHifzStatus,
  } = useApp();

  const t = useTranslation(language);
  const rtl = isRTL(language);

  // Set Quran Reading ('surahs') as the default and first tab per user instruction
  const [activeTab, setActiveTab] = useState<'surahs' | 'reading' | 'hifz'>('surahs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<any | null>(null);

  // Quran.com API Verses States
  const [verses, setVerses] = useState<any[]>([]);
  const [loadingVerses, setLoadingVerses] = useState<boolean>(false);
  const [versesError, setVersesError] = useState<string | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState<number>(131); // Default is Clear Quran
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');

  // HTML5 Audio States
  const [selectedReciter, setSelectedReciter] = useState<string>('mishari_rashid_al_afasy');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Page logging inputs
  const [pagesInput, setPagesInput] = useState<number>(10);
  const [juzInput, setJuzInput] = useState<number>(1);
  const [notesInput, setNotesInput] = useState<string>('');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredSurahs = ALL_114_SURAH_METAS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.arabicName.includes(searchQuery) ||
      s.englishTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString() === searchQuery.trim()
  );

  const khatmPercent = Math.min(100, Math.round((khatmGoal.currentPagesRead / khatmGoal.totalPages) * 100));

  // Load verses from Quran.com API when selected Surah or Translation changes
  useEffect(() => {
    if (!selectedSurah) {
      setVerses([]);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    const fetchVerses = async () => {
      setLoadingVerses(true);
      setVersesError(null);
      try {
        const total = selectedSurah.totalVerses || 10;
        const res = await fetch(
          `https://api.quran.com/api/v4/verses/by_chapter/${selectedSurah.number}?language=en&translations=${selectedTranslation}&fields=text_uthmani&per_page=${total}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch verses from Quran.com API: status ${res.status}`);
        }
        const data = await res.json();
        if (data.verses) {
          setVerses(data.verses);
        } else {
          throw new Error('Invalid data structure returned from Quran.com');
        }
      } catch (error: any) {
        console.error(error);
        setVersesError(error.message || 'Network error fetching Quranic verses.');
      } finally {
        setLoadingVerses(false);
      }
    };

    fetchVerses();
  }, [selectedSurah, selectedTranslation]);

  // Sync audio source when selected Surah or Reciter changes
  useEffect(() => {
    if (!selectedSurah) return;

    const paddedNumber = String(selectedSurah.number).padStart(3, '0');
    const audioUrl = `https://download.quranicaudio.com/quran/${selectedReciter}/${paddedNumber}.mp3`;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      setIsPlaying(false);
      setAudioProgress(0);
      setAudioCurrentTime(0);
    }
  }, [selectedSurah, selectedReciter]);

  const handleAudioPlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsAudioLoading(true);
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsAudioLoading(false);
        })
        .catch((e) => {
          console.warn('Audio play failed:', e);
          setIsAudioLoading(false);
        });
    }
  };

  const handleAudioTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 0;
    setAudioCurrentTime(current);
    setAudioDuration(duration);
    if (duration > 0) {
      setAudioProgress((current / duration) * 100);
    }
  };

  const handleAudioSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || !audioDuration) return;
    const targetPct = parseFloat(e.target.value);
    const newTime = (targetPct / 100) * audioDuration;
    audioRef.current.currentTime = newTime;
    setAudioProgress(targetPct);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const formatAudioTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pagesInput > 0) {
      logQuranReading(Number(pagesInput), Number(juzInput), notesInput);
      setNotesInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. MODULE SUB-NAV TABS - Quran Reading is FIRST */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => { setActiveTab('surahs'); setSelectedSurah(null); }}
            className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'surahs' || selectedSurah
                ? 'bg-[#C89B2E] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Quran Reading</span>
          </button>
          <button
            onClick={() => { setActiveTab('reading'); setSelectedSurah(null); }}
            className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'reading' && !selectedSurah
                ? 'bg-[#C89B2E] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Khatm & Progress</span>
          </button>
          <button
            onClick={() => { setActiveTab('hifz'); setSelectedSurah(null); }}
            className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'hifz'
                ? 'bg-[#C89B2E] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Hifz Memorization</span>
          </button>
        </div>
      </div>

      {/* 2. TAB 1: SURAH DIRECTORY & LIVE QURAN.COM READER */}
      {(activeTab === 'surahs' || selectedSurah) && (
        <div className="space-y-6">
          {selectedSurah ? (
            /* REAL IN-DEPTH READER VIEW WITH QURAN.COM API & AUDIO PLAYER */
            <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-10 border border-stone-200 shadow-sm space-y-6">
              
              {/* Top Control Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-stone-200/80">
                <button
                  onClick={() => {
                    setSelectedSurah(null);
                    if (audioRef.current) {
                      audioRef.current.pause();
                    }
                    setIsPlaying(false);
                  }}
                  className="text-sm sm:text-base font-bold text-[#C89B2E] hover:underline flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Surah Catalog</span>
                </button>
                <div className="text-left sm:text-right">
                  <span className="text-xs sm:text-sm font-semibold text-[#C89B2E] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">Surah {selectedSurah.number}</span>
                  <h3 className="text-2xl font-black font-serif text-[#16241A] mt-1.5">{selectedSurah.name} ({selectedSurah.arabicName})</h3>
                  <p className="text-xs sm:text-sm text-stone-500 font-medium">{selectedSurah.englishTranslation} · {selectedSurah.totalVerses} Verses</p>
                </div>
              </div>

              {/* Advanced Controls Area (Translation & Reciter Selection) */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Translation Choice */}
                <div className="space-y-1">
                  <label className="block text-xs font-black text-stone-500 uppercase tracking-wider">Translation Language</label>
                  <select
                    value={selectedTranslation}
                    onChange={(e) => setSelectedTranslation(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold outline-none focus:border-[#C89B2E]"
                  >
                    {TRANSLATIONS_LIST.map((tr) => (
                      <option key={tr.id} value={tr.id}>
                        {tr.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reciter Selector */}
                <div className="space-y-1">
                  <label className="block text-xs font-black text-stone-500 uppercase tracking-wider">Audio Reciter</label>
                  <select
                    value={selectedReciter}
                    onChange={(e) => setSelectedReciter(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold outline-none focus:border-[#C89B2E]"
                  >
                    {RECITERS_LIST.map((rec) => (
                      <option key={rec.id} value={rec.id}>
                        {rec.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Sizer */}
                <div className="space-y-1">
                  <label className="block text-xs font-black text-stone-500 uppercase tracking-wider">Arabic Font Size</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['normal', 'large', 'xlarge'] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setFontSize(sz)}
                        className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                          fontSize === sz
                            ? 'bg-[#C89B2E] text-white shadow-2xs'
                            : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rich Customized Audio Player Interface */}
              <div className="bg-gradient-to-r from-[#123D28] to-[#0B2E1C] text-white rounded-3xl p-5 border border-[#C89B2E]/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C89B2E]/20 border border-[#C89B2E] flex items-center justify-center animate-pulse">
                      <Music className="w-5 h-5 text-[#FBBF24]" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">Full Recitation Audio Player</p>
                      <p className="text-xs text-stone-300">Recited by: <span className="text-[#FBBF24] font-bold">{RECITERS_LIST.find(r => r.id === selectedReciter)?.name}</span></p>
                    </div>
                  </div>

                  {/* Play & Mute Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAudioPlayPause}
                      disabled={isAudioLoading}
                      className="px-4 py-2.5 rounded-xl bg-[#C89B2E] text-white font-extrabold hover:bg-[#b88c24] transition-colors cursor-pointer flex items-center gap-2 shadow-sm text-sm"
                    >
                      {isAudioLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isPlaying ? (
                        <>
                          <Pause className="w-4 h-4 fill-white" />
                          <span>Pause Recitation</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white" />
                          <span>Play Recitation</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-[#FBBF24]" />}
                    </button>
                  </div>
                </div>

                {/* Hidden HTML5 Audio Element */}
                <audio
                  ref={audioRef}
                  onTimeUpdate={handleAudioTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                />

                {/* Progress bar and timeline seeker */}
                <div className="space-y-1.5">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={audioProgress}
                    onChange={handleAudioSeek}
                    className="w-full accent-[#FBBF24] cursor-pointer h-1.5 rounded-lg bg-stone-700 appearance-none"
                  />
                  <div className="flex justify-between text-xs font-mono text-stone-300">
                    <span>{formatAudioTime(audioCurrentTime)}</span>
                    <span>{formatAudioTime(audioDuration)}</span>
                  </div>
                </div>
              </div>

              {/* Bismillah Header Calligraphy for appropriate Surahs */}
              {selectedSurah.number !== 9 && (
                <div className="text-center py-6">
                  <span className="text-3xl lg:text-4xl font-arabic text-[#0B2E1C] leading-normal select-none">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                  </span>
                </div>
              )}

              {/* Verses Container */}
              <div className="space-y-6 max-w-4xl mx-auto">
                {loadingVerses ? (
                  <div className="text-center py-20 space-y-3">
                    <Loader2 className="w-10 h-10 animate-spin text-[#C89B2E] mx-auto" />
                    <p className="text-stone-500 font-bold text-sm">Streaming authentic script & translations from Quran.com...</p>
                  </div>
                ) : versesError ? (
                  <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100 p-6 space-y-3">
                    <p className="text-red-600 font-extrabold">Failed to load verses</p>
                    <p className="text-stone-500 text-xs sm:text-sm">{versesError}</p>
                    <button
                      onClick={() => setSelectedTranslation(131)}
                      className="px-4 py-2 rounded-xl bg-[#C89B2E] text-white font-bold text-xs"
                    >
                      Reset Translation Settings
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {verses.map((ayah, index) => {
                      const arabicFontClass =
                        fontSize === 'xlarge'
                          ? 'text-4xl sm:text-5xl lg:text-6xl'
                          : fontSize === 'large'
                          ? 'text-3xl sm:text-4xl lg:text-5xl'
                          : 'text-2xl sm:text-3xl lg:text-4xl';

                      return (
                        <div key={ayah.id} className="py-8 space-y-4">
                          {/* Arabic text with beautiful ligatures */}
                          <p
                            dir="rtl"
                            className={`${arabicFontClass} leading-loose font-arabic text-[#0B2E1C] text-right font-normal tracking-wide`}
                          >
                            {ayah.text_uthmani}{' '}
                            <span className="text-xl sm:text-2xl font-serif text-[#C89B2E] select-none inline-block ml-1">
                              ﴿{ayah.verse_number}﴾
                            </span>
                          </p>

                          {/* Translation in matching select language */}
                          <div className="text-left max-w-3xl pt-2">
                            {ayah.translations?.map((tr: any) => (
                              <p
                                key={tr.id}
                                className="text-base sm:text-lg font-medium text-stone-800 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: tr.text }}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* End of Surah Log Assistant */}
              <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs sm:text-sm font-semibold text-stone-500">Completed reading Surah {selectedSurah.name}?</p>
                <button
                  onClick={() => {
                    logQuranReading(Math.ceil(selectedSurah.totalVerses / 15), selectedSurah.juz, `Recited Surah ${selectedSurah.name}`);
                    setSelectedSurah(null);
                    if (audioRef.current) audioRef.current.pause();
                    setIsPlaying(false);
                  }}
                  className="px-6 py-3 rounded-2xl bg-[#2E8B4F] text-white font-extrabold text-sm sm:text-base shadow-sm hover:bg-[#257341] cursor-pointer"
                >
                  ✓ Mark Surah Recited & Log Progress
                </button>
              </div>

            </div>
          ) : (
            /* ALL 114 SURAHS DIRECTORY GRID */
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search Surah by Name, Number, Arabic or Translation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-stone-200 bg-white text-base font-medium outline-none focus:border-[#C89B2E] shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSurahs.map((surah) => (
                  <div
                    key={surah.number}
                    onClick={() => setSelectedSurah(surah)}
                    className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-[#C89B2E] hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-10 h-10 rounded-xl bg-stone-100 text-[#16241A] text-sm font-bold flex items-center justify-center tabular-nums">
                        {surah.number}
                      </span>
                      <div>
                        <p className="text-base font-bold text-[#16241A]">{surah.name}</p>
                        <p className="text-xs sm:text-sm text-stone-600 font-medium">
                          {surah.englishTranslation} · {surah.totalVerses} Ayahs
                        </p>
                      </div>
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold font-arabic text-[#C89B2E]">
                      {surah.arabicName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. TAB 2: KHATM & PACING LOGS */}
      {activeTab === 'reading' && !selectedSurah && (
        <div className="space-y-6">
          {/* Khatm Pacing Hero Card */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#C89B2E]" />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#C89B2E] uppercase tracking-wider mb-2">
                  <Award className="w-5 h-5" />
                  <span>{t('khatmProgress')}</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-[#16241A] tracking-tight">
                  {khatmGoal.currentPagesRead} / {khatmGoal.totalPages}
                </h3>
                <p className="text-sm sm:text-base text-stone-600 font-medium mt-1">
                  {t('dailyGoalPages')}: <span className="font-bold text-[#16241A]">{khatmGoal.targetPagesPerDay} pgs/day</span> · {t('projectedFinish')}:{' '}
                  <span className="font-bold text-[#16241A]">{khatmGoal.targetFinishDate}</span>
                </p>
              </div>

              {/* Goal modifier */}
              <div className="flex items-center gap-2.5 bg-stone-50 p-2.5 rounded-2xl border border-stone-200">
                <span className="text-sm text-stone-600 font-bold">{t('dailyGoalPages')}:</span>
                {[10, 20, 30].map((pg) => (
                  <button
                    key={pg}
                    onClick={() => updateKhatmGoal(pg)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                      khatmGoal.targetPagesPerDay === pg
                        ? 'bg-[#C89B2E] text-white shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80'
                    }`}
                  >
                    {pg} pgs
                  </button>
                ))}
              </div>
            </div>

            {/* Thick Legible Progress Bar */}
            <div className="mt-6 space-y-2.5">
              <div className="flex justify-between text-sm sm:text-base font-bold">
                <span className="text-[#C89B2E]">{khatmPercent}% Complete</span>
                <span className="text-stone-500">{(604 - khatmGoal.currentPagesRead)} {t('pagesLeft')}</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden p-0.5 border border-stone-200/60">
                <div
                  className="bg-gradient-to-r from-[#C89B2E] to-[#FBBF24] h-full rounded-full transition-all duration-500"
                  style={{ width: `${khatmPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Log Pages Form & Recent Log List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
              <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A] mb-5 flex items-center gap-2.5">
                <Bookmark className="w-5 h-5 text-[#C89B2E]" />
                <span>{t('logPages')}</span>
              </h4>

              <form onSubmit={handleLogSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">
                    {t('pagesReadToday')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="604"
                    value={pagesInput}
                    onChange={(e) => setPagesInput(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none focus:border-[#C89B2E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">
                    {t('juzParaLabel')} (1–30)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={juzInput}
                    onChange={(e) => setJuzInput(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none focus:border-[#C89B2E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">
                    {t('notesPlaceholder')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('notesPlaceholder')}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base outline-none focus:border-[#C89B2E]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#C89B2E] hover:bg-[#b88c24] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                >
                  {t('recordReadingBtn')}
                </button>
              </form>
            </div>

            {/* Recent Reading History */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
              <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A] mb-5">
                Reading History & Insights
              </h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {readingLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 sm:p-4.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="text-base font-bold text-[#16241A]">
                        {log.pagesRead} Pages Read · Juz {log.juz}
                      </p>
                      {log.notes && <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">{log.notes}</p>}
                    </div>
                    <span className="text-xs sm:text-sm text-stone-500 font-semibold bg-white px-3 py-1 rounded-xl border border-stone-200/60">{log.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 3: HIFZ TRACKER */}
      {activeTab === 'hifz' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] mb-1 tracking-tight">
              Surah-by-Surah Memorization & Revision Scheduler
            </h3>
            <p className="text-sm sm:text-base text-stone-600 font-medium mb-5">
              Spaced repetition intervals schedule automatic review dates so you never forget memorized verses.
            </p>

            <div className="space-y-3.5">
              {ALL_114_SURAH_METAS.slice(0, 15).map((surah) => {
                const record = hifzRecords[surah.number] || {
                  surahNumber: surah.number,
                  status: 'not-started',
                  masteryLevel: 0,
                };

                return (
                  <div
                    key={surah.number}
                    className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-sm font-extrabold flex items-center justify-center text-[#16241A]">
                        {surah.number}
                      </span>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-base sm:text-lg font-bold text-[#16241A]">{surah.name}</span>
                          <span className="text-sm sm:text-base font-arabic text-[#C89B2E] font-bold">{surah.arabicName}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
                          Status: <span className="font-bold uppercase text-[#16241A]">{record.status}</span>
                          {record.nextRevisionDue && ` · Next revision: ${record.nextRevisionDue}`}
                        </p>
                      </div>
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => updateHifzStatus(surah.number, 'not-started')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                          record.status === 'not-started'
                            ? 'bg-stone-300 text-stone-900 shadow-2xs'
                            : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        Not Started
                      </button>
                      <button
                        onClick={() => updateHifzStatus(surah.number, 'in-progress')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                          record.status === 'in-progress'
                            ? 'bg-amber-500 text-white shadow-2xs'
                            : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => updateHifzStatus(surah.number, 'memorized')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                          record.status === 'memorized'
                            ? 'bg-[#2E8B4F] text-white shadow-2xs'
                            : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        Memorized
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
