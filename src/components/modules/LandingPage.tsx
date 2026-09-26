import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL, getFontFamilyClass } from '../../i18n/translations';
import { BrandMark } from '../common/BrandMark';
import { LanguageDropdown } from '../common/LanguageDropdown';
import {
  CALCULATION_METHODS,
  getAllCountries,
  getCitiesForCountry,
  findLocationByCountryAndCity,
} from '../../services/prayerService';
import { Language, LocationConfig } from '../../types';
import {
  Clock,
  BookOpen,
  Moon,
  Users,
  Coins,
  Compass,
  ArrowRight,
  CheckCircle2,
  Globe,
  Sparkles,
  ShieldCheck,
  MapPin,
  Calendar,
  Heart,
  ChevronRight,
  Sun,
  Activity,
  Layers,
  Award,
  Lock,
  Mail,
  User,
  ArrowUpRight,
} from 'lucide-react';

interface LandingPageProps {
  onSuccessfulAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSuccessfulAuth }) => {
  const { language, setLanguage, loginAs, signUpUser, showNotification } = useApp();
  const t = useTranslation(language);
  const rtl = isRTL(language);
  const fontClass = getFontFamilyClass(language);

  const [authMode, setAuthMode] = useState<'landing' | 'login' | 'signup'>('landing');

  // Interactive demo preview anchor
  const [demoAnchor, setDemoAnchor] = useState<'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'>('Dhuhr');

  // Sign up inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language>(language);

  // Country & City cascading state with search & custom GPS
  const countries = useMemo(() => getAllCountries(), []);
  const [selectedCountry, setSelectedCountry] = useState<string>('Saudi Arabia');
  const [selectedCity, setSelectedCity] = useState<string>('Makkah');
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customCity, setCustomCity] = useState<string>('');
  const [customCountry, setCustomCountry] = useState<string>('');
  const [customLat, setCustomLat] = useState<number>(21.4225);
  const [customLng, setCustomLng] = useState<number>(39.8262);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);

  const filteredCountries = useMemo(() => {
    if (!countryFilter.trim()) return countries;
    return countries.filter((c) => c.toLowerCase().includes(countryFilter.toLowerCase()));
  }, [countries, countryFilter]);

  const availableCities = useMemo(() => {
    return getCitiesForCountry(selectedCountry);
  }, [selectedCountry]);

  const filteredCities = useMemo(() => {
    if (!cityFilter.trim()) return availableCities;
    return availableCities.filter((c) => c.city.toLowerCase().includes(cityFilter.toLowerCase()));
  }, [availableCities, cityFilter]);

  const selectedLocation: LocationConfig = useMemo(() => {
    if (isCustomMode) {
      return {
        city: customCity.trim() || 'Custom City',
        country: customCountry.trim() || 'Custom Country',
        latitude: Number(customLat) || 21.4225,
        longitude: Number(customLng) || 39.8262,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      };
    }
    const found = findLocationByCountryAndCity(selectedCountry, selectedCity);
    if (found) return found;
    if (availableCities.length > 0) return availableCities[0];
    return {
      city: 'Makkah',
      country: 'Saudi Arabia',
      latitude: 21.4225,
      longitude: 39.8262,
      timezone: 'Asia/Riyadh',
    };
  }, [isCustomMode, customCity, customCountry, customLat, customLng, selectedCountry, selectedCity, availableCities]);

  const handleCountryChange = (newCountry: string) => {
    setSelectedCountry(newCountry);
    setCityFilter('');
    const cities = getCitiesForCountry(newCountry);
    if (cities.length > 0) {
      setSelectedCity(cities[0].city);
    }
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      showNotification('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lng = parseFloat(pos.coords.longitude.toFixed(4));
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        setIsCustomMode(true);
        setCustomCity('My GPS Location');
        setCustomCountry('Local Area');
        setCustomLat(lat);
        setCustomLng(lng);
        setGpsLoading(false);
        showNotification(`GPS calibrated: ${lat}°, ${lng}°`);
      },
      (err) => {
        setGpsLoading(false);
        showNotification(`GPS error: ${err.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const [calcMethod, setCalcMethod] = useState<number>(2);
  const [madhab, setMadhab] = useState<'shafi' | 'hanafi'>('shafi');
  const [errorMsg, setErrorMsg] = useState('');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ar', label: 'Arabic', native: 'العربية' },
    { code: 'ur', label: 'Urdu', native: 'اردو' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  ];

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please enter your full name and email address.');
      return;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }
    signUpUser(name.trim(), email.trim(), selectedLang, selectedLocation, calcMethod, madhab);
    onSuccessfulAuth();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setErrorMsg('Please enter your email address to sign in.');
      return;
    }
    const role = loginEmail.toLowerCase().includes('admin') ? 'admin' : 'user';
    loginAs(loginEmail.trim(), role);
    onSuccessfulAuth();
  };

  const handleQuickDemo = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      loginAs('admin@barakahdaily.com', 'admin');
    } else {
      loginAs('tariq@barakahdaily.com', 'user');
    }
    onSuccessfulAuth();
  };

  // Schedule preview data for interactive simulation
  const scheduleSamples = {
    Fajr: [
      { time: '05:15 AM', label: 'Fajr Congregational Prayer & Adhkar', tag: 'FARDH', color: 'bg-emerald-600 text-white' },
      { time: '05:45 AM', label: 'Morning Quran recitation (Juz 1 review)', tag: 'WAJIB', color: 'bg-amber-600 text-white' },
      { time: '06:30 AM', label: 'Deep strategic planning before sunrise', tag: 'NAFL', color: 'bg-stone-600 text-white' },
    ],
    Dhuhr: [
      { time: '12:30 PM', label: 'Deep Focus Work Block 1 (Deliverables)', tag: 'WAJIB', color: 'bg-amber-600 text-white' },
      { time: '01:15 PM', label: 'Dhuhr Prayer & 4 Sunnah Rawatib Rak\'ahs', tag: 'FARDH', color: 'bg-emerald-600 text-white' },
      { time: '01:45 PM', label: 'Qaylulah (Power Nap) & Post-Prayer Reflection', tag: 'SUNNAH', color: 'bg-teal-600 text-white' },
    ],
    Asr: [
      { time: '04:15 PM', label: 'Afternoon Client Meetings & Email Sync', tag: 'WAJIB', color: 'bg-amber-600 text-white' },
      { time: '04:50 PM', label: 'Asr Prayer on time & Evening Duas', tag: 'FARDH', color: 'bg-emerald-600 text-white' },
      { time: '05:20 PM', label: 'Family Islamic studies with children', tag: 'NAFL', color: 'bg-stone-600 text-white' },
    ],
    Maghrib: [
      { time: '06:40 PM', label: 'Maghrib Prayer & Awabin prayers', tag: 'FARDH', color: 'bg-emerald-600 text-white' },
      { time: '07:05 PM', label: 'Family dinner & daily gratitude reflection', tag: 'SUNNAH', color: 'bg-teal-600 text-white' },
      { time: '07:45 PM', label: 'Group Khatm recitation with community', tag: 'WAJIB', color: 'bg-amber-600 text-white' },
    ],
    Isha: [
      { time: '08:15 PM', label: 'Isha Prayer & 3 Witr Rak\'ahs', tag: 'FARDH', color: 'bg-emerald-600 text-white' },
      { time: '08:50 PM', label: 'Surah Al-Mulk recitation & sleep preparation', tag: 'SUNNAH', color: 'bg-teal-600 text-white' },
      { time: '09:30 PM', label: 'Digital detox & bedtime du\'as', tag: 'NAFL', color: 'bg-stone-600 text-white' },
    ],
  };

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} className={`min-h-screen bg-[#F7F4EC] text-[#16241A] ${fontClass} flex flex-col antialiased selection:bg-[#2E8B4F]/20 selection:text-[#0B2E1C]`}>
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#0B2E1C]/95 backdrop-blur-md border-b border-[#123D28] px-6 lg:px-12 py-4 flex items-center justify-between text-[#F3F0E4] shadow-md">
        <div className="flex items-center gap-4">
          <BrandMark variant="dark" size="md" />
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <LanguageDropdown variant="dark" />

          {authMode === 'landing' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuthMode('login')}
                className="px-4 py-2.5 rounded-xl border border-[#C89B2E]/50 hover:bg-[#123D28] text-[#F3F0E4] text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                {t('signIn')}
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#2E8B4F] hover:bg-[#257341] text-white text-xs sm:text-sm font-extrabold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>{t('signUp')}</span>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${rtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode('landing');
                setErrorMsg('');
              }}
              className="px-4 py-2 rounded-xl border border-[#C89B2E]/50 text-xs sm:text-sm font-bold text-[#F3F0E4] hover:bg-[#123D28] cursor-pointer transition-colors"
            >
              {t('backToOverview') || '← Back to Overview'}
            </button>
          )}
        </div>
      </header>

      {/* 2. AUTH MODALS OR LANDING VIEW */}
      {authMode === 'landing' ? (
        <main className="flex-1 flex flex-col justify-between">
          
          {/* HERO SECTION */}
          <section className="relative overflow-hidden bg-radial from-[#123D28] via-[#0B2E1C] to-[#06180E] text-white pt-16 pb-24 lg:pt-24 lg:pb-32 px-6 lg:px-12 border-b border-[#C89B2E]/20">
            {/* Islamic Geometry Ambient Glow */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C89B2E_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#2E8B4F]/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 space-y-8 text-center">
              
              {/* Trust Tagline */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#123D28]/80 border border-[#C89B2E]/40 text-xs sm:text-sm font-bold text-[#FBBF24] shadow-lg backdrop-blur-xs">
                <Sparkles className="w-4 h-4 text-[#FBBF24]" />
                <span>{t('heroBadge') || 'Faith-First Productivity & Islamic Life Operating System'}</span>
              </div>

              {/* Majestic Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] text-[#F3F0E4] font-serif max-w-5xl mx-auto">
                Anchor Your Life Around <span className="text-[#FBBF24]">Five Daily Prayers</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl lg:text-2xl text-[#9FB6A3] max-w-3xl mx-auto leading-relaxed font-normal">
                {t('heroSubtitle') || 'Transform your daily schedule, Quran recitation, fasting, and family spiritual growth into a synchronized system of Barakah and peace.'}
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setAuthMode('signup')}
                  className="px-8 py-4 rounded-2xl bg-[#2E8B4F] hover:bg-[#257341] text-white font-black text-base sm:text-lg shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-3 cursor-pointer"
                >
                  <span>{t('getStarted') || 'Start Free Today'}</span>
                  <ArrowRight className={`w-5 h-5 transition-transform ${rtl ? 'rotate-180' : ''}`} />
                </button>

                <button
                  onClick={() => handleQuickDemo('user')}
                  className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-[#F3F0E4] font-bold text-base sm:text-lg transition-all backdrop-blur-xs cursor-pointer flex items-center gap-2"
                >
                  <User className="w-5 h-5 text-[#FBBF24]" />
                  <span>{t('exploreDemo') || 'Instant Practitioner Demo'}</span>
                </button>

                <button
                  onClick={() => handleQuickDemo('admin')}
                  className="px-6 py-4 rounded-2xl bg-[#C89B2E]/20 hover:bg-[#C89B2E]/30 border border-[#C89B2E]/50 text-[#FBBF24] font-bold text-base sm:text-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 text-[#FBBF24]" />
                  <span>{t('adminDemo') || 'Admin Demo'}</span>
                </button>
              </div>

              {/* Verified Astronomical Standard Chip */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-[#9FB6A3]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
                  <span>Astronomical Aladhan Precision Coordinates</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
                  <span>Shafi\'i & Hanafi Asr Calculations</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
                  <span>100% Private & Free</span>
                </div>
              </div>

            </div>
          </section>

          {/* 3. INTERACTIVE PRAYER-ANCHORED DAY DEMO */}
          <section className="py-16 px-6 lg:px-12 bg-[#FAF8F2] border-b border-stone-200">
            <div className="max-w-6xl mx-auto space-y-10">
              
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#2E8B4F]">
                  Experience The Flow
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0B2E1C] font-serif">
                  A Day Anchored Around Prayer
                </h2>
                <p className="text-sm sm:text-base text-stone-600">
                  Click any prayer anchor to see how BarakahDaily structures your deep work, worship, and family time around the divine timings:
                </p>
              </div>

              {/* Prayer Anchor Selector Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const).map((prayer) => {
                  const isActive = demoAnchor === prayer;
                  return (
                    <button
                      key={prayer}
                      onClick={() => setDemoAnchor(prayer)}
                      className={`px-5 py-3 rounded-2xl font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center gap-2 ${
                        isActive
                          ? 'bg-[#0B2E1C] text-[#FBBF24] shadow-lg scale-105'
                          : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <Clock className={`w-4 h-4 ${isActive ? 'text-[#FBBF24]' : 'text-stone-400'}`} />
                      <span>{prayer}</span>
                    </button>
                  );
                })}
              </div>

              {/* Interactive Schedule Box */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#2E8B4F]/20 shadow-xl max-w-3xl mx-auto space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#2E8B4F]" />
                    <h3 className="text-lg sm:text-xl font-black text-stone-900 font-serif">
                      {demoAnchor} Focus & Routine Horizon
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-[#2E8B4F] bg-[#E1F2E7] px-3 py-1 rounded-full">
                    Active Synchronized Zone
                  </span>
                </div>

                <div className="space-y-3">
                  {scheduleSamples[demoAnchor].map((block, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-[#FAF8F2] border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#2E8B4F]/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm sm:text-base font-extrabold text-[#0B2E1C] font-mono min-w-[80px]">
                          {block.time}
                        </span>
                        <span className="text-sm sm:text-base font-bold text-stone-800">
                          {block.label}
                        </span>
                      </div>
                      <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${block.color} self-start sm:self-auto`}>
                        {block.tag}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => setAuthMode('signup')}
                    className="inline-flex items-center gap-2 text-sm font-black text-[#2E8B4F] hover:text-[#257341] hover:underline cursor-pointer"
                  >
                    <span>Customize your daily prayer routine blocks</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* 4. SIX CORE PILLARS GRID */}
          <section className="py-20 px-6 lg:px-12 bg-white border-b border-stone-200">
            <div className="max-w-6xl mx-auto space-y-12">
              
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#2E8B4F]">
                  Comprehensive Islamic Ecosystem
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-[#0B2E1C] font-serif">
                  Everything For Your Spiritual Journey
                </h2>
                <p className="text-base sm:text-lg text-stone-600">
                  Six purpose-built modules working in complete harmony to elevate your daily practice:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[
                  {
                    title: 'Prayer-Anchored Planner',
                    subtitle: 'Align your calendar with the 5 prayers',
                    desc: 'Schedule focus sessions, deep work, and family priorities as offsets before and after Fajr, Dhuhr, Asr, Maghrib, and Isha with Fardh, Wajib, and Nafl classifications.',
                    icon: Clock,
                    accent: '#2E8B4F',
                    tint: '#E1F2E7',
                  },
                  {
                    title: 'Quran & Hifz Companion',
                    subtitle: 'Reading pacing & spaced revision',
                    desc: 'Track daily page targets, 30 Juz Khatm schedules, memorization status with color-coded retention states, and full 114 Surah directory reader.',
                    icon: BookOpen,
                    accent: '#C89B2E',
                    tint: '#FAF0D8',
                  },
                  {
                    title: 'Ramadan & Fasting Hub',
                    subtitle: 'Suhoor, Iftar, Taraweeh & Itikaf',
                    desc: 'Countdown to holy month, 30-day fasting log, missed fast fidya calculator, Odd Nights Laylatul Qadr worship guide, and complete Eid checklist.',
                    icon: Moon,
                    accent: '#5B3FA8',
                    tint: '#ECE7F8',
                  },
                  {
                    title: 'Collective Khatm Circles',
                    subtitle: 'Unite family and community in Quran',
                    desc: 'Create group tasks with shareable invite codes. Family members claim individual Paras or Surah repetitions (e.g. Surah Ya-Sin) to complete Khatms together.',
                    icon: Users,
                    accent: '#0E8C74',
                    tint: '#DAF3EC',
                  },
                  {
                    title: 'Multi-Method Zakat Calculator',
                    subtitle: 'Gold & Silver Nisab precision',
                    desc: 'Calculate exact 2.5% Zakat across savings, gold grams, investments, and business inventory with live deductible debt adjustments and Sadaqah ledger.',
                    icon: Coins,
                    accent: '#C1541F',
                    tint: '#FAE5D8',
                  },
                  {
                    title: 'Family Household Mode',
                    subtitle: 'Cultivate devotion across generations',
                    desc: 'Manage child and spouse sub-profiles, monitor prayer completion streaks, track age-appropriate Quran milestones, and encourage righteous habits.',
                    icon: Compass,
                    accent: '#1D7A9C',
                    tint: '#DCF0F6',
                  },
                ].map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={idx}
                      className="p-8 rounded-3xl border-2 border-stone-200/80 bg-[#FAF8F2]/60 hover:bg-white hover:border-[#2E8B4F]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group"
                    >
                      <div className="space-y-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                          style={{ backgroundColor: feat.tint, color: feat.accent }}
                        >
                          <Icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-black text-stone-900 font-serif">
                          {feat.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-bold text-[#2E8B4F]">
                          {feat.subtitle}
                        </p>
                        <p className="text-sm text-stone-600 leading-relaxed">
                          {feat.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-200/50 flex items-center justify-between text-xs font-bold text-stone-500">
                        <span>Module {idx + 1} of 6</span>
                        <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#2E8B4F] transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </section>

          {/* 5. BOTTOM CALL TO ACTION */}
          <section className="bg-[#0B2E1C] text-white py-20 px-6 lg:px-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C89B2E_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="max-w-4xl mx-auto space-y-6 relative z-10">
              <h2 className="text-3xl sm:text-5xl font-black font-serif text-[#F3F0E4]">
                Begin Your Journey With Barakah Today
              </h2>
              <p className="text-base sm:text-xl text-[#9FB6A3] max-w-2xl mx-auto">
                Join thousands of Muslims structuring their daily productivity, Quran recitation, and prayer times with peace of mind.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setAuthMode('signup')}
                  className="px-9 py-4 rounded-2xl bg-[#FBBF24] hover:bg-[#e6ad1c] text-[#0B2E1C] font-black text-lg sm:text-xl shadow-2xl transition-transform active:scale-95 cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Create Your Free Account</span>
                  <ArrowRight className={`w-5 h-5 transition-transform ${rtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="bg-[#06180E] text-[#9FB6A3] px-6 lg:px-12 py-10 text-center text-sm border-t border-[#123D28]">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-serif font-black text-white text-base">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]" />
                <span>BarakahDaily</span>
              </div>
              <p className="text-xs text-stone-400">
                Astronomical calculations via Aladhan API · Respecting all Islamic Juristic Traditions
              </p>
              <div className="flex items-center gap-4 text-xs font-bold text-[#F3F0E4]">
                <button onClick={() => setAuthMode('login')} className="hover:underline cursor-pointer">Sign In</button>
                <span>·</span>
                <button onClick={() => setAuthMode('signup')} className="hover:underline cursor-pointer">Sign Up</button>
              </div>
            </div>
          </footer>

        </main>
      ) : authMode === 'signup' ? (
        
        /* ========================================================================= */
        /* SIGN UP WIZARD - LARGE, CRISP, ULTRA-READABLE TYPOGRAPHY & FORMS          */
        /* ========================================================================= */
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-[#FAF8F2]">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-stone-200 shadow-2xl max-w-2xl w-full space-y-8 animate-in fade-in duration-200">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-[#E1F2E7] text-[#2E8B4F] mb-1">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0B2E1C] font-serif tracking-tight">
                {t('createAccount') || 'Create Your Account'}
              </h2>
              <p className="text-sm sm:text-base text-stone-600 font-medium max-w-md mx-auto">
                Set up your profile, local coordinates, and calculation preferences for precise prayer alerts.
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-800 text-sm sm:text-base font-bold flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-6">
              
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm sm:text-base font-bold text-stone-900 mb-2">
                    {t('fullNameLabel') || 'Full Name'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Tariq Al-Mansoor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-300 text-stone-900 text-base sm:text-lg font-bold placeholder-stone-400 outline-none focus:border-[#2E8B4F] focus:ring-4 focus:ring-[#2E8B4F]/10 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-bold text-stone-900 mb-2">
                    {t('emailAddressLabel') || 'Email Address'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-300 text-stone-900 text-base sm:text-lg font-bold placeholder-stone-400 outline-none focus:border-[#2E8B4F] focus:ring-4 focus:ring-[#2E8B4F]/10 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm sm:text-base font-bold text-stone-900 mb-2">
                    {t('passwordLabel') || 'Password'}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-300 text-stone-900 text-base sm:text-lg font-bold placeholder-stone-400 outline-none focus:border-[#2E8B4F] focus:ring-4 focus:ring-[#2E8B4F]/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-bold text-stone-900 mb-2">
                    {t('confirmPasswordLabel') || 'Confirm Password'}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-300 text-stone-900 text-base sm:text-lg font-bold placeholder-stone-400 outline-none focus:border-[#2E8B4F] focus:ring-4 focus:ring-[#2E8B4F]/10 transition-all"
                  />
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-stone-900 mb-2">
                  {t('preferredLangLabel') || 'Preferred Language'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setSelectedLang(l.code)}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                        selectedLang === l.code
                          ? 'border-[#2E8B4F] bg-[#E1F2E7] text-[#0B2E1C] font-black shadow-xs'
                          : 'border-stone-200 bg-white text-stone-700 font-semibold hover:border-stone-300'
                      }`}
                    >
                      <span className="block text-sm sm:text-base font-bold">{l.label}</span>
                      <span className="block text-xs text-stone-500">{l.native}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* LOCATION & TIMEZONE SECTION */}
              <div className="p-6 rounded-3xl bg-[#FAF8F2] border-2 border-stone-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
                  <div className="flex items-center gap-2 text-[#0B2E1C]">
                    <MapPin className="w-5 h-5 text-[#2E8B4F]" />
                    <h4 className="text-base sm:text-lg font-black">{t('locationSettings') || 'Location & Astronomical Coordinates'}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDetectGPS}
                      disabled={gpsLoading}
                      className="px-3 py-1.5 rounded-xl bg-[#2E8B4F]/10 hover:bg-[#2E8B4F]/20 text-[#2E8B4F] text-xs font-black transition-colors cursor-pointer"
                    >
                      {gpsLoading ? 'Detecting...' : '📍 Auto-Detect GPS'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCustomMode(!isCustomMode)}
                      className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {isCustomMode ? '← Preset List' : '✏️ Custom Lat/Lng'}
                    </button>
                  </div>
                </div>

                {!isCustomMode ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Country */}
                    <div>
                      <label className="block text-sm font-bold text-stone-800 mb-2">
                        {t('locationCountry') || 'Country'}
                      </label>
                      <select
                        value={selectedCountry}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-300 bg-white text-base font-bold text-stone-900 outline-none focus:border-[#2E8B4F] focus:ring-4 focus:ring-[#2E8B4F]/10 transition-all cursor-pointer"
                      >
                        {countries.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-bold text-stone-800 mb-2">
                        {t('locationCity') || 'City'}
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-300 bg-white text-base font-bold text-stone-900 outline-none focus:border-[#2E8B4F] focus:ring-4 focus:ring-[#2E8B4F]/10 transition-all cursor-pointer"
                      >
                        {availableCities.map((loc) => (
                          <option key={loc.city} value={loc.city}>
                            {loc.city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  /* Custom coordinates entry */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white rounded-2xl border border-stone-200">
                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">Custom Town Name</label>
                      <input
                        type="text"
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        placeholder="e.g. Cambridge"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">Custom Country Name</label>
                      <input
                        type="text"
                        value={customCountry}
                        onChange={(e) => setCustomCountry(e.target.value)}
                        placeholder="e.g. United Kingdom"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">Latitude (°N)</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={customLat}
                        onChange={(e) => setCustomLat(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-600 mb-1">Longitude (°E)</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={customLng}
                        onChange={(e) => setCustomLng(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono font-bold"
                      />
                    </div>
                  </div>
                )}

                {/* Calibrated Coordinates Badge */}
                <div className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-between text-xs sm:text-sm font-bold text-stone-700">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#C89B2E]" />
                    <span>{selectedLocation.city}, {selectedLocation.country}</span>
                  </div>
                  <span className="text-[#2E8B4F] font-mono font-black">
                    {selectedLocation.latitude.toFixed(4)}°, {selectedLocation.longitude.toFixed(4)}°
                  </span>
                </div>
              </div>

              {/* Calculation Method & Asr Madhab */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm sm:text-base font-bold text-stone-900 mb-2">
                    {t('calcMethodLabel') || 'Calculation Method'}
                  </label>
                  <select
                    value={calcMethod}
                    onChange={(e) => setCalcMethod(Number(e.target.value))}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-300 bg-white text-sm sm:text-base font-bold text-stone-900 outline-none focus:border-[#2E8B4F]"
                  >
                    {CALCULATION_METHODS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-bold text-stone-900 mb-2">
                    {t('juristicMadhabLabel') || 'Asr Juristic Timing (Madhab)'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMadhab('shafi')}
                      className={`py-3.5 px-3 rounded-2xl border-2 text-center text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        madhab === 'shafi'
                          ? 'border-[#2E8B4F] bg-[#2E8B4F] text-white shadow-sm'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      {t('standardMadhab') || 'Shafi\'i / Standard'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMadhab('hanafi')}
                      className={`py-3.5 px-3 rounded-2xl border-2 text-center text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        madhab === 'hanafi'
                          ? 'border-[#2E8B4F] bg-[#2E8B4F] text-white shadow-sm'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      {t('hanafiMadhab') || 'Hanafi (Later Asr)'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4.5 px-6 rounded-2xl bg-[#0B2E1C] hover:bg-[#123D28] text-[#FBBF24] font-black text-base sm:text-lg tracking-wide transition-all shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-3 border border-[#C89B2E]/40"
              >
                <span>{t('completeOnboardingBtn') || 'Bismillah — Begin My Journey'}</span>
                <ArrowRight className={`w-5 h-5 text-[#FBBF24] shrink-0 transition-transform ${rtl ? 'rotate-180' : ''}`} />
              </button>

            </form>

            <div className="text-center text-sm sm:text-base font-semibold text-stone-600 pt-4 border-t border-stone-200">
              {t('haveAccount') || 'Already have an account?'}{' '}
              <button
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg('');
                }}
                className="font-black text-[#2E8B4F] hover:underline cursor-pointer"
              >
                {t('signIn') || 'Sign In here'}
              </button>
            </div>

          </div>
        </main>
      ) : (

        /* ========================================================================= */
        /* SIGN IN MODAL - LARGE, CRISP, ULTRA-READABLE TYPOGRAPHY                   */
        /* ========================================================================= */
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-[#FAF8F2]">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-stone-200 shadow-2xl max-w-lg w-full space-y-8 animate-in fade-in duration-200">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-[#FAF0D8] text-[#C89B2E] mb-1">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0B2E1C] font-serif tracking-tight">
                {t('welcomeBack') || 'Welcome Back'}
              </h2>
              <p className="text-sm sm:text-base text-stone-600 font-medium">
                {t('loginSubtitle') || 'Sign in to access your synchronized prayer routines and Quran progress.'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-800 text-sm sm:text-base font-bold flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm sm:text-base font-bold text-stone-900 mb-2">
                  {t('emailAddressLabel') || 'Email Address'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="tariq@barakahdaily.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-300 text-stone-900 text-base sm:text-lg font-bold placeholder-stone-400 outline-none focus:border-[#2E8B4F] focus:ring-4 focus:ring-[#2E8B4F]/10 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-bold text-stone-900 mb-2">
                  {t('passwordLabel') || 'Password'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-300 text-stone-900 text-base sm:text-lg font-bold placeholder-stone-400 outline-none focus:border-[#2E8B4F] focus:ring-4 focus:ring-[#2E8B4F]/10 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#0B2E1C] hover:bg-[#123D28] text-[#FBBF24] font-black text-base sm:text-lg uppercase tracking-wider transition-all shadow-xl hover:shadow-2xl cursor-pointer"
              >
                {t('signIn') || 'Sign In to Account'}
              </button>
            </form>

            {/* Quick 1-Click Demo Accounts */}
            <div className="pt-6 border-t-2 border-stone-100 space-y-3">
              <p className="text-xs sm:text-sm text-center text-stone-500 font-extrabold uppercase tracking-wider">
                {t('instantDemoAccess') || 'Or Instant 1-Click Demo Access'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('user')}
                  className="py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-sm sm:text-base font-extrabold transition-all cursor-pointer text-center"
                >
                  {t('exploreDemo') || 'Daily User'}
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="py-3 px-4 rounded-2xl bg-[#FAF0D8] hover:bg-[#faebd0] text-[#C89B2E] text-sm sm:text-base font-extrabold transition-all cursor-pointer text-center"
                >
                  {t('adminDemo') || 'System Admin'}
                </button>
              </div>
            </div>

            <div className="text-center text-sm sm:text-base font-semibold text-stone-600 pt-2">
              {t('noAccount') || 'Don\'t have an account yet?'}{' '}
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMsg('');
                }}
                className="font-black text-[#2E8B4F] hover:underline cursor-pointer"
              >
                {t('signUp') || 'Create Free Account'}
              </button>
            </div>

          </div>
        </main>
      )}

    </div>
  );
};
