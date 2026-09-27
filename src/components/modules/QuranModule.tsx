import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import { calculateNextSpacedRevision } from '../../services/quranData';
import { SurahMeta, HifzTask, HifzTaskType, HifzTaskStatus } from '../../types';
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
  Plus,
  Trash2,
  History,
  Trophy,
  Flag,
  Clock,
  Target,
  Flame,
  Star,
  Eye,
  EyeOff,
  Repeat,
  X,
  CheckSquare,
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
  { id: 'en.sahih', name: 'Sahih International', lang: 'en' },
  { id: 'en.pickthall', name: 'Pickthall', lang: 'en' },
  { id: 'en.yusufali', name: 'Yusuf Ali', lang: 'en' },
  { id: 'fr.hamidullah', name: 'Muhammad Hamidullah (French)', lang: 'fr' },
  { id: 'es.cortes', name: 'Julio Cortes (Spanish)', lang: 'es' },
  { id: 'tr.yazir', name: 'Diyanet Isleri (Turkish)', lang: 'tr' },
  { id: 'ur.maududi', name: 'Abul Ala Maududi (Urdu)', lang: 'ur' },
];

const RECITERS_LIST = [
  { id: 'Alafasy_128kbps', name: 'Mishary Rashid Alafasy' },
  { id: 'Abdurrahmaan_As-Sudais_192kbps', name: 'Abdul Rahman Al-Sudais' },
  { id: 'Maher_AlMuaiqly_64kbps', name: 'Maher Al-Muaiqly' },
  { id: 'Saood_ash-Shuraym_128kbps', name: 'Saud Al-Shuraim' },
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

  // Al Quran Cloud API Verses States
  const [verses, setVerses] = useState<any[]>([]);
  const [loadingVerses, setLoadingVerses] = useState<boolean>(false);
  const [versesError, setVersesError] = useState<string | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState<string>('en.sahih'); // Default is Sahih International
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');

  // HTML5 Audio States
  const [selectedReciter, setSelectedReciter] = useState<string>('Alafasy_128kbps');
  const [currentPlayingVerseKey, setCurrentPlayingVerseKey] = useState<string | null>(null);
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

  // Advanced Quran Journey states with local storage hydration
  const [activeJourney, setActiveJourney] = useState<any | null>(() => {
    const saved = localStorage.getItem('bd_quran_active_journey_v2');
    if (saved) return JSON.parse(saved);
    return null;
  });

  const [completedJourneys, setCompletedJourneys] = useState<any[]>(() => {
    const saved = localStorage.getItem('bd_quran_completed_journeys_v2');
    return saved ? JSON.parse(saved) : [
      {
        id: 'journey_past_1',
        title: 'Complete Khatm 2025',
        type: 'pages',
        targetPagesPerDay: 20,
        startDate: '2025-01-01',
        targetFinishDate: '2025-02-01',
        currentProgressValue: 604,
        totalValue: 604,
        logs: [
          { id: 'lh_1', date: '2025-01-30', logType: 'surah', surahName: 'An-Nas', juz: 30, ayah: 6, pagesRead: 10, notes: 'Completed full Quran!' }
        ],
        milestones: [
          { id: 'm_past', title: 'Khatm Completion', targetValue: 604, completed: true, completedAt: '2025-02-01' }
        ]
      }
    ];
  });

  // Synced local storage effects
  useEffect(() => {
    localStorage.setItem('bd_quran_active_journey_v2', JSON.stringify(activeJourney));
  }, [activeJourney]);

  useEffect(() => {
    localStorage.setItem('bd_quran_completed_journeys_v2', JSON.stringify(completedJourneys));
  }, [completedJourneys]);

  // Form inputs for starting a journey
  const [journeyTitleInput, setJourneyTitleInput] = useState('');
  const [journeyTypeInput, setJourneyTypeInput] = useState<'pages' | 'surahs' | 'juz'>('pages');
  const [journeyDailyPagesInput, setJourneyDailyPagesInput] = useState(20);
  const [journeyTargetDateInput, setJourneyTargetDateInput] = useState('2026-10-31');

  // Advanced progress log form states
  const [logType, setLogType] = useState<'surah' | 'juz'>('surah');
  const [logSurahName, setLogSurahName] = useState('Al-Fatihah');
  const [logJuzNumber, setLogJuzNumber] = useState(1);
  const [logAyahNumber, setLogAyahNumber] = useState(1);
  const [logProgressAmount, setLogProgressAmount] = useState(10);
  const [logNotes, setLogNotes] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);

  // Milestone manager inputs
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneValue, setNewMilestoneValue] = useState(100);

  // --- Hifz Memorization Tasks State ---
  const [hifzTasks, setHifzTasks] = useState<HifzTask[]>(() => {
    const saved = localStorage.getItem('bd_hifz_tasks_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved hifz tasks', e);
      }
    }
    return [
      {
        id: 'ht_1',
        title: 'Memorize Surah Al-Kahf (Ayahs 1 to 10)',
        surahNumber: 18,
        surahName: 'Al-Kahf',
        startAyah: 1,
        endAyah: 10,
        totalVersesInTask: 10,
        type: 'memorization',
        status: 'in-progress',
        targetRepetitions: 10,
        completedRepetitions: 6,
        targetDate: '2026-10-02',
        notes: 'Protection against Dajjal. Recite with clear articulation of Madd.',
        startedAt: '2026-09-26T08:00:00.000Z',
        timeSpentSeconds: 940,
        masteryLevel: 3,
      },
      {
        id: 'ht_2',
        title: "Daily Muraja'ah: Surah Al-Mulk",
        surahNumber: 67,
        surahName: 'Al-Mulk',
        startAyah: 1,
        endAyah: 30,
        totalVersesInTask: 30,
        type: 'revision',
        status: 'completed',
        targetRepetitions: 5,
        completedRepetitions: 5,
        targetDate: '2026-09-27',
        notes: 'Sunnah before sleeping. Intercessor in the grave.',
        startedAt: '2026-09-26T21:00:00.000Z',
        completedAt: '2026-09-26T21:35:00.000Z',
        timeSpentSeconds: 1200,
        masteryLevel: 5,
      },
      {
        id: 'ht_3',
        title: 'Memorize Surah An-Naba (Ayahs 1 to 20)',
        surahNumber: 78,
        surahName: 'An-Naba',
        startAyah: 1,
        endAyah: 20,
        totalVersesInTask: 20,
        type: 'memorization',
        status: 'pending',
        targetRepetitions: 15,
        completedRepetitions: 0,
        targetDate: '2026-10-05',
        notes: 'Juz Amma gateway surah. Listen to Sheikh Alafasy 3x first.',
      },
      {
        id: 'ht_4',
        title: 'Tajweed Polish: Surah Al-Fatihah',
        surahNumber: 1,
        surahName: 'Al-Fatihah',
        startAyah: 1,
        endAyah: 7,
        totalVersesInTask: 7,
        type: 'tajweed',
        status: 'completed',
        targetRepetitions: 7,
        completedRepetitions: 7,
        targetDate: '2026-09-25',
        notes: 'Flawless makharij on Dhad in Ghayril Maghdoob.',
        startedAt: '2026-09-25T07:00:00.000Z',
        completedAt: '2026-09-25T07:20:00.000Z',
        timeSpentSeconds: 780,
        masteryLevel: 5,
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('bd_hifz_tasks_v3', JSON.stringify(hifzTasks));
  }, [hifzTasks]);

  // Active Hifz Practice Studio session state
  const [activeHifzTaskId, setActiveHifzTaskId] = useState<string | null>(null);
  const [hifzTimerSeconds, setHifzTimerSeconds] = useState<number>(0);
  const [isHifzTimerRunning, setIsHifzTimerRunning] = useState<boolean>(false);
  const [showVersesPeek, setShowVersesPeek] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [completionMastery, setCompletionMastery] = useState<number>(5);
  const [completionNotes, setCompletionNotes] = useState<string>('');

  // Custom task form state
  const [showAddTaskForm, setShowAddTaskForm] = useState<boolean>(false);
  const [taskSurahNumber, setTaskSurahNumber] = useState<number>(18);
  const [taskStartAyah, setTaskStartAyah] = useState<number>(1);
  const [taskEndAyah, setTaskEndAyah] = useState<number>(10);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [taskType, setTaskType] = useState<HifzTaskType>('memorization');
  const [taskRepetitions, setTaskRepetitions] = useState<number>(10);
  const [taskDueDate, setTaskDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [taskNotes, setTaskNotes] = useState<string>('');

  // Subview & filter states
  const [hifzTabSubView, setHifzTabSubView] = useState<'tasks' | 'scheduler'>('tasks');
  const [hifzTaskFilter, setHifzTaskFilter] = useState<'all' | 'in-progress' | 'pending' | 'completed'>('all');
  const [hifzSurahSearch, setHifzSurahSearch] = useState<string>('');
  const [hifzSurahStatusFilter, setHifzSurahStatusFilter] = useState<'all' | 'memorized' | 'in-progress' | 'needs-revision' | 'not-started'>('all');

  // Hifz Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isHifzTimerRunning && activeHifzTaskId) {
      interval = setInterval(() => {
        setHifzTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHifzTimerRunning, activeHifzTaskId]);

  const activeHifzTask = hifzTasks.find((t) => t.id === activeHifzTaskId) || null;
  const activeTaskSurahMeta = activeHifzTask ? ALL_114_SURAH_METAS.find((s) => s.number === activeHifzTask.surahNumber) : null;

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredSurahs = ALL_114_SURAH_METAS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.arabicName.includes(searchQuery) ||
      s.englishTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString() === searchQuery.trim()
  );

  const khatmPercent = Math.min(100, Math.round((khatmGoal.currentPagesRead / khatmGoal.totalPages) * 100));

  // Load verses from Al Quran Cloud API when selected Surah or Translation changes
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
      setVerses([]);
      try {
        const res = await fetch(
          `https://api.alquran.cloud/v1/surah/${selectedSurah.number}/editions/quran-uthmani,${selectedTranslation}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch verses from Al Quran Cloud API: status ${res.status}`);
        }
        const json = await res.json();
        if (json.data && json.data.length >= 2) {
          const arabicAyahs = json.data[0].ayahs;
          const translationAyahs = json.data[1].ayahs;

          const combined = arabicAyahs.map((arabicAyah: any, index: number) => {
            const transAyah = translationAyahs[index];
            return {
              id: arabicAyah.number,
              verse_number: arabicAyah.numberInSurah,
              verse_key: `${selectedSurah.number}:${arabicAyah.numberInSurah}`,
              text_uthmani: arabicAyah.text,
              translations: [
                {
                  id: transAyah.number,
                  text: transAyah.text,
                }
              ]
            };
          });
          setVerses(combined);
        } else {
          throw new Error('Invalid data structure returned from Al Quran Cloud API');
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
    
    // Pause existing and reset
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setCurrentPlayingVerseKey(null);
    setAudioProgress(0);
    setAudioCurrentTime(0);
  }, [selectedSurah, selectedReciter]);

  const playVerse = (verseKey: string) => {
    if (!audioRef.current) return;
    setCurrentPlayingVerseKey(verseKey);
    const parts = verseKey.split(':');
    const surahNum = Number(parts[0]);
    const ayahNum = Number(parts[1]);
    const paddedSurah = String(surahNum).padStart(3, '0');
    const paddedAyah = String(ayahNum).padStart(3, '0');
    const url = `https://everyayah.com/data/${selectedReciter}/${paddedSurah}${paddedAyah}.mp3`;

    audioRef.current.pause();
    audioRef.current.src = url;
    audioRef.current.load();
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
  };

  const handleAudioPlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (currentPlayingVerseKey) {
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
      } else if (verses.length > 0) {
        playVerse(verses[0].verse_key);
      }
    }
  };

  const handleAudioEnded = () => {
    if (!selectedSurah) return;

    const currentIndex = verses.findIndex((v) => v.verse_key === currentPlayingVerseKey);

    if (currentIndex !== -1 && currentIndex < verses.length - 1) {
      // Play the next verse on the current Surah
      const nextVerse = verses[currentIndex + 1];
      playVerse(nextVerse.verse_key);
    } else {
      // Entire Surah finished!
      setIsPlaying(false);
      setCurrentPlayingVerseKey(null);
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

  // Journey management handlers
  const handleStartNewJourney = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journeyTitleInput.trim()) return;

    let totalVal = 604;
    let autoMilestones = [];

    if (journeyTypeInput === 'surahs') {
      totalVal = 114;
      autoMilestones = [
        { id: 'm_' + Date.now() + '_1', title: 'First Steps (10 Surahs)', targetValue: 10, completed: false },
        { id: 'm_' + Date.now() + '_2', title: 'Surah Specialist (30 Surahs)', targetValue: 30, completed: false },
        { id: 'm_' + Date.now() + '_3', title: 'Halfway Recited (57 Surahs)', targetValue: 57, completed: false },
        { id: 'm_' + Date.now() + '_4', title: 'Khatm Ultimate (114 Surahs)', targetValue: 114, completed: false },
      ];
    } else if (journeyTypeInput === 'juz') {
      totalVal = 30;
      autoMilestones = [
        { id: 'm_' + Date.now() + '_1', title: 'Juz Beginner (5 Juz)', targetValue: 5, completed: false },
        { id: 'm_' + Date.now() + '_2', title: 'Halfway There (15 Juz)', targetValue: 15, completed: false },
        { id: 'm_' + Date.now() + '_3', title: 'Final Stretch (25 Juz)', targetValue: 25, completed: false },
        { id: 'm_' + Date.now() + '_4', title: 'Crown of Devotion (30 Juz)', targetValue: 30, completed: false },
      ];
    } else {
      totalVal = 604;
      autoMilestones = [
        { id: 'm_' + Date.now() + '_1', title: 'Wisdom Explorer (50 Pages)', targetValue: 50, completed: false },
        { id: 'm_' + Date.now() + '_2', title: 'First Milestone (150 Pages)', targetValue: 150, completed: false },
        { id: 'm_' + Date.now() + '_3', title: 'The Halfway Mark (302 Pages)', targetValue: 302, completed: false },
        { id: 'm_' + Date.now() + '_4', title: 'Khatm Completion (604 Pages)', targetValue: 604, completed: false },
      ];
    }

    const newJourney = {
      id: 'journey_' + Date.now(),
      title: journeyTitleInput,
      type: journeyTypeInput,
      targetPagesPerDay: journeyDailyPagesInput,
      startDate: new Date().toISOString().split('T')[0],
      targetFinishDate: journeyTargetDateInput,
      currentProgressValue: 0,
      totalValue: totalVal,
      logs: [],
      milestones: autoMilestones,
    };

    setActiveJourney(newJourney);
    setJourneyTitleInput('');
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJourney) return;

    const amount = Number(logProgressAmount);
    const updatedValue = Math.min(activeJourney.totalValue, activeJourney.currentProgressValue + amount);

    const newLogItem = {
      id: 'log_' + Date.now(),
      date: logDate,
      logType,
      surahName: logType === 'surah' ? logSurahName : undefined,
      juz: logType === 'juz' ? Number(logJuzNumber) : undefined,
      ayah: Number(logAyahNumber),
      pagesRead: amount,
      notes: logNotes || undefined,
    };

    // Update milestones status
    const updatedMilestones = activeJourney.milestones.map((ms: any) => {
      if (!ms.completed && updatedValue >= ms.targetValue) {
        return { ...ms, completed: true, completedAt: logDate };
      }
      return ms;
    });

    const updatedJourney = {
      ...activeJourney,
      currentProgressValue: updatedValue,
      logs: [newLogItem, ...activeJourney.logs],
      milestones: updatedMilestones,
    };

    setActiveJourney(updatedJourney);
    setLogNotes('');
    setLogProgressAmount(10);
  };

  const handleAddCustomMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJourney || !newMilestoneTitle.trim() || newMilestoneValue <= 0) return;

    const newMs = {
      id: 'ms_' + Date.now(),
      title: newMilestoneTitle,
      targetValue: Math.min(activeJourney.totalValue, Number(newMilestoneValue)),
      completed: activeJourney.currentProgressValue >= Number(newMilestoneValue),
      completedAt: activeJourney.currentProgressValue >= Number(newMilestoneValue) ? new Date().toISOString().split('T')[0] : undefined,
    };

    const updatedJourney = {
      ...activeJourney,
      milestones: [...activeJourney.milestones, newMs],
    };

    setActiveJourney(updatedJourney);
    setNewMilestoneTitle('');
  };

  const handleCompleteCurrentJourney = () => {
    if (!activeJourney) return;

    const completed = {
      ...activeJourney,
      currentProgressValue: activeJourney.totalValue, // clamp to 100%
      completedAt: new Date().toISOString().split('T')[0],
    };

    setCompletedJourneys([completed, ...completedJourneys]);
    setActiveJourney(null);
  };

  const handleDeleteCompletedJourney = (id: string) => {
    setCompletedJourneys(completedJourneys.filter((j) => j.id !== id));
  };

  // --- Hifz Task Workflow Handlers ---
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartHifzTask = (taskId: string) => {
    const task = hifzTasks.find((t) => t.id === taskId);
    if (!task) return;

    setActiveHifzTaskId(taskId);
    setHifzTimerSeconds(task.timeSpentSeconds || 0);
    setIsHifzTimerRunning(true);
    setShowVersesPeek(false);

    if (task.status === 'pending') {
      setHifzTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status: 'in-progress', startedAt: t.startedAt || new Date().toISOString() }
            : t
        )
      );
    }

    setTimeout(() => {
      const studioEl = document.getElementById('hifz-practice-studio');
      if (studioEl) {
        studioEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleIncrementRepetition = () => {
    if (!activeHifzTaskId) return;
    setHifzTasks((prev) =>
      prev.map((t) => {
        if (t.id === activeHifzTaskId) {
          const next = t.completedRepetitions + 1;
          return {
            ...t,
            completedRepetitions: next,
            timeSpentSeconds: hifzTimerSeconds,
          };
        }
        return t;
      })
    );
  };

  const handleDecrementRepetition = () => {
    if (!activeHifzTaskId) return;
    setHifzTasks((prev) =>
      prev.map((t) =>
        t.id === activeHifzTaskId
          ? {
              ...t,
              completedRepetitions: Math.max(0, t.completedRepetitions - 1),
              timeSpentSeconds: hifzTimerSeconds,
            }
          : t
      )
    );
  };

  const handleResetRepetition = () => {
    if (!activeHifzTaskId) return;
    setHifzTasks((prev) =>
      prev.map((t) =>
        t.id === activeHifzTaskId
          ? { ...t, completedRepetitions: 0 }
          : t
      )
    );
  };

  const handleToggleTimer = () => {
    setIsHifzTimerRunning(!isHifzTimerRunning);
    if (activeHifzTaskId) {
      setHifzTasks((prev) =>
        prev.map((t) =>
          t.id === activeHifzTaskId
            ? { ...t, timeSpentSeconds: hifzTimerSeconds }
            : t
        )
      );
    }
  };

  const handleOpenCompletionModal = () => {
    if (!activeHifzTask) return;
    setIsHifzTimerRunning(false);
    setShowCompletionModal(true);
  };

  const handleConfirmCompleteTask = () => {
    if (!activeHifzTask) return;

    const completedTime = new Date().toISOString();
    setHifzTasks((prev) =>
      prev.map((t) =>
        t.id === activeHifzTask.id
          ? {
              ...t,
              status: 'completed',
              completedAt: completedTime,
              timeSpentSeconds: hifzTimerSeconds,
              masteryLevel: completionMastery,
              notes: completionNotes ? `${t.notes ? t.notes + ' · ' : ''}${completionNotes}` : t.notes,
            }
          : t
      )
    );

    // Update Surah in AppContext's hifzRecords
    updateHifzStatus(activeHifzTask.surahNumber, 'memorized', completionMastery);

    setShowCompletionModal(false);
    setActiveHifzTaskId(null);
    setIsHifzTimerRunning(false);
    setHifzTimerSeconds(0);
    setCompletionNotes('');
  };

  const handleQuickCompleteTask = (taskId: string) => {
    const task = hifzTasks.find((t) => t.id === taskId);
    if (!task) return;

    setHifzTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'completed',
              completedAt: new Date().toISOString(),
              completedRepetitions: t.targetRepetitions,
              masteryLevel: 5,
            }
          : t
      )
    );

    updateHifzStatus(task.surahNumber, 'memorized', 5);
  };

  const handleRestartTask = (taskId: string) => {
    const task = hifzTasks.find((t) => t.id === taskId);
    if (!task) return;

    setHifzTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'in-progress',
              completedRepetitions: 0,
              startedAt: new Date().toISOString(),
            }
          : t
      )
    );
    handleStartHifzTask(taskId);
  };

  const handleDeleteHifzTask = (taskId: string) => {
    if (activeHifzTaskId === taskId) {
      setActiveHifzTaskId(null);
      setIsHifzTimerRunning(false);
      setHifzTimerSeconds(0);
    }
    setHifzTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleCreateCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    const surah = ALL_114_SURAH_METAS.find((s) => s.number === taskSurahNumber);
    if (!surah) return;

    const start = Math.max(1, Math.min(taskStartAyah, surah.totalVerses));
    const end = Math.max(start, Math.min(taskEndAyah, surah.totalVerses));
    const totalVersesInTask = end - start + 1;

    const title = taskTitle.trim() || `${taskType === 'memorization' ? 'Memorize' : taskType === 'revision' ? 'Revise' : 'Perfect'} ${surah.name} (Ayahs ${start}-${end})`;

    const newTask: HifzTask = {
      id: `ht_${Date.now()}`,
      title,
      surahNumber: surah.number,
      surahName: surah.name,
      startAyah: start,
      endAyah: end,
      totalVersesInTask,
      type: taskType,
      status: 'pending',
      targetRepetitions: Number(taskRepetitions) || 10,
      completedRepetitions: 0,
      targetDate: taskDueDate,
      notes: taskNotes || undefined,
    };

    setHifzTasks((prev) => [newTask, ...prev]);
    setShowAddTaskForm(false);
    setTaskTitle('');
    setTaskNotes('');
    setHifzTabSubView('tasks');
    setHifzTaskFilter('all');
  };

  const handlePrepopulateTaskForSurah = (surah: any) => {
    setTaskSurahNumber(surah.number);
    setTaskStartAyah(1);
    const end = Math.min(10, surah.totalVerses);
    setTaskEndAyah(end);
    setTaskTitle(`Memorize ${surah.name} (Ayahs 1-${end})`);
    setShowAddTaskForm(true);
    setHifzTabSubView('tasks');
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
                    onChange={(e) => setSelectedTranslation(e.target.value)}
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
                      <p className="text-sm font-black text-white">Verse-by-Verse Recitation Player</p>
                      <p className="text-xs text-stone-300">
                        {currentPlayingVerseKey ? (
                          <>
                            Playing: <span className="text-amber-300 font-extrabold font-mono">Ayah {currentPlayingVerseKey}</span> · Reciter:{' '}
                          </>
                        ) : (
                          <>Ready · Reciter: </>
                        )}
                        <span className="text-[#FBBF24] font-bold">
                          {RECITERS_LIST.find((r) => r.id === selectedReciter)?.name}
                        </span>
                      </p>
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
                  onEnded={handleAudioEnded}
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
                      onClick={() => setSelectedTranslation('en.sahih')}
                      className="px-4 py-2 rounded-xl bg-[#C89B2E] text-white font-bold text-xs"
                    >
                      Reset Translation Settings
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-150">
                    {verses.map((ayah, index) => {
                      const arabicFontClass =
                        fontSize === 'xlarge'
                          ? 'text-4xl sm:text-5xl lg:text-6xl'
                          : fontSize === 'large'
                          ? 'text-3xl sm:text-4xl lg:text-5xl'
                          : 'text-2xl sm:text-3xl lg:text-4xl';

                      const isVersePlaying = isPlaying && currentPlayingVerseKey === ayah.verse_key;

                      return (
                        <div
                          key={ayah.id}
                          className={`py-6 sm:py-8 px-4 transition-all duration-300 rounded-3xl ${
                            isVersePlaying
                              ? 'bg-amber-50/50 border border-amber-300 shadow-2xs my-4'
                              : 'hover:bg-stone-50/40 border border-transparent'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            {/* Individual Ayah Play Control Icon */}
                            <button
                              onClick={() => {
                                if (isVersePlaying) {
                                  audioRef.current?.pause();
                                  setIsPlaying(false);
                                } else {
                                  playVerse(ayah.verse_key);
                                }
                              }}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                                isVersePlaying
                                  ? 'bg-[#C89B2E] text-white border-[#C89B2E] shadow-2xs'
                                  : 'bg-white text-stone-500 border-stone-200 hover:border-[#C89B2E] hover:text-[#C89B2E]'
                              }`}
                              title={isVersePlaying ? "Pause this verse" : `Play Ayah ${ayah.verse_number}`}
                            >
                              {isVersePlaying ? (
                                <Pause className="w-4 h-4 fill-white" />
                              ) : (
                                <Play className="w-4 h-4 fill-current" />
                              )}
                            </button>

                            {/* Arabic text with beautiful ligatures */}
                            <div className="flex-1 text-right">
                              <p
                                dir="rtl"
                                className={`${arabicFontClass} leading-loose font-arabic text-[#0B2E1C] font-normal tracking-wide`}
                              >
                                {ayah.text_uthmani}{' '}
                                <span className="text-xl sm:text-2xl font-serif text-[#C89B2E] select-none inline-block ml-1">
                                  ﴿{ayah.verse_number}﴾
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Translation in matching select language */}
                          <div className="text-left max-w-3xl pt-4 pl-14">
                            {ayah.translations?.map((tr: any) => (
                              <p
                                key={tr.id}
                                className="text-base sm:text-lg font-medium text-stone-700 leading-relaxed"
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
                    onClick={() => {
                      setSelectedSurah(surah);
                    }}
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
        <div className="space-y-8">
          
          {/* A. If no active journey, show start journey card */}
          {!activeJourney ? (
            <div className="bg-gradient-to-br from-[#123D28] to-[#0B2E1C] text-white rounded-3xl p-6 sm:p-8 border border-[#C89B2E]/40 shadow-lg text-center space-y-6 max-w-3xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#C89B2E]/20 border border-[#C89B2E] flex items-center justify-center mx-auto animate-pulse">
                <Sparkles className="w-8 h-8 text-[#FBBF24]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Begin Your Blessed Quran Journey
                </h3>
                <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto font-medium">
                  Establish a customized Quran reading plan. Track your progress daily, set inspirational milestones, and celebrate spiritual achievements.
                </p>
              </div>

              <form onSubmit={handleStartNewJourney} className="bg-white/5 border border-white/10 p-5 sm:p-7 rounded-2xl text-left space-y-4 max-w-xl mx-auto">
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-black text-stone-300 uppercase tracking-wider mb-2">Journey Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Complete Khatm 2026, Ramadan Devotion"
                    value={journeyTitleInput}
                    onChange={(e) => setJourneyTitleInput(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-base sm:text-lg font-extrabold placeholder-stone-400 text-white outline-none focus:border-[#C89B2E] focus:bg-white/15 focus:ring-1 focus:ring-[#C89B2E] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs sm:text-sm font-black text-stone-300 uppercase tracking-wider mb-2">Plan Tracking Type</label>
                    <select
                      value={journeyTypeInput}
                      onChange={(e: any) => setJourneyTypeInput(e.target.value)}
                      className="w-full bg-stone-900 border border-white/20 rounded-xl px-4 py-3 text-base sm:text-lg font-extrabold text-white outline-none focus:border-[#C89B2E] focus:ring-1 focus:ring-[#C89B2E] transition-all cursor-pointer"
                    >
                      <option value="pages">By Page count (604 Pages total)</option>
                      <option value="juz">By Juz/Para count (30 Juz total)</option>
                      <option value="surahs">By Surah count (114 Surahs total)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs sm:text-sm font-black text-stone-300 uppercase tracking-wider mb-2">Daily Target Pacing</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={journeyDailyPagesInput}
                      onChange={(e) => setJourneyDailyPagesInput(Number(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-base sm:text-lg font-extrabold text-white outline-none focus:border-[#C89B2E] focus:ring-1 focus:ring-[#C89B2E] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-black text-stone-300 uppercase tracking-wider mb-2">Target Completion Date</label>
                  <input
                    type="date"
                    required
                    value={journeyTargetDateInput}
                    onChange={(e) => setJourneyTargetDateInput(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-base sm:text-lg font-extrabold text-white outline-none focus:border-[#C89B2E] focus:ring-1 focus:ring-[#C89B2E] transition-all cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#C89B2E] hover:bg-[#b88c24] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Start My Journey</span>
                </button>
              </form>
            </div>
          ) : (
            /* B. Active Journey Dashboard */
            <div className="space-y-6">
              
              {/* Progress Card */}
              <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-[#C89B2E]" />

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#C89B2E] uppercase tracking-wider mb-2">
                      <Target className="w-5 h-5 animate-spin text-[#C89B2E]" />
                      <span>Active Quran Journey: <span className="text-[#16241A] normal-case font-bold">{activeJourney.title}</span></span>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black text-[#16241A] tracking-tight">
                      {activeJourney.currentProgressValue} <span className="text-xl text-stone-500 font-bold">/ {activeJourney.totalValue} {activeJourney.type}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 font-semibold mt-1 flex flex-wrap gap-x-3 gap-y-1">
                      <span>Started: <span className="text-[#16241A] font-bold">{activeJourney.startDate}</span></span>
                      <span>·</span>
                      <span>Target Finish: <span className="text-[#16241A] font-bold">{activeJourney.targetFinishDate}</span></span>
                      <span>·</span>
                      <span>Target: <span className="text-[#16241A] font-bold">{activeJourney.targetPagesPerDay} {activeJourney.type}/day</span></span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Manual complete button */}
                    <button
                      onClick={handleCompleteCurrentJourney}
                      className="px-5 py-3 rounded-2xl bg-[#2E8B4F] hover:bg-[#257341] text-white font-extrabold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Trophy className="w-4 h-4 text-amber-300" />
                      <span>Complete & Archive</span>
                    </button>
                    {/* Cancel & start fresh button */}
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to cancel this journey? Current progress will not be completed.")) {
                          setActiveJourney(null);
                        }
                      }}
                      className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 font-extrabold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span>Cancel & Start Fresh Plan</span>
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-6 space-y-2.5">
                  <div className="flex justify-between text-xs sm:text-sm font-black">
                    <span className="text-[#C89B2E]">{Math.round((activeJourney.currentProgressValue / activeJourney.totalValue) * 100)}% Completed</span>
                    <span className="text-stone-500">{activeJourney.totalValue - activeJourney.currentProgressValue} {activeJourney.type} left to Khatm</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden p-0.5 border border-stone-200/60">
                    <div
                      className="bg-gradient-to-r from-[#C89B2E] to-[#FBBF24] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.round((activeJourney.currentProgressValue / activeJourney.totalValue) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Milestones Horizontal Badges Panel */}
                <div className="mt-6 pt-5 border-t border-stone-100">
                  <h4 className="text-xs font-black text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Achievements & Milestones</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeJourney.milestones?.map((ms: any) => (
                      <div
                        key={ms.id}
                        className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition-all ${
                          ms.completed
                            ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-3xs'
                            : 'bg-stone-50 border-stone-200 text-stone-400'
                        }`}
                      >
                        <Trophy className={`w-3.5 h-3.5 ${ms.completed ? 'text-amber-500 fill-amber-400' : 'text-stone-300'}`} />
                        <span>{ms.title}</span>
                        {ms.completed && <Check className="w-3 h-3 text-emerald-600 stroke-[3px]" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Two Column Work Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Log a Reading Block Form */}
                <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4">
                  <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A] flex items-center gap-2.5">
                    <Bookmark className="w-5 h-5 text-[#C89B2E]" />
                    <span>Record Reading Log</span>
                  </h4>

                  <form onSubmit={handleAddLog} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-2">Log Mode</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setLogType('surah')}
                          className={`py-3 rounded-xl text-xs sm:text-sm font-black border transition-all cursor-pointer ${
                            logType === 'surah'
                              ? 'bg-[#C89B2E] text-white border-[#C89B2E]'
                              : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          Surah (Chapters)
                        </button>
                        <button
                          type="button"
                          onClick={() => setLogType('juz')}
                          className={`py-3 rounded-xl text-xs sm:text-sm font-black border transition-all cursor-pointer ${
                            logType === 'juz'
                              ? 'bg-[#C89B2E] text-white border-[#C89B2E]'
                              : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          Juz (Para)
                        </button>
                      </div>
                    </div>

                    {logType === 'surah' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-2">Surah Name</label>
                          <select
                            value={logSurahName}
                            onChange={(e) => setLogSurahName(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs cursor-pointer"
                          >
                            {ALL_114_SURAH_METAS.map((s) => (
                              <option key={s.number} value={s.name}>
                                {s.number}. {s.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-2">Ayah Number</label>
                          <input
                            type="number"
                            min="1"
                            value={logAyahNumber}
                            onChange={(e) => setLogAyahNumber(Number(e.target.value))}
                            className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-2">Juz (Para)</label>
                          <select
                            value={logJuzNumber}
                            onChange={(e) => setLogJuzNumber(Number(e.target.value))}
                            className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs cursor-pointer"
                          >
                            {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
                              <option key={j} value={j}>
                                Juz {j}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-2">Ayah Number</label>
                          <input
                            type="number"
                            min="1"
                            value={logAyahNumber}
                            onChange={(e) => setLogAyahNumber(Number(e.target.value))}
                            className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-2">
                          Amount read ({activeJourney.type})
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          max={activeJourney.totalValue}
                          value={logProgressAmount}
                          onChange={(e) => setLogProgressAmount(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-2">Date</label>
                        <input
                          type="date"
                          required
                          value={logDate}
                          onChange={(e) => setLogDate(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-2">Notes / Reflection</label>
                      <input
                        type="text"
                        placeholder="e.g. Spent peaceful moments after Fajr"
                        value={logNotes}
                        onChange={(e) => setLogNotes(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#C89B2E] hover:bg-[#b88c24] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>✓ Save Reading Progress</span>
                    </button>
                  </form>
                </div>

                {/* 2. Reading Logs History List */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A] mb-5 flex items-center gap-2">
                      <History className="w-5 h-5 text-[#C89B2E]" />
                      <span>Reading History of Current Journey</span>
                    </h4>
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {activeJourney.logs?.length === 0 ? (
                        <p className="text-stone-400 font-bold text-center py-10 text-xs">No progress logged yet. Be the first to start reading!</p>
                      ) : (
                        activeJourney.logs?.map((log: any) => (
                          <div
                            key={log.id}
                            className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-[#16241A]">
                                Logged +{log.pagesRead} {activeJourney.type} · {log.logType === 'surah' ? `Surah ${log.surahName}` : `Juz ${log.juz}`} (Ayah {log.ayah})
                              </p>
                              {log.notes && (
                                <p className="text-stone-600 font-medium italic mt-0.5">
                                  "{log.notes}"
                                </p>
                              )}
                            </div>
                            <span className="text-stone-500 font-semibold bg-white border border-stone-200 px-2.5 py-1 rounded-lg shrink-0">
                              {log.date}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 3. Custom Milestones Adder */}
                  <div className="mt-8 pt-6 border-t border-stone-200">
                    <h4 className="text-sm font-black text-stone-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#C89B2E]" />
                      <span>Set Custom Milestone Option</span>
                    </h4>
                    <form onSubmit={handleAddCustomMilestone} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="block text-xs font-black text-stone-500 uppercase tracking-wider">Milestone Name / Goal Description</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Reach the halfway point of Surah Al-Baqarah"
                          value={newMilestoneTitle}
                          onChange={(e) => setNewMilestoneTitle(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-black text-stone-500 uppercase tracking-wider">Target Value ({activeJourney.type})</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            required
                            placeholder="e.g. 50"
                            value={newMilestoneValue || ''}
                            onChange={(e) => setNewMilestoneValue(Number(e.target.value))}
                            className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs"
                          />
                          <button
                            type="submit"
                            className="px-5 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-black transition-all shadow-xs cursor-pointer shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* C. Completed Journeys Archive History Section (Always rendered below) */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-xs space-y-4">
            <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A] flex items-center gap-2">
              <History className="w-5 h-5 text-[#C89B2E]" />
              <span>Khatm Journey Archive & History</span>
            </h4>
            <div className="space-y-3">
              {completedJourneys.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-stone-200 rounded-2xl">
                  <p className="text-stone-400 font-bold text-sm">No completed journeys recorded yet.</p>
                  <p className="text-stone-400 font-medium text-xs mt-0.5">Finish your current journey to preserve it as a lasting history record!</p>
                </div>
              ) : (
                completedJourneys.map((j) => (
                  <div
                    key={j.id}
                    className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-bold text-[#16241A]">{j.title}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xxs font-black uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-amber-500 fill-amber-400" />
                          <span>Khatm Completed 🏆</span>
                        </span>
                      </div>
                      <p className="text-xxs sm:text-xs text-stone-500 font-bold flex flex-wrap gap-x-2 gap-y-1">
                        <span>Type: {j.type}</span>
                        <span>·</span>
                        <span>Start: {j.startDate}</span>
                        <span>·</span>
                        <span>Completion Date: {j.completedAt || j.targetFinishDate}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteCompletedJourney(j.id)}
                        className="p-2.5 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 border border-transparent transition-all cursor-pointer"
                        title="Delete journey record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* 4. TAB 3: HIFZ MEMORIZATION & REVISION STUDIO */}
      {activeTab === 'hifz' && (
        <div className="space-y-6">
          {/* Header & Quick Metrics */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#C89B2E] uppercase tracking-wider mb-2">
                  <Award className="w-5 h-5" />
                  <span>Qur'anic Memorization (Hifz) & Revision Studio</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#16241A] tracking-tight">
                  Commit, Retain & Master the Words of Allah
                </h3>
                <p className="text-sm sm:text-base text-stone-600 font-medium mt-1">
                  Structured repetition (Tikrar), active live practice sessions, and automated spaced revision schedule.
                </p>
              </div>

              {/* Action: Add Custom Task */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setShowAddTaskForm(true);
                    setHifzTabSubView('tasks');
                  }}
                  className="px-5 py-3 rounded-2xl bg-[#C89B2E] hover:bg-[#b88c24] text-white font-extrabold text-sm sm:text-base shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>+ Add Custom Hifz Task</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-stone-100">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
                  <Target className="w-4 h-4 text-[#C89B2E]" />
                  <span>Active Tasks</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-amber-950 mt-1">
                  {hifzTasks.filter((t) => t.status === 'in-progress' || t.status === 'pending').length}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <Trophy className="w-4 h-4 text-emerald-600" />
                  <span>Surahs Memorized</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">
                  {Object.values(hifzRecords).filter((r) => r.status === 'memorized').length}
                  <span className="text-sm font-bold text-stone-400"> / 114</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider">
                  <Repeat className="w-4 h-4 text-sky-600" />
                  <span>Total Repetitions</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-sky-950 mt-1">
                  {hifzTasks.reduce((sum, t) => sum + (t.completedRepetitions || 0), 0)}
                  <span className="text-xs font-bold text-stone-400"> Tikrar</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-rose-600" />
                  <span>Revisions Due</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-rose-950 mt-1">
                  {Object.values(hifzRecords).filter((r) => r.nextRevisionDue && r.nextRevisionDue <= todayStr).length}
                </p>
              </div>
            </div>
          </div>

          {/* ACTIVE HIFZ PRACTICE STUDIO (When a session is active) */}
          {activeHifzTask && (
            <div
              id="hifz-practice-studio"
              className="bg-gradient-to-br from-[#123D28] via-[#0D3320] to-[#082416] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#C89B2E] shadow-xl space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#C89B2E]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Studio Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#FBBF24]">
                      Live Memorization Session in Progress
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs font-extrabold uppercase border border-white/15">
                      {activeHifzTask.type}
                    </span>
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {activeHifzTask.title}
                  </h4>
                  <p className="text-sm font-bold text-stone-300 flex flex-wrap items-center gap-2">
                    <span>Surah {activeHifzTask.surahNumber}. {activeHifzTask.surahName}</span>
                    {activeTaskSurahMeta && (
                      <span className="font-arabic text-[#FBBF24] text-base">{activeTaskSurahMeta.arabicName}</span>
                    )}
                    <span>·</span>
                    <span>Ayahs {activeHifzTask.startAyah} to {activeHifzTask.endAyah} ({activeHifzTask.totalVersesInTask} Verses)</span>
                  </p>
                </div>

                {/* Session Timer */}
                <div className="flex items-center gap-3 bg-white/10 border border-white/15 px-4 py-2.5 rounded-2xl shrink-0 self-start sm:self-center">
                  <div className="text-right">
                    <span className="block text-xxs font-bold text-stone-300 uppercase tracking-wider">Practice Time</span>
                    <span className="text-xl sm:text-2xl font-mono font-black text-white tracking-wider">
                      {formatTimer(hifzTimerSeconds)}
                    </span>
                  </div>
                  <button
                    onClick={handleToggleTimer}
                    className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer"
                    title={isHifzTimerRunning ? "Pause practice timer" : "Resume practice timer"}
                  >
                    {isHifzTimerRunning ? <Pause className="w-5 h-5 text-amber-300" /> : <Play className="w-5 h-5 text-emerald-400 fill-emerald-400" />}
                  </button>
                </div>
              </div>

              {/* Main Interactive Studio Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* 1. Large Tactile Tikrar Repetition Counter */}
                <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between text-center space-y-4">
                  <div>
                    <div className="flex items-center justify-center gap-2 text-xs font-black text-stone-300 uppercase tracking-wider mb-2">
                      <Repeat className="w-4 h-4 text-[#FBBF24]" />
                      <span>Tikrar Repetition Tracker</span>
                    </div>
                    
                    {/* Big Counter Value */}
                    <div className="my-2">
                      <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                        {activeHifzTask.completedRepetitions}
                      </span>
                      <span className="text-2xl sm:text-3xl font-bold text-stone-400">
                        {' '}/ {activeHifzTask.targetRepetitions}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden mt-3 p-0.5 border border-white/10">
                      <div
                        className="bg-gradient-to-r from-[#C89B2E] via-[#FBBF24] to-emerald-400 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.round((activeHifzTask.completedRepetitions / activeHifzTask.targetRepetitions) * 100))}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs font-bold text-stone-300 mt-2">
                      {Math.round((activeHifzTask.completedRepetitions / activeHifzTask.targetRepetitions) * 100)}% of Repetition Goal Reached
                      {activeHifzTask.completedRepetitions >= activeHifzTask.targetRepetitions && (
                        <span className="text-emerald-400 font-black ml-1.5">✓ Target Achieved!</span>
                      )}
                    </p>
                  </div>

                  {/* Big Tap to Count Button */}
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={handleIncrementRepetition}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C89B2E] to-[#FBBF24] hover:from-[#b88c24] hover:to-[#e5ac20] text-stone-950 font-black text-base sm:text-lg uppercase tracking-wider shadow-lg active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2.5"
                    >
                      <Plus className="w-6 h-6 stroke-[3px]" />
                      <span>+1 Repetition Recited</span>
                    </button>

                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={handleDecrementRepetition}
                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        -1 Undo
                      </button>
                      <button
                        onClick={handleResetRepetition}
                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Reset Counter
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Memory Testing & Verse Peek Studio */}
                <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#FBBF24]" />
                        <span className="text-xs font-black uppercase tracking-wider text-stone-300">
                          Recall & Recitation Mode
                        </span>
                      </div>
                      
                      {/* Peek Mode Toggle */}
                      <button
                        onClick={() => setShowVersesPeek(!showVersesPeek)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border ${
                          showVersesPeek
                            ? 'bg-amber-400 text-stone-950 border-amber-300'
                            : 'bg-white/10 text-stone-200 border-white/15 hover:bg-white/15'
                        }`}
                      >
                        {showVersesPeek ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span>Hide Verses (Blind Recall)</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            <span>Peek Verses (Check Mistakes)</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Verses Preview Box */}
                    {showVersesPeek ? (
                      <div className="bg-stone-950/60 border border-white/15 rounded-xl p-5 space-y-3 max-h-56 overflow-y-auto">
                        <div className="flex items-center justify-between text-xs text-amber-300 font-bold border-b border-white/10 pb-2">
                          <span>Surah {activeHifzTask.surahName} (Ayahs {activeHifzTask.startAyah}–{activeHifzTask.endAyah})</span>
                          <span>Uthmani Arabic</span>
                        </div>
                        {activeTaskSurahMeta && activeHifzTask.surahNumber === 1 ? (
                          <div className="space-y-3 text-right">
                            <p className="font-arabic text-xl sm:text-2xl text-amber-200 leading-relaxed">
                              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝١ ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ۝٢ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝٣ مَـٰلِكِ يَوْمِ ٱلدِّينِ ۝٤ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝٥ ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ ۝٦ صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ ۝٧
                            </p>
                          </div>
                        ) : (
                          <div className="py-4 text-center space-y-2">
                            <p className="text-stone-300 text-xs sm:text-sm font-semibold">
                              Recite Ayahs {activeHifzTask.startAyah} through {activeHifzTask.endAyah} from Surah {activeHifzTask.surahName}.
                            </p>
                            <p className="text-stone-400 text-xs">
                              Need full verse text with word-by-word playback? Open this Surah in the Quran Reader tab anytime.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-stone-950/40 border border-dashed border-white/15 rounded-xl p-8 text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto text-amber-300">
                          <EyeOff className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-black text-white">Blind Recall Mode Active</p>
                        <p className="text-xs text-stone-400 max-w-sm mx-auto font-medium">
                          Close your eyes or look away to recite from your heart. Tap "Peek Verses" only when you stumble to verify pronunciation.
                        </p>
                      </div>
                    )}

                    {activeHifzTask.notes && (
                      <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-stone-300">
                        <span className="font-bold text-[#FBBF24]">Practice Note: </span>
                        <span>{activeHifzTask.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Audio Reciter Helper within Session */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
                    <div className="flex items-center gap-2 text-stone-300 font-semibold">
                      <Volume2 className="w-4 h-4 text-amber-300" />
                      <span>Audio Aid: Sheikh Mishary Alafasy</span>
                    </div>
                    <button
                      onClick={() => {
                        const surah = ALL_114_SURAH_METAS.find((s) => s.number === activeHifzTask.surahNumber);
                        if (surah) {
                          setSelectedSurah(surah);
                          setActiveTab('surahs');
                        }
                      }}
                      className="text-amber-300 hover:text-amber-200 font-bold underline cursor-pointer"
                    >
                      Open Full Surah Audio in Reader →
                    </button>
                  </div>
                </div>
              </div>

              {/* Studio Actions Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsHifzTimerRunning(false);
                      setActiveHifzTaskId(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs sm:text-sm font-bold transition-all cursor-pointer"
                  >
                    Pause & Save for Later
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Stop active session without completing?")) {
                        setActiveHifzTaskId(null);
                        setIsHifzTimerRunning(false);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl text-stone-400 hover:text-red-400 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel Session
                  </button>
                </div>

                {/* Primary Complete Task Action */}
                <button
                  onClick={handleOpenCompletionModal}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#2E8B4F] hover:bg-[#257341] text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2.5"
                >
                  <CheckCircle2 className="w-5 h-5 text-amber-300" />
                  <span>✓ Complete Task & Record Mastery</span>
                </button>
              </div>
            </div>
          )}

          {/* Subview Selector (Tasks vs 114 Directory) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
              <button
                onClick={() => setHifzTabSubView('tasks')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                  hifzTabSubView === 'tasks'
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Target className="w-4 h-4 text-[#C89B2E]" />
                <span>Memorization Tasks ({hifzTasks.length})</span>
              </button>
              <button
                onClick={() => setHifzTabSubView('scheduler')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                  hifzTabSubView === 'scheduler'
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#C89B2E]" />
                <span>114 Surahs Mastery Matrix</span>
              </button>
            </div>

            {/* Filter pills if in tasks view */}
            {hifzTabSubView === 'tasks' && (
              <div className="flex flex-wrap items-center gap-1.5">
                {(['all', 'in-progress', 'pending', 'completed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setHifzTaskFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer capitalize ${
                      hifzTaskFilter === filter
                        ? 'bg-[#16241A] text-white shadow-2xs'
                        : 'bg-stone-50 border border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {filter === 'all'
                      ? `All (${hifzTasks.length})`
                      : filter === 'in-progress'
                      ? `In Progress (${hifzTasks.filter((t) => t.status === 'in-progress').length})`
                      : filter === 'pending'
                      ? `Planned (${hifzTasks.filter((t) => t.status === 'pending').length})`
                      : `Completed (${hifzTasks.filter((t) => t.status === 'completed').length})`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* VIEW A: MEMORIZATION TASKS LIST */}
          {hifzTabSubView === 'tasks' && (
            <div className="space-y-4">
              {hifzTasks
                .filter((t) => {
                  if (hifzTaskFilter === 'in-progress') return t.status === 'in-progress';
                  if (hifzTaskFilter === 'pending') return t.status === 'pending';
                  if (hifzTaskFilter === 'completed') return t.status === 'completed';
                  return true;
                })
                .length === 0 ? (
                <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-400">
                    <Target className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-stone-800">No {hifzTaskFilter !== 'all' ? hifzTaskFilter : ''} Hifz tasks found</h4>
                  <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto font-medium">
                    Add custom Surahs or verse passages to begin memorizing and revising with live repetition tracking.
                  </p>
                  <button
                    onClick={() => setShowAddTaskForm(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#C89B2E] text-white font-extrabold text-xs uppercase tracking-wider shadow-xs hover:bg-[#b88c24] transition-all cursor-pointer"
                  >
                    + Create Your First Hifz Task
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hifzTasks
                    .filter((t) => {
                      if (hifzTaskFilter === 'in-progress') return t.status === 'in-progress';
                      if (hifzTaskFilter === 'pending') return t.status === 'pending';
                      if (hifzTaskFilter === 'completed') return t.status === 'completed';
                      return true;
                    })
                    .map((task) => {
                      const surahMeta = ALL_114_SURAH_METAS.find((s) => s.number === task.surahNumber);
                      const isTaskActive = activeHifzTaskId === task.id;
                      const percent = Math.min(100, Math.round((task.completedRepetitions / task.targetRepetitions) * 100));

                      return (
                        <div
                          key={task.id}
                          className={`rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between space-y-4 ${
                            isTaskActive
                              ? 'bg-amber-50/50 border-amber-400 shadow-md ring-2 ring-amber-300'
                              : task.status === 'completed'
                              ? 'bg-stone-50/60 border-stone-200'
                              : 'bg-white border-stone-200 hover:border-stone-300 shadow-xs'
                          }`}
                        >
                          <div className="space-y-3">
                            {/* Card Top: Badges and Title */}
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                  {/* Status badge */}
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-xxs font-black uppercase tracking-wider border ${
                                      task.status === 'completed'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : task.status === 'in-progress'
                                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                                        : 'bg-stone-100 text-stone-600 border-stone-200'
                                    }`}
                                  >
                                    {task.status === 'completed' ? '✓ Completed' : task.status === 'in-progress' ? '● In Progress' : 'Planned'}
                                  </span>

                                  {/* Type badge */}
                                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-xxs font-bold uppercase">
                                    {task.type === 'memorization' ? 'Hifz' : task.type === 'revision' ? 'Muraja\'ah' : 'Tajweed'}
                                  </span>
                                </div>

                                <h4 className="text-base sm:text-lg font-black text-[#16241A] tracking-tight">
                                  {task.title}
                                </h4>
                              </div>

                              <button
                                onClick={() => handleDeleteHifzTask(task.id)}
                                className="text-stone-300 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                                title="Delete task"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Surah details */}
                            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-600">
                              <span>Surah {task.surahNumber}. {task.surahName}</span>
                              {surahMeta && <span className="font-arabic text-amber-700 font-bold">{surahMeta.arabicName}</span>}
                              <span>·</span>
                              <span>Ayahs {task.startAyah}–{task.endAyah} ({task.totalVersesInTask} Verses)</span>
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-1.5 pt-1">
                              <div className="flex justify-between text-xs font-black">
                                <span className="text-stone-700">
                                  {task.completedRepetitions} / {task.targetRepetitions} Repetitions (Tikrar)
                                </span>
                                <span className={task.status === 'completed' ? 'text-emerald-700' : 'text-[#C89B2E]'}>
                                  {percent}%
                                </span>
                              </div>
                              <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-stone-200/80">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    task.status === 'completed'
                                      ? 'bg-emerald-500'
                                      : 'bg-gradient-to-r from-[#C89B2E] to-[#FBBF24]'
                                  }`}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>

                            {/* Notes and Date info */}
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 font-semibold pt-1">
                              <span>Due: {task.targetDate}</span>
                              {task.timeSpentSeconds ? (
                                <span>Time Spent: {Math.round(task.timeSpentSeconds / 60)} mins</span>
                              ) : null}
                              {task.masteryLevel && (
                                <span className="text-amber-600 font-bold flex items-center gap-0.5">
                                  Mastery: {'★'.repeat(task.masteryLevel)}
                                </span>
                              )}
                            </div>

                            {task.notes && (
                              <p className="text-xs text-stone-600 italic bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                                "{task.notes}"
                              </p>
                            )}
                          </div>

                          {/* Card Action Buttons */}
                          <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                            {task.status === 'completed' ? (
                              <div className="flex items-center justify-between w-full">
                                <span className="text-xs font-black text-emerald-700 flex items-center gap-1.5">
                                  <Trophy className="w-4 h-4 text-amber-500 fill-amber-400" />
                                  <span>Memorized & Recorded</span>
                                </span>
                                <button
                                  onClick={() => handleRestartTask(task.id)}
                                  className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Revise Again</span>
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between w-full gap-2">
                                <button
                                  onClick={() => handleStartHifzTask(task.id)}
                                  className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                                    isTaskActive
                                      ? 'bg-amber-500 text-white shadow-xs'
                                      : 'bg-[#16241A] hover:bg-stone-800 text-white shadow-xs'
                                  }`}
                                >
                                  <Play className="w-3.5 h-3.5 fill-white" />
                                  <span>{isTaskActive ? 'In Live Studio' : task.status === 'in-progress' ? 'Resume Session' : 'Start Task'}</span>
                                </button>

                                <button
                                  onClick={() => handleQuickCompleteTask(task.id)}
                                  className="px-3 py-2 rounded-xl text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Mark Done</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* VIEW B: 114 SURAHS MASTERY MATRIX */}
          {hifzTabSubView === 'scheduler' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#16241A] tracking-tight">
                    All 114 Surahs Directory & Spaced Repetition Matrix
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium">
                    Review your progress across all chapters. Spaced intervals automate revision so you retain your Quran for life.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {(['all', 'memorized', 'in-progress', 'needs-revision', 'not-started'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setHifzSurahStatusFilter(filter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer capitalize ${
                        hifzSurahStatusFilter === filter
                          ? 'bg-[#C89B2E] text-white shadow-2xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {filter.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar for Surahs */}
              <div className="relative">
                <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Surah by English or Arabic name, or number (e.g. Al-Kahf, 18, البقرة)..."
                  value={hifzSurahSearch}
                  onChange={(e) => setHifzSurahSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-stone-300 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs"
                />
              </div>

              {/* Surah List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {ALL_114_SURAH_METAS.filter((s) => {
                  const matchesSearch =
                    s.name.toLowerCase().includes(hifzSurahSearch.toLowerCase()) ||
                    s.arabicName.includes(hifzSurahSearch) ||
                    s.englishTranslation.toLowerCase().includes(hifzSurahSearch.toLowerCase()) ||
                    s.number.toString() === hifzSurahSearch.trim();

                  if (!matchesSearch) return false;

                  const record = hifzRecords[s.number];
                  const status = record?.status || 'not-started';

                  if (hifzSurahStatusFilter === 'memorized') return status === 'memorized';
                  if (hifzSurahStatusFilter === 'in-progress') return status === 'in-progress';
                  if (hifzSurahStatusFilter === 'needs-revision') return status === 'needs-revision';
                  if (hifzSurahStatusFilter === 'not-started') return status === 'not-started';
                  return true;
                }).map((surah) => {
                  const record = hifzRecords[surah.number] || {
                    surahNumber: surah.number,
                    status: 'not-started',
                    masteryLevel: 0,
                  };

                  const isRevisionDue = record.nextRevisionDue && record.nextRevisionDue <= todayStr;

                  return (
                    <div
                      key={surah.number}
                      className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-white hover:border-[#C89B2E] transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-sm font-black flex items-center justify-center text-[#16241A] shadow-xxs">
                          {surah.number}
                        </span>
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-base sm:text-lg font-black text-[#16241A]">{surah.name}</span>
                            <span className="text-base sm:text-lg font-arabic text-[#C89B2E] font-bold">{surah.arabicName}</span>
                            <span className="text-xs font-semibold text-stone-400">({surah.totalVerses} Ayahs)</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 font-semibold mt-0.5">
                            <span>Status: <strong className="uppercase text-[#16241A]">{record.status}</strong></span>
                            {record.nextRevisionDue && (
                              <span>· Revision due: <strong className={isRevisionDue ? 'text-rose-600 font-black' : 'text-stone-800'}>{record.nextRevisionDue}</strong></span>
                            )}
                            {isRevisionDue && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xxs font-black uppercase">
                                Due Today!
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Surah Action Row */}
                      <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                        {/* 1-click Quick Task Creator */}
                        <button
                          onClick={() => handlePrepopulateTaskForSurah(surah)}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#C89B2E]" />
                          <span>+ Create Task</span>
                        </button>

                        {/* Status Toggle Buttons */}
                        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200/80">
                          <button
                            onClick={() => updateHifzStatus(surah.number, 'not-started')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              record.status === 'not-started'
                                ? 'bg-stone-300 text-stone-900 font-black shadow-xxs'
                                : 'text-stone-600 hover:text-stone-900'
                            }`}
                          >
                            New
                          </button>
                          <button
                            onClick={() => updateHifzStatus(surah.number, 'in-progress')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              record.status === 'in-progress'
                                ? 'bg-amber-500 text-white font-black shadow-xxs'
                                : 'text-stone-600 hover:text-stone-900'
                            }`}
                          >
                            Learning
                          </button>
                          <button
                            onClick={() => updateHifzStatus(surah.number, 'memorized')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              record.status === 'memorized'
                                ? 'bg-[#2E8B4F] text-white font-black shadow-xxs'
                                : 'text-stone-600 hover:text-stone-900'
                            }`}
                          >
                            Memorized
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODAL 1: ADD CUSTOM HIFZ TASK */}
          {showAddTaskForm && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-stone-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C89B2E]">
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#16241A]">Add Custom Hifz Task</h4>
                      <p className="text-xs text-stone-500 font-semibold">Define your Surah, Ayah range, and repetition goals</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddTaskForm(false)}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateCustomTask} className="space-y-4">
                  {/* Surah Dropdown */}
                  <div className="space-y-1">
                    <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1">
                      Select Surah (Chapter)
                    </label>
                    <select
                      value={taskSurahNumber}
                      onChange={(e) => {
                        const sNum = Number(e.target.value);
                        setTaskSurahNumber(sNum);
                        const sMeta = ALL_114_SURAH_METAS.find((s) => s.number === sNum);
                        if (sMeta) {
                          setTaskStartAyah(1);
                          const end = Math.min(10, sMeta.totalVerses);
                          setTaskEndAyah(end);
                          setTaskTitle(`Memorize ${sMeta.name} (Ayahs 1-${end})`);
                        }
                      }}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs cursor-pointer"
                    >
                      {ALL_114_SURAH_METAS.map((s) => (
                        <option key={s.number} value={s.number}>
                          {s.number}. {s.name} ({s.arabicName}) · {s.totalVerses} Ayahs
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ayah Range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1">
                        Start Ayah
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={ALL_114_SURAH_METAS.find((s) => s.number === taskSurahNumber)?.totalVerses || 286}
                        value={taskStartAyah}
                        onChange={(e) => setTaskStartAyah(Number(e.target.value))}
                        className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1">
                        End Ayah
                      </label>
                      <input
                        type="number"
                        min={taskStartAyah}
                        max={ALL_114_SURAH_METAS.find((s) => s.number === taskSurahNumber)?.totalVerses || 286}
                        value={taskEndAyah}
                        onChange={(e) => setTaskEndAyah(Number(e.target.value))}
                        className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs"
                        required
                      />
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-stone-500">Quick ranges:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const sMeta = ALL_114_SURAH_METAS.find((s) => s.number === taskSurahNumber);
                        if (sMeta) {
                          setTaskStartAyah(1);
                          setTaskEndAyah(Math.min(10, sMeta.totalVerses));
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                    >
                      First 10 Ayahs
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const sMeta = ALL_114_SURAH_METAS.find((s) => s.number === taskSurahNumber);
                        if (sMeta) {
                          setTaskStartAyah(1);
                          setTaskEndAyah(sMeta.totalVerses);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                    >
                      Full Surah ({ALL_114_SURAH_METAS.find((s) => s.number === taskSurahNumber)?.totalVerses} Ayahs)
                    </button>
                  </div>

                  {/* Task Title */}
                  <div className="space-y-1">
                    <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1">
                      Task Title / Objective
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Memorize Surah Al-Kahf (Ayahs 1-10)"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs"
                    />
                  </div>

                  {/* Task Type & Target Repetitions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1">
                        Task Practice Type
                      </label>
                      <select
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value as HifzTaskType)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs cursor-pointer"
                      >
                        <option value="memorization">New Memorization (Hifz)</option>
                        <option value="revision">Revision (Muraja'ah / Dhor)</option>
                        <option value="tajweed">Tajweed & Fluency Polish</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1">
                        Tikrar (Repetition Goal)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={taskRepetitions}
                        onChange={(e) => setTaskRepetitions(Number(e.target.value))}
                        className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs"
                        required
                      />
                    </div>
                  </div>

                  {/* Target Completion Date */}
                  <div className="space-y-1">
                    <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1">
                      Target Completion Date
                    </label>
                    <input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs cursor-pointer"
                      required
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-1">
                    <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1">
                      Practice Notes & Tips (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Listen 3x to Mishary, then recite 7x from memory"
                      value={taskNotes}
                      onChange={(e) => setTaskNotes(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C89B2E] transition-all shadow-xxs"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-3 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddTaskForm(false)}
                      className="px-5 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[#C89B2E] hover:bg-[#b88c24] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Save Hifz Task</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL 2: COMPLETE TASK & RECORD MASTERY RATING */}
          {showCompletionModal && activeHifzTask && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                  <Trophy className="w-8 h-8 text-amber-500 fill-amber-400" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-2xl font-black text-[#16241A]">
                    Mabrook! Task Completed 🌟
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium">
                    You have finished practicing <strong>{activeHifzTask.title}</strong> with {activeHifzTask.completedRepetitions} repetitions!
                  </p>
                </div>

                {/* Star Mastery Selector */}
                <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <label className="block text-xs font-black text-stone-700 uppercase tracking-wider">
                    How strong was your recitation fluency?
                  </label>
                  <div className="flex items-center justify-center gap-2 py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setCompletionMastery(star)}
                        className="p-1.5 transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= completionMastery
                              ? 'text-amber-500 fill-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-bold text-stone-600">
                    {completionMastery === 5 && '⭐⭐⭐⭐⭐ Perfect Mastery (Next revision in 30 days)'}
                    {completionMastery === 4 && '⭐⭐⭐⭐ Strong Recitation (Next revision in 14 days)'}
                    {completionMastery === 3 && '⭐⭐⭐ Good / Moderate (Next revision in 7 days)'}
                    {completionMastery === 2 && '⭐⭐ Needs Polish (Next revision in 3 days)'}
                    {completionMastery === 1 && '⭐ Frequent Pauses (Next revision in 1 day)'}
                  </p>
                </div>

                {/* Reflection input */}
                <div className="text-left space-y-1">
                  <label className="block text-xs font-black text-stone-700 uppercase tracking-wider">
                    Completion Reflection (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Smooth recitation without stutter, Alhamdulillah!"
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-800 outline-none focus:border-[#C89B2E]"
                  />
                </div>

                {/* Confirm Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowCompletionModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Back to Studio
                  </button>
                  <button
                    onClick={handleConfirmCompleteTask}
                    className="px-6 py-2.5 rounded-xl bg-[#2E8B4F] hover:bg-[#257341] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 stroke-[3px]" />
                    <span>Save & Mark Completed</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
