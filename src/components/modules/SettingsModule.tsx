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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-xl font-extrabold text-[#16241A]">{t('accountSettings')}</h3>
            <p className="text-xs text-[#5D6B5A]">{t('manageLocationMethods')}</p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold uppercase">
            {t('roleLabel')}: {t(currentUser?.role || 'user')}
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
          {/* Display Name */}
          <div>
            <label className="block text-[#5D6B5A] mb-1">{t('displayNameLabel')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none text-xs font-bold"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#5D6B5A] mb-1">{t('emailAddressLabel')}</label>
            <input
              type="email"
              value={currentUser?.email || ''}
              disabled
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 text-xs font-semibold cursor-not-allowed"
            />
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-[#5D6B5A] mb-1">{t('appWideLanguage')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setSelectedLang(l.code)}
                  className={`p-2.5 rounded-xl border text-left transition-colors ${
                    selectedLang === l.code
                      ? 'bg-[#2E8B4F] text-white border-[#2E8B4F] font-bold'
                      : 'bg-white border-stone-200 text-stone-700'
                  }`}
                >
                  <span className="block text-xs">{l.label}</span>
                  <span className="block text-[11px] opacity-80">{l.native}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Picker */}
          <div>
            <label className="block text-[#5D6B5A] mb-1">{t('locationCity')}</label>
            <select
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none bg-white text-xs font-bold"
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
            <label className="block text-[#5D6B5A] mb-1">{t('calculationMethod')}</label>
            <select
              value={calcMethod}
              onChange={(e) => setCalcMethod(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none bg-white text-xs font-bold"
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
            <label className="block text-[#5D6B5A] mb-1">{t('asrMadhab')}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMadhab('shafi')}
                className={`py-2 rounded-xl border text-xs font-bold ${
                  madhab === 'shafi' ? 'bg-[#2E8B4F] text-white' : 'bg-stone-50 text-stone-700'
                }`}
              >
                {t('standardMadhab')}
              </button>
              <button
                type="button"
                onClick={() => setMadhab('hanafi')}
                className={`py-2 rounded-xl border text-xs font-bold ${
                  madhab === 'hanafi' ? 'bg-[#2E8B4F] text-white' : 'bg-stone-50 text-stone-700'
                }`}
              >
                {t('hanafiMadhab')}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#2E8B4F] hover:bg-[#257341] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{t('saveSettingsBtn')}</span>
          </button>
        </form>

        {/* Accountability & Privacy Notice (PRD §4.6) */}
        <div className="pt-4 border-t border-stone-100 text-xs text-[#5D6B5A] space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-[#16241A]">
            <ShieldCheck className="w-4 h-4 text-[#2E8B4F]" />
            <span>{t('platformPrivacy')}</span>
          </div>
          <p className="leading-relaxed">
            {t('platformPrivacyDesc')}
          </p>
        </div>

        {/* Quick Role Switcher for Testing (Admin / User) */}
        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {currentUser?.role === 'admin' ? (
            <button
              onClick={() => loginAs('tariq@barakahdaily.com', 'user')}
              className="text-xs text-[#5D6B5A] hover:underline"
            >
              {t('switchToUserMode')}
            </button>
          ) : (
            <button
              onClick={() => loginAs('admin@barakahdaily.com', 'admin')}
              className="text-xs font-bold text-[#C89B2E] hover:underline"
            >
              {t('switchToAdminMode')}
            </button>
          )}

          <button
            onClick={signOut}
            className="px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition-colors"
          >
            {t('signOut')}
          </button>
        </div>
      </div>
    </div>
  );
};
