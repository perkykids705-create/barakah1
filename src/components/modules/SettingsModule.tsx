import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import {
  CALCULATION_METHODS,
  getAllCountries,
  getCitiesForCountry,
  findLocationByCountryAndCity,
} from '../../services/prayerService';
import { Language, LocationConfig } from '../../types';
import {
  Settings,
  User,
  Globe,
  MapPin,
  Clock,
  ShieldCheck,
  LogOut,
  Save,
  Compass,
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
  
  // Country & City cascading state
  const countries = useMemo(() => {
    const list = getAllCountries();
    if (currentUser?.location?.country && !list.includes(currentUser.location.country)) {
      return [currentUser.location.country, ...list];
    }
    return list;
  }, [currentUser]);

  const initialCountry = currentUser?.location?.country || 'Saudi Arabia';
  const initialCity = currentUser?.location?.city || 'Makkah';

  // Detect if current location is custom/GPS
  const isCurrentlyCustom = useMemo(() => {
    if (!currentUser?.location) return false;
    const dbMatch = findLocationByCountryAndCity(currentUser.location.country, currentUser.location.city);
    if (!dbMatch) return true;
    return (
      Math.abs(dbMatch.latitude - currentUser.location.latitude) > 0.01 ||
      Math.abs(dbMatch.longitude - currentUser.location.longitude) > 0.01
    );
  }, [currentUser]);

  const [isCustomMode, setIsCustomMode] = useState<boolean>(isCurrentlyCustom);
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountry);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');

  // Custom coordinate entry
  const [customCity, setCustomCity] = useState<string>(currentUser?.location?.city || '');
  const [customCountry, setCustomCountry] = useState<string>(currentUser?.location?.country || '');
  const [customLat, setCustomLat] = useState<number>(currentUser?.location?.latitude || 21.4225);
  const [customLng, setCustomLng] = useState<number>(currentUser?.location?.longitude || 39.8262);
  const [customTz, setCustomTz] = useState<string>(currentUser?.location?.timezone || 'UTC');
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);

  const filteredCountries = useMemo(() => {
    if (!countryFilter.trim()) return countries;
    return countries.filter((c) => c.toLowerCase().includes(countryFilter.toLowerCase()));
  }, [countries, countryFilter]);

  const availableCities = useMemo(() => {
    const list = getCitiesForCountry(selectedCountry);
    if (currentUser?.location && currentUser.location.country === selectedCountry) {
      if (!list.some((c) => c.city.toLowerCase() === currentUser.location.city.toLowerCase())) {
        return [currentUser.location, ...list];
      }
    }
    return list;
  }, [selectedCountry, currentUser]);

  const filteredCities = useMemo(() => {
    if (!cityFilter.trim()) return availableCities;
    return availableCities.filter((c) => c.city.toLowerCase().includes(cityFilter.toLowerCase()));
  }, [availableCities, cityFilter]);

  // Current active location object for display
  const activeLocationConfig: LocationConfig = useMemo(() => {
    if (isCustomMode) {
      return {
        city: customCity.trim() || 'Custom City',
        country: customCountry.trim() || 'Custom Country',
        latitude: Number(customLat) || 0,
        longitude: Number(customLng) || 0,
        timezone: customTz || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      };
    }
    const found = findLocationByCountryAndCity(selectedCountry, selectedCity);
    if (found) return found;
    if (availableCities.length > 0) return availableCities[0];
    return currentUser?.location || {
      city: 'Makkah',
      country: 'Saudi Arabia',
      latitude: 21.4225,
      longitude: 39.8262,
      timezone: 'Asia/Riyadh',
    };
  }, [isCustomMode, customCity, customCountry, customLat, customLng, customTz, selectedCountry, selectedCity, availableCities, currentUser]);

  const [calcMethod, setCalcMethod] = useState<number>(currentUser?.calculationMethod || 2);
  const [madhab, setMadhab] = useState<'shafi' | 'hanafi'>(currentUser?.madhab || 'shafi');

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
        setCustomTz(tz);
        setGpsLoading(false);
        showNotification(`GPS detected: ${lat}°, ${lng}° (${tz})`);
      },
      (err) => {
        setGpsLoading(false);
        showNotification(`GPS error: ${err.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = activeLocationConfig;
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

        <form onSubmit={handleSave} className="space-y-6 text-sm font-semibold">
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

          {/* LOCATION SECTION: COUNTRY SELECT FIRST, THEN CITY + SEARCH + GPS */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF8F2] border border-stone-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2.5 text-[#0B2E1C]">
                <MapPin className="w-5 h-5 text-[#2E8B4F]" />
                <h4 className="text-base sm:text-lg font-black">{t('locationSettings')}</h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={gpsLoading}
                  className="px-3 py-1.5 rounded-xl bg-[#2E8B4F]/10 hover:bg-[#2E8B4F]/20 text-[#2E8B4F] text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Compass className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
                  <span>{gpsLoading ? 'Detecting GPS...' : '📍 Auto-Detect GPS'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  {isCustomMode ? '← Browse Countries' : '✏️ Custom Coordinates'}
                </button>
              </div>
            </div>

            {!isCustomMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Country */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#5D6B5A] mb-1.5">
                    {t('locationCountry')}
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 outline-none bg-white text-sm sm:text-base font-bold text-stone-800 focus:ring-2 focus:ring-[#2E8B4F]/30 cursor-pointer"
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
                  <label className="block text-xs sm:text-sm font-bold text-[#5D6B5A] mb-1.5">
                    {t('locationCity')}
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-300 outline-none bg-white text-sm sm:text-base font-bold text-stone-800 focus:ring-2 focus:ring-[#2E8B4F]/30 cursor-pointer"
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
              /* Custom Coordinates Entry */
              <div className="space-y-3 p-4 rounded-2xl bg-white border border-stone-200">
                <p className="text-xs text-stone-600 font-bold">
                  Enter any custom town, village, or exact GPS coordinates anywhere on Earth:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">City / Town Name</label>
                    <input
                      type="text"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="e.g. Cambridge or Medina Munawwarah"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Country Name</label>
                    <input
                      type="text"
                      value={customCountry}
                      onChange={(e) => setCustomCountry(e.target.value)}
                      placeholder="e.g. United Kingdom"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Latitude (°N)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={customLat}
                      onChange={(e) => setCustomLat(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Longitude (°E)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={customLng}
                      onChange={(e) => setCustomLng(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Coordinates & Astronomical Timezone Calibration Badge */}
            <div className="mt-2 p-3.5 rounded-2xl bg-white border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-stone-700 font-bold">
                <Compass className="w-4 h-4 text-[#C89B2E] shrink-0" />
                <span>
                  {activeLocationConfig.city}, {activeLocationConfig.country}
                </span>
                <span className="text-stone-400">·</span>
                <span className="text-[#2E8B4F] font-mono">
                  {activeLocationConfig.latitude.toFixed(4)}°, {activeLocationConfig.longitude.toFixed(4)}°
                </span>
                <span className="text-stone-400">·</span>
                <span className="text-stone-500 font-mono">{activeLocationConfig.timezone}</span>
              </div>
              <span className="text-[11px] text-stone-500 italic">
                {t('accurateCoordsNote')}
              </span>
            </div>
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

