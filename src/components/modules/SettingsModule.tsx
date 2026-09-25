import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import { CALCULATION_METHODS, POPULAR_LOCATIONS } from '../../services/prayerService';
import { Language } from '../../types';
import {
  Settings,
  User,
  Globe,
  MapPin,
  Clock,
  ShieldCheck,
  LogOut,
  Save,
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const {
    currentUser,
    language,
    setLanguage,
    updateProfile,
    signOut,
    loginAs,
    showNotification,
  } = useApp();

  const t = useTranslation(language);
  const rtl = isRTL(language);

  const [name, setName] = useState(currentUser?.name || '');
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [cityName, setCityName] = useState(currentUser?.location.city || 'London');
  const [calcMethod, setCalcMethod] = useState(currentUser?.calculationMethod || 2);
  const [madhab, setMadhab] = useState<'shafi' | 'hanafi'>(currentUser?.madhab || 'shafi');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = POPULAR_LOCATIONS.find((l) => l.city === cityName) || currentUser?.location;
    updateProfile({
      name: name.trim(),
      language: selectedLang,
      location: loc,
      calculationMethod: calcMethod,
      madhab,
    });
    setLanguage(selectedLang);
  };

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ar', label: 'Arabic', native: 'العربية' },
    { code: 'ur', label: 'Urdu', native: 'اردو' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-stone-100 gap-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#16241A]">{t('accountSettings')}</h3>
            <p className="text-sm sm:text-base text-[#5D6B5A] mt-1">{t('manageLocationMethods')}</p>
          </div>
          <span className="self-start sm:self-auto px-3.5 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-extrabold uppercase">
            {t('roleLabel')}: {t(currentUser?.role || 'user')}
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-sm font-semibold">
          {/* Display Name */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#5D6B5A] mb-1.5">{t('displayNameLabel')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 outline-none text-sm sm:text-base font-bold text-stone-800 focus:ring-2 focus:ring-[#2E8B4F]/30"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#5D6B5A] mb-1.5">{t('emailAddressLabel')}</label>
            <input
              type="email"
              value={currentUser?.email || ''}
              disabled
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 text-stone-500 text-sm sm:text-base font-semibold cursor-not-allowed"
            />
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#5D6B5A] mb-2">{t('appWideLanguage')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setSelectedLang(l.code)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedLang === l.code
                      ? 'bg-[#2E8B4F] text-white border-[#2E8B4F] font-extrabold shadow-sm'
                      : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <span className="block text-sm sm:text-base font-bold">{l.label}</span>
                  <span className="block text-xs sm:text-sm opacity-85 mt-0.5">{l.native}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Picker */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#5D6B5A] mb-1.5">{t('locationCity')}</label>
            <select
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 outline-none bg-white text-sm sm:text-base font-bold focus:ring-2 focus:ring-[#2E8B4F]/30"
            >
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc.city} value={loc.city}>
                  {loc.city}, {loc.country}
                </option>
              ))}
            </select>
          </div>

          {/* Prayer Calculation Method */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#5D6B5A] mb-1.5">{t('calculationMethod')}</label>
            <select
              value={calcMethod}
              onChange={(e) => setCalcMethod(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 outline-none bg-white text-sm sm:text-base font-bold focus:ring-2 focus:ring-[#2E8B4F]/30"
            >
              {CALCULATION_METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Asr Madhab Toggle */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#5D6B5A] mb-1.5">{t('asrMadhab')}</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMadhab('shafi')}
                className={`py-3 px-4 rounded-2xl border text-sm sm:text-base font-extrabold cursor-pointer transition-colors ${
                  madhab === 'shafi' ? 'bg-[#2E8B4F] text-white shadow-xs' : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                {t('standardMadhab')}
              </button>
              <button
                type="button"
                onClick={() => setMadhab('hanafi')}
                className={`py-3 px-4 rounded-2xl border text-sm sm:text-base font-extrabold cursor-pointer transition-colors ${
                  madhab === 'hanafi' ? 'bg-[#2E8B4F] text-white shadow-xs' : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                {t('hanafiMadhab')}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#2E8B4F] hover:bg-[#257341] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <Save className="w-5 h-5" />
            <span>{t('saveSettingsBtn')}</span>
          </button>
        </form>

        {/* Accountability & Privacy Notice (PRD §4.6) */}
        <div className="pt-5 border-t border-stone-100 text-xs sm:text-sm text-[#5D6B5A] space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#16241A]">
            <ShieldCheck className="w-5 h-5 text-[#2E8B4F]" />
            <span className="text-sm sm:text-base">{t('platformPrivacy')}</span>
          </div>
          <p className="leading-relaxed">
            {t('platformPrivacyDesc')}
          </p>
        </div>

        {/* Quick Role Switcher for Testing (Admin / User) */}
        <div className="pt-5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {currentUser?.role === 'admin' ? (
            <button
              onClick={() => loginAs('tariq@barakahdaily.com', 'user')}
              className="text-xs sm:text-sm text-[#5D6B5A] hover:underline cursor-pointer font-bold"
            >
              {t('switchToUserMode')}
            </button>
          ) : (
            <button
              onClick={() => loginAs('admin@barakahdaily.com', 'admin')}
              className="text-xs sm:text-sm font-extrabold text-[#C89B2E] hover:underline cursor-pointer"
            >
              {t('switchToAdminMode')}
            </button>
          )}

          <button
            onClick={signOut}
            className="px-5 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 text-xs sm:text-sm font-extrabold transition-colors cursor-pointer"
          >
            {t('signOut')}
          </button>
        </div>
      </div>
    </div>
  );
};
