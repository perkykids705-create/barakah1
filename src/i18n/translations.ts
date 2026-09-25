import { Language } from '../types';
import { TRANSLATIONS_EXTENDED } from './translationsExtended';

export const isRTL = (lang: Language): boolean => {
  return lang === 'ar' || lang === 'ur';
};

export const getFontFamilyClass = (lang: Language): string => {
  switch (lang) {
    case 'ar':
      return 'font-arabic';
    case 'ur':
      return 'font-urdu';
    case 'hi':
      return 'font-hindi';
    case 'bn':
      return 'font-bengali';
    default:
      return 'font-sans';
  }
};

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Brand & App
    appName: 'BarakahDaily',
    tagline: 'Organize your spiritual and daily life around the five daily prayers',
    welcomeBack: 'Welcome back',
    nextPrayer: 'Next Prayer',
    timeRemaining: 'remaining',
    prayerViaAladhan: 'Prayer times & Hijri date via Aladhan API',
    
    // Navigation
    navHome: 'Home',
    navPrayer: 'Prayer',
    navQuran: 'Qur\'an',
    navRamadan: 'Ramadan',
    navProductivity: 'Planner',
    navSpiritual: 'Spiritual',
    navZakat: 'Zakat & Charity',
    navGroupKhatm: 'Group Khatm',
    navFamily: 'Family',
    navSettings: 'Settings',
    navAdmin: 'Admin',
    navMore: 'More',
    signOut: 'Sign Out',

    // Prayers
    Fajr: 'Fajr',
    Sunrise: 'Sunrise',
    Dhuhr: 'Dhuhr',
    Asr: 'Asr',
    Maghrib: 'Maghrib',
    Isha: 'Isha',
    Qiyam: 'Tahajjud / Qiyam',
    statusOnTime: 'On time',
    statusLate: 'Late',
    statusMissed: 'Missed',
    statusQada: 'Qada',
    prayerTracker: 'Prayer Tracker',
    todayStreak: 'Day Streak',
    qadaTracker: 'Missed Prayers (Qada)',
    qadaMakeUp: 'Make Up Missed Prayer',
    sunnahTracker: 'Sunnah & Voluntary Prayers',
    tahajjud: 'Tahajjud (Night Prayer)',
    duha: 'Duha (Forenoon)',
    witr: 'Witr',
    rawatib: 'Sunnah Rawatib Rak\'ahs',

    // Quran
    quranTracker: 'Qur\'an Tracker',
    khatmProgress: 'Khatm Progress',
    pagesReadToday: 'Pages Read Today',
    logPages: 'Log Pages',
    surahDirectory: 'Surahs & Reading',
    hifzTracker: 'Hifz Memorization Tracker',
    memorized: 'Memorized',
    inProgress: 'In Progress',
    needsRevision: 'Needs Revision',
    notStarted: 'Not Started',
    spacedRevision: 'Spaced Repetition Schedule',
    projectedFinish: 'Projected finish date',

    // Ramadan
    ramadanTitle: 'Ramadan Hub',
    daysUntilRamadan: 'Days Until Ramadan',
    suhoorEnds: 'Suhoor Ends (Fajr)',
    iftarTime: 'Iftar Time (Maghrib)',
    fastingTrackerGrid: '30-Day Ramadan Tracker Grid',
    fasted: 'Fasted',
    fastedExcused: 'Excused',
    notFasted: 'Not Fasted',
    taraweehTracker: 'Taraweeh Tracker',
    laylatulQadrTitle: 'Laylatul Qadr (Odd Nights)',
    laylatulQadrDua: 'O Allah, You are Most Forgiving, and You love forgiveness; so forgive me.',
    itikafMode: 'I\'tikaf Mode',
    iftarPlanner: 'Iftar Meal & Grocery Planner',
    fidyaCalculator: 'Fidya & Kaffarah Calculator',
    eidChecklist: 'Eid Prep & Zakat al-Fitr',

    // Productivity
    productivityTitle: 'Prayer-Anchored Planner',
    islamicPriorities: 'Islamic Priority Tags',
    fardh: 'Fardh (Obligatory)',
    wajib: 'Wajib (Necessary)',
    nafl: 'Nafl (Voluntary)',
    habitsTitle: 'Habit Tracker',
    weeklyReview: 'Weekly & Monthly Review',
    addTask: 'Add Prayer-Anchored Task',

    // Zakat
    zakatTitle: 'Zakat & Sadaqah Hub',
    calculateZakat: 'Calculate Zakat',
    nisabExplanation: 'Nisab is the minimum net asset threshold (87.48g gold or 612.36g silver) held for one lunar year. 2.5% is payable on the surplus.',
    cashSavings: 'Cash & Bank Balances',
    goldSilver: 'Gold & Silver Value',
    businessAssets: 'Business & Trade Goods',
    investments: 'Liquid Investments',
    debtsDue: 'Immediate Liabilities / Debts',
    zakatDueAmount: 'Total Zakat Payable',
    sadaqahLog: 'Sadaqah (Voluntary Charity) Log',
    addSadaqah: 'Log Charity',

    // Reflection & Tools
    qiblaCompass: 'Qibla Direction',
    bearingTowardsKaaba: 'Degrees towards the Holy Kaaba in Makkah',
    digitalTasbih: 'Digital Tasbih Counter',
    tapToCount: 'Tap to Count',
    resetCount: 'Reset',
    gratitudeJournal: 'Daily Gratitude & Niyyah',
    islamicEvents: 'Key Islamic Calendar Dates',

    // Group Khatm
    groupKhatmTitle: 'Group Qur\'an Khatm',
    createKhatm: 'Create Khatm Task',
    joinKhatm: 'Join with Code',
    claimPara: 'Claim Para (Juz)',
    claimCount: 'Claim Repetitions',
    completedKhatm: 'Khatm Completed! Mubarak!',
    activeTasks: 'Active Group Khatm Tasks',

    // Family
    familyTitle: 'Family Mode',
    manageProfiles: 'Manage Household Profiles',
    childProgress: 'Children Progress & Prayers',

    // Settings & Landing
    accountSettings: 'Account Settings',
    calculationMethod: 'Calculation Method',
    asrMadhab: 'Asr Calculation (Juristic)',
    locationSettings: 'Location & Timezone',
    selectLanguage: 'Select Language',
    getStarted: 'Get Started Free',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    demoAdminLogin: 'Demo Operator Admin',
    demoUserLogin: 'Demo Daily Practitioner',
  },
  ar: {
    // Brand & App
    appName: 'بركة ديلي',
    tagline: 'نظّم حياتك الروحية واليومية حول الصلوات الخمس المفروضة',
    welcomeBack: 'مرحباً بك مجدداً',
    nextPrayer: 'الصلاة القادمة',
    timeRemaining: 'متبقي',
    prayerViaAladhan: 'مواقيت الصلاة والتاريخ الهجري بواسطة Aladhan API',
    
    // Navigation
    navHome: 'الرئيسية',
    navPrayer: 'الصلوات',
    navQuran: 'القرآن',
    navRamadan: 'رمضان',
    navProductivity: 'المخطط',
    navSpiritual: 'الروحانيات',
    navZakat: 'الزكاة والصدقات',
    navGroupKhatm: 'ختمات جماعية',
    navFamily: 'العائلة',
    navSettings: 'الإعدادات',
    navAdmin: 'لوحة الإدارة',
    navMore: 'المزيد',
    signOut: 'تسجيل الخروج',

    // Prayers
    Fajr: 'الفجر',
    Sunrise: 'الشروق',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء',
    Qiyam: 'قيام الليل / التهجد',
    statusOnTime: 'في وقتها',
    statusLate: 'متأخرة',
    statusMissed: 'فائتة',
    statusQada: 'قضاء',
    prayerTracker: 'سجل الصلوات اليومي',
    todayStreak: 'أيام متتالية',
    qadaTracker: 'الصلوات الفائتة (القضاء)',
    qadaMakeUp: 'قضاء صلاة فائتة',
    sunnahTracker: 'السنن والنوافل',
    tahajjud: 'صلاة التهجد',
    duha: 'صلاة الضحى',
    witr: 'صلاة الوتر',
    rawatib: 'السنن الرواتب',

    // Quran
    quranTracker: 'متابع قراءة القرآن',
    khatmProgress: 'تقدم الختمة',
    pagesReadToday: 'الصفحات المقروءة اليوم',
    logPages: 'تسجيل قراءة',
    surahDirectory: 'فهرس السور والقراءة',
    hifzTracker: 'متابع حفظ القرآن',
    memorized: 'تم الحفظ',
    inProgress: 'قيد الحفظ',
    needsRevision: 'يحتاج مراجعة',
    notStarted: 'لم يبدأ',
    spacedRevision: 'جدول التكرار المتباعد',
    projectedFinish: 'تاريخ الإتمام المتوقع',

    // Ramadan
    ramadanTitle: 'واحة رمضان',
    daysUntilRamadan: 'أيام حتى رمضان',
    suhoorEnds: 'انتهاء السحور (الفجر)',
    iftarTime: 'وقت الإفطار (المغرب)',
    fastingTrackerGrid: 'شبكة متابعة صيام رمضان (٣٠ يوماً)',
    fasted: 'صائم',
    fastedExcused: 'معذور شرعاً',
    notFasted: 'غير صائم',
    taraweehTracker: 'متابع صلاة التراويح',
    laylatulQadrTitle: 'ليلة القدر (الليالي الوترية)',
    laylatulQadrDua: 'اللهم إنك عفو تحب العفو فاعفُ عني',
    itikafMode: 'وضع الاعتكاف',
    iftarPlanner: 'قائمة إفطار رمضان والتسوق',
    fidyaCalculator: 'حاسبة الفدية والكفارة',
    eidChecklist: 'تجهيزات العيد وزكاة الفطر',

    // Productivity
    productivityTitle: 'المخطط اليومي المرتكز على الصلاة',
    islamicPriorities: 'أولويات إسلامية',
    fardh: 'فرض',
    wajib: 'واجب',
    nafl: 'نفل',
    habitsTitle: 'متابع العادات والسنن',
    weeklyReview: 'المراجعة الأسبوعية والشهرية',
    addTask: 'إضافة مهمة مرتبطة بالصلاة',

    // Zakat
    zakatTitle: 'الزكاة والصدقات',
    calculateZakat: 'حساب الزكاة',
    nisabExplanation: 'النصاب هو الحد الأدنى للأموال الزكوية (٨٧.٤٨ جم ذهب أو ٦١٢.٣٦ جم فضة) بعد حولان الحول. تبلغ الزكاة ٢.٥٪.',
    cashSavings: 'السيولة النقدية والمدخرات',
    goldSilver: 'قيمة الذهب والفضة',
    businessAssets: 'عروض التجارة والبضائع',
    investments: 'الاستثمارات النقدية',
    debtsDue: 'الديون والالتزامات المستحقة',
    zakatDueAmount: 'إجمالي الزكاة الواجبة',
    sadaqahLog: 'سجل الصدقات والتبرعات',
    addSadaqah: 'تسجيل صدقة',

    // Reflection & Tools
    qiblaCompass: 'اتجاه القبلة',
    bearingTowardsKaaba: 'الدرجات باتجاه الكعبة المشرفة في مكة',
    digitalTasbih: 'السبحة الإلكترونية',
    tapToCount: 'اضغط للتسبيح',
    resetCount: 'إعادة ضبط',
    gratitudeJournal: 'يوميات النية والشكر',
    islamicEvents: 'المناسبات الإسلامية',

    // Group Khatm
    groupKhatmTitle: 'الختمات القرآنية الجماعية',
    createKhatm: 'إنشاء ختمة جديدة',
    joinKhatm: 'انضمام برمز الختمة',
    claimPara: 'حجز جزء',
    claimCount: 'حجز تكرار سورة',
    completedKhatm: 'تمت الختمة بنجاح! مبارك!',
    activeTasks: 'الختمات النشطة',

    // Family
    familyTitle: 'وضع العائلة',
    manageProfiles: 'إدارة ملفات الأسرة',
    childProgress: 'متابعة صلوات وحفظ الأبناء',

    // Settings & Landing
    accountSettings: 'إعدادات الحساب',
    calculationMethod: 'طريقة الحساب الفلكي',
    asrMadhab: 'مذهب حساب العصر',
    locationSettings: 'الموقع والمنطقة الزمنية',
    selectLanguage: 'اختيار اللغة',
    getStarted: 'ابدأ مجاناً',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب جديد',
    demoAdminLogin: 'دخول المشرف (الأدمن)',
    demoUserLogin: 'دخول مستخدم تجريبي',
  },
  ur: {
    // Brand & App
    appName: 'برکت ڈیلی',
    tagline: 'اپنی روحانی اور روزمرہ زندگی کو پانچ وقت کی نمازوں کے گرد منظم کریں',
    welcomeBack: 'خوش آمدید',
    nextPrayer: 'اگلی نماز',
    timeRemaining: 'باقی وقت',
    prayerViaAladhan: 'اوقاتِ نماز و ہجری تاریخ بذریعہ Aladhan API',
    
    // Navigation
    navHome: 'ہوم',
    navPrayer: 'نمازیں',
    navQuran: 'قرآن',
    navRamadan: 'رمضان',
    navProductivity: 'منصوبہ بندی',
    navSpiritual: 'روحانیات',
    navZakat: 'زکوٰۃ و صدقات',
    navGroupKhatm: 'اجتماعی ختم',
    navFamily: 'خاندان',
    navSettings: 'ترتیبات',
    navAdmin: 'ایڈمن ڈیش بورڈ',
    navMore: 'مزید',
    signOut: 'لاگ آؤٹ',

    // Prayers
    Fajr: 'فجر',
    Sunrise: 'طلوعِ آفتاب',
    Dhuhr: 'ظہر',
    Asr: 'عصر',
    Maghrib: 'مغرب',
    Isha: 'عشاء',
    Qiyam: 'تہجد / قیام اللیل',
    statusOnTime: 'وقت پر',
    statusLate: 'تاخیر سے',
    statusMissed: 'قضا ہوئی',
    statusQada: 'ادا کی',
    prayerTracker: 'نماز ٹریکر',
    todayStreak: 'مسلسل دن',
    qadaTracker: 'قضا نمازوں کا حساب',
    qadaMakeUp: 'قضا نماز ادا کریں',
    sunnahTracker: 'سنن و نوافل',
    tahajjud: 'نمازِ تہجد',
    duha: 'نمازِ اشراق و چاشت',
    witr: 'وتر',
    rawatib: 'سننِ موکدہ',

    // Quran
    quranTracker: 'تلاوتِ قرآن ٹریکر',
    khatmProgress: 'ختمِ قرآن کی پیشرفت',
    pagesReadToday: 'آج تلاوت کردہ صفحات',
    logPages: 'صفحات درج کریں',
    surahDirectory: 'فہرست سورتیں و تلاوت',
    hifzTracker: 'حفظِ قرآن ٹریکر',
    memorized: 'حفظ شدہ',
    inProgress: 'جاری ہے',
    needsRevision: 'دہرائی درکار ہے',
    notStarted: 'ابھی شروع نہیں ہوا',
    spacedRevision: 'دہرائی کا شیڈول',
    projectedFinish: 'تکمیل کی متوقع تاریخ',

    // Ramadan
    ramadanTitle: 'رمضان المبارک',
    daysUntilRamadan: 'رمضان میں باقی دن',
    suhoorEnds: 'اختتامِ سحری (فجر)',
    iftarTime: 'وقتِ افطار (مغرب)',
    fastingTrackerGrid: '30 روزہ رمضان ٹریکر گرڈ',
    fasted: 'روزہ رکھا',
    fastedExcused: 'شرعی عذر',
    notFasted: 'روزہ نہیں رکھا',
    taraweehTracker: 'تراویح ٹریکر',
    laylatulQadrTitle: 'لیلة القدر (طاق راتیں)',
    laylatulQadrDua: 'اے اللہ! تو معاف فرمانے والا ہے، معافی کو پسند فرماتا ہے، پس مجھے معاف فرما دے۔',
    itikafMode: 'اعتکاف موڈ',
    iftarPlanner: 'افطار مینو و خریداری',
    fidyaCalculator: 'فدیہ و کفارہ کیلکولیٹر',
    eidChecklist: 'عید کی تیاری و صدقۃ الفطر',

    // Productivity
    productivityTitle: 'نمازوں پر مبنی روزمرہ پلانر',
    islamicPriorities: 'اسلامی ترجیحات',
    fardh: 'فرض',
    wajib: 'واجب',
    nafl: 'نفل',
    habitsTitle: 'عادات ٹریکر',
    weeklyReview: 'ہفتہ وار و ماہانہ جائزہ',
    addTask: 'نماز کے وقت سے منسلک کام شامل کریں',

    // Zakat
    zakatTitle: 'زکوٰۃ و صدقات',
    calculateZakat: 'زکوٰۃ کا حساب',
    nisabExplanation: 'نصاب کم از کم قابلِ زکوٰۃ مالیت (87.48 گرام سونا یا 612.36 گرام چاندی) ہے جس پر سال گزر چکا ہو۔ 2.5 فیصد زکوٰۃ واجب ہوتی ہے۔',
    cashSavings: 'نقد رقم و بینک بیلنس',
    goldSilver: 'سونا اور چاندی کی مالیت',
    businessAssets: 'مالِ تجارت',
    investments: 'سرمایہ کاری',
    debtsDue: 'واجب الادا قرضے',
    zakatDueAmount: 'کل قابلِ ادائیگی زکوٰۃ',
    sadaqahLog: 'صدقات کا اندراج',
    addSadaqah: 'صدقہ درج کریں',

    // Reflection & Tools
    qiblaCompass: 'قبلہ رخ',
    bearingTowardsKaaba: 'مکہ مکرمہ میں خانہ کعبہ کی سمت ڈگری',
    digitalTasbih: 'ڈیجیٹل تسبیح',
    tapToCount: 'شمار کرنے کیلئے ٹیپ کریں',
    resetCount: 'دوبارہ شروع کریں',
    gratitudeJournal: 'شکر گزاری و نیت ڈائری',
    islamicEvents: 'اہم اسلامی تواریخ',

    // Group Khatm
    groupKhatmTitle: 'اجتماعی ختمِ قرآن',
    createKhatm: 'نیا ختم ٹاسک بنائیں',
    joinKhatm: 'کوڈ کے ذریعے شامل ہوں',
    claimPara: 'پارہ منتخب کریں',
    claimCount: 'سورت کی تکرار منتخب کریں',
    completedKhatm: 'ختم مکمل ہو گیا! مبارک ہو!',
    activeTasks: 'فعال ختم ٹاسک',

    // Family
    familyTitle: 'فیملی موڈ',
    manageProfiles: 'گھرانے کے افراد',
    childProgress: 'بچوں کی نماز اور تلاوت کی نگرانی',

    // Settings & Landing
    accountSettings: 'اکاؤنٹ سیٹنگز',
    calculationMethod: 'اوقات کا حساب کتاب',
    asrMadhab: 'عصر کا مسلک',
    locationSettings: 'مقام و ٹائم زون',
    selectLanguage: 'زبان منتخب کریں',
    getStarted: 'مفت آغاز کریں',
    signIn: 'لاگ ان کریں',
    signUp: 'نیا اکاؤنٹ بنائیں',
    demoAdminLogin: 'ایڈمن لاگ ان',
    demoUserLogin: 'صارف لاگ ان',
  },
  hi: {
    // Brand & App
    appName: 'बरकाह डेली',
    tagline: 'अपने आध्यात्मिक और दैनिक जीवन को पाँच वक़्त की नमाज़ों के अनुसार व्यवस्थित करें',
    welcomeBack: 'वापसी पर स्वागत है',
    nextPrayer: 'अगली नमाज़',
    timeRemaining: 'शेष समय',
    prayerViaAladhan: 'नमाज़ के औक़ात और हिजरी तारीख़ Aladhan API द्वारा',
    
    // Navigation
    navHome: 'होम',
    navPrayer: 'नमाज़',
    navQuran: 'क़ुरआन',
    navRamadan: 'रमज़ान',
    navProductivity: 'प्लानर',
    navSpiritual: 'अध्यात्म',
    navZakat: 'ज़कात व सदक़ा',
    navGroupKhatm: 'सामूहिक ख़त्म',
    navFamily: 'परिवार',
    navSettings: 'सेटिंग्स',
    navAdmin: 'एडमिन',
    navMore: 'अधिक',
    signOut: 'लॉग आउट',

    // Prayers
    Fajr: 'फ़ज्र',
    Sunrise: 'सूर्योदय',
    Dhuhr: 'ज़ुहर',
    Asr: 'असर',
    Maghrib: 'मग़रिब',
    Isha: 'इशा',
    Qiyam: 'तहज्जुद / क़ियाम',
    statusOnTime: 'वक़्त पर',
    statusLate: 'देर से',
    statusMissed: 'छूट गई',
    statusQada: 'क़ज़ा अदा की',
    prayerTracker: 'नमाज़ ट्रैकर',
    todayStreak: 'लगातार दिन',
    qadaTracker: 'क़ज़ा नमाज़ों का हिसाब',
    qadaMakeUp: 'क़ज़ा नमाज़ अदा करें',
    sunnahTracker: 'सुन्नत व नफ़्ल नमाज़ें',
    tahajjud: 'तहज्जुद की नमाज़',
    duha: 'इशराक़ व चाश्त',
    witr: 'वित्र',
    rawatib: 'सुन्नते मुअक्कदा',

    // Quran
    quranTracker: 'क़ुरआन तिलावत ट्रैकर',
    khatmProgress: 'ख़त्म की प्रगति',
    pagesReadToday: 'आज पढ़े गए पृष्ठ',
    logPages: 'पृष्ठ दर्ज करें',
    surahDirectory: 'सूरतों की सूची व पाठ',
    hifzTracker: 'हिफ़्ज़ ट्रैकर',
    memorized: 'कंठस्थ (याद)',
    inProgress: 'जारी है',
    needsRevision: 'दोहराना ज़रूरी',
    notStarted: 'शुरू नहीं हुआ',
    spacedRevision: 'रिविज़न शेड्यूल',
    projectedFinish: 'अनुमानित समापन तारीख़',

    // Ramadan
    ramadanTitle: 'माहे रमज़ान',
    daysUntilRamadan: 'रमज़ान में बाक़ी दिन',
    suhoorEnds: 'सहरी समाप्त (फ़ज्र)',
    iftarTime: 'इफ़्तार का वक़्त (मग़रिब)',
    fastingTrackerGrid: '30-दिवसीय रमज़ान ट्रैकर',
    fasted: 'रोज़ा रखा',
    fastedExcused: 'शरई छूट',
    notFasted: 'रोज़ा नहीं रखा',
    taraweehTracker: 'तरावीह ट्रैकर',
    laylatulQadrTitle: 'शबे क़द्र (ताक़ रातें)',
    laylatulQadrDua: 'ऐ अल्लाह! तू माफ़ करने वाला है, माफ़ी को पसंद करता है, अतः मुझे माफ़ फ़रमा दे।',
    itikafMode: 'एतेकाफ़ मोड',
    iftarPlanner: 'इफ़्तार मेन्यू व ख़रीदारी',
    fidyaCalculator: 'फ़िद्या व कफ़्फ़ारा कैलकुलेटर',
    eidChecklist: 'ईद की तैयारी व सदक़ए फ़ित्र',

    // Productivity
    productivityTitle: 'नमाज़-आधारित दैनिक प्लानर',
    islamicPriorities: 'प्राथमिकता श्रेणियाँ',
    fardh: 'फ़र्ज़ (अनिवार्य)',
    wajib: 'वाजिब',
    nafl: 'नफ़्ल (ऐच्छिक)',
    habitsTitle: 'आदत ट्रैकर',
    weeklyReview: 'साप्ताहिक व मासिक समीक्षा',
    addTask: 'नमाज़ के वक़्त से जुड़ा कार्य जोड़ें',

    // Zakat
    zakatTitle: 'ज़कात व सदक़ात',
    calculateZakat: 'ज़कात की गणना',
    nisabExplanation: 'निसाब न्यूनतम आवश्यक संपत्ति (87.48 ग्राम सोना या 612.36 ग्राम चाँदी) है। इस पर 2.5% ज़कात अनिवार्य है।',
    cashSavings: 'नक़द व बैंक बचत',
    goldSilver: 'सोना व चाँदी का मूल्य',
    businessAssets: 'व्यापार का माल',
    investments: 'निवेश',
    debtsDue: 'देनदारियाँ / क़र्ज़',
    zakatDueAmount: 'कुल देय ज़कात',
    sadaqahLog: 'सदक़ा रजिस्टर',
    addSadaqah: 'सदक़ा दर्ज करें',

    // Reflection & Tools
    qiblaCompass: 'क़िबला दिशा',
    bearingTowardsKaaba: 'मक्का में काबा की ओर दिशा (अंश)',
    digitalTasbih: 'डिजिटल तस्बीह',
    tapToCount: 'गिनने के लिए टैप करें',
    resetCount: 'रीसेट करें',
    gratitudeJournal: 'शुक्रिया व नियत डायरी',
    islamicEvents: 'प्रमुख इस्लामी तिथियाँ',

    // Group Khatm
    groupKhatmTitle: 'सामूहिक क़ुरआन ख़त्म',
    createKhatm: 'नया ख़त्म टास्क बनाएँ',
    joinKhatm: 'कोड से जुड़ें',
    claimPara: 'पारा चुनें',
    claimCount: 'सूरह पुनरावृत्ति चुनें',
    completedKhatm: 'ख़त्म मुकम्मल हुआ! मुबारक!',
    activeTasks: 'सक्रिय ख़त्म कार्य',

    // Family
    familyTitle: 'पारिवारिक मोड',
    manageProfiles: 'परिवार के सदस्य',
    childProgress: 'बच्चों की नमाज़ व क़ुरआन प्रगति',

    // Settings & Landing
    accountSettings: 'खाता सेटिंग्स',
    calculationMethod: 'गणना पद्धति',
    asrMadhab: 'असर की गणना (मज़हब)',
    locationSettings: 'स्थान व टाइमज़ोन',
    selectLanguage: 'भाषा चुनें',
    getStarted: 'निःशुल्क शुरू करें',
    signIn: 'साइन इन करें',
    signUp: 'नया खाता बनाएँ',
    demoAdminLogin: 'एडमिन लॉगिन',
    demoUserLogin: 'उपयोगकर्ता लॉगिन',
  },
  bn: {
    // Brand & App
    appName: 'বারাকাহ ডেইলি',
    tagline: 'পাঁচ ওয়াক্ত নামাজের সাথে মিল রেখে আপনার আত্মিক ও দৈনন্দিন জীবন সাজান',
    welcomeBack: 'স্বাগতম',
    nextPrayer: 'পরবর্তী নামাজ',
    timeRemaining: 'বাকি সময়',
    prayerViaAladhan: 'নামাজের সময় ও হিজরি তারিখ Aladhan API এর মাধ্যমে',
    
    // Navigation
    navHome: 'হোম',
    navPrayer: 'নামাজ',
    navQuran: 'কোরআন',
    navRamadan: 'রমজান',
    navProductivity: 'পরিকল্পক',
    navSpiritual: 'আধ্যাত্মিক',
    navZakat: 'যাকাত ও সাদাকা',
    navGroupKhatm: 'গ্রুপ খতম',
    navFamily: 'পরিবার',
    navSettings: 'সেটিংস',
    navAdmin: 'অ্যাডমিন',
    navMore: 'আরও',
    signOut: 'লগআউট',

    // Prayers
    Fajr: 'ফজর',
    Sunrise: 'সূর্যোদয়',
    Dhuhr: 'জোহর',
    Asr: 'আসর',
    Maghrib: 'মাগরিব',
    Isha: 'এশা',
    Qiyam: 'তাহাজ্জুদ / কিয়ামুল লাইল',
    statusOnTime: 'সময়মতো',
    statusLate: 'দেরিতে',
    statusMissed: 'ছুটে গেছে',
    statusQada: 'কাজা আদায়',
    prayerTracker: 'নামাজ ট্র্যাকার',
    todayStreak: 'টানা দিন',
    qadaTracker: 'কাজা নামাজের হিসাব',
    qadaMakeUp: 'কাজা নামাজ আদায় করুন',
    sunnahTracker: 'সুন্নত ও নফল নামাজ',
    tahajjud: 'তাহাজ্জুদ নামাজ',
    duha: 'ইশরাক ও চাশত',
    witr: 'বিতর',
    rawatib: 'সুন্নাতে মুয়াক্কাদা',

    // Quran
    quranTracker: 'কোরআন তেলাওয়াত ট্র্যাকার',
    khatmProgress: 'খতমের অগ্রগতি',
    pagesReadToday: 'আজ পঠিত পৃষ্ঠা',
    logPages: 'পৃষ্ঠা যোগ করুন',
    surahDirectory: 'সূরা তালিকা ও তেলাওয়াত',
    hifzTracker: 'হিফজ ট্র্যাকার',
    memorized: 'মুখস্থ সম্পন্ন',
    inProgress: 'মুখস্থ চলছে',
    needsRevision: 'পুনরাবৃত্তি প্রয়োজন',
    notStarted: 'শুরু হয়নি',
    spacedRevision: 'রিভিশন সূচি',
    projectedFinish: 'সমাপ্তির সম্ভাব্য তারিখ',

    // Ramadan
    ramadanTitle: 'পবিত্র রমজান',
    daysUntilRamadan: 'রমজানের বাকি দিন',
    suhoorEnds: 'সেহরি শেষ (ফজর)',
    iftarTime: 'ইফতারের সময় (মাগরিব)',
    fastingTrackerGrid: '৩০ দিনের রমজান ট্র্যাকার গ্রিড',
    fasted: 'রোজা রেখেছেন',
    fastedExcused: 'শরীয়তসম্মত কারণ',
    notFasted: 'রোজা রাখেননি',
    taraweehTracker: 'তারাবিহ ট্র্যাকার',
    laylatulQadrTitle: 'লাইলাতুল কদর (বিজোড় রাত)',
    laylatulQadrDua: 'হে আল্লাহ! আপনি ক্ষমাশীল, ক্ষমা পছন্দ করেন, অতএব আমাকে ক্ষমা করুন।',
    itikafMode: 'ইতিকাফ মোড',
    iftarPlanner: 'ইফতার তালিকা ও বাজার',
    fidyaCalculator: 'ফিদ্‌য়া ও কাফফারা ক্যালকুলেটর',
    eidChecklist: 'ঈদের প্রস্তুতি ও ফিতরা',

    // Productivity
    productivityTitle: 'নামাজ-ভিত্তিক দৈনন্দিন পরিকল্পক',
    islamicPriorities: 'ইসলামি অগ্রাধিকার',
    fardh: 'ফরজ (আবশ্যকীয়)',
    wajib: 'ওয়াজিব',
    nafl: 'নফল (ঐচ্ছিক)',
    habitsTitle: 'অভ্যাস ট্র্যাকার',
    weeklyReview: 'সাপ্তাহিক ও মাসিক পর্যালোচনা',
    addTask: 'নামাজের সময়ের সাথে কাজ যুক্ত করুন',

    // Zakat
    zakatTitle: 'যাকাত ও সাদাকাহ',
    calculateZakat: 'যাকাত হিসাব করুন',
    nisabExplanation: 'নিসাব হলো ন্যূনতম প্রদেয় সম্পদ (৮৭.৪৮ গ্রাম সোনা বা ৬১২.৩৬ গ্রাম রূপা)। এর ওপর ২.৫% যাকাত ফরজ।',
    cashSavings: 'নগদ অর্থ ও ব্যাংক সঞ্চয়',
    goldSilver: 'সোনা ও রূপার মূল্য',
    businessAssets: 'ব্যবসায়িক পণ্য',
    investments: 'বিনিয়োগ',
    debtsDue: 'পরিশোধযোগ্য ঋণ',
    zakatDueAmount: 'মোট প্রদেয় যাকাত',
    sadaqahLog: 'সাদাকাহ খাতা',
    addSadaqah: 'সাদাকাহ লিপিবদ্ধ করুন',

    // Reflection & Tools
    qiblaCompass: 'কিবলা দিকনির্ণয়',
    bearingTowardsKaaba: 'পবিত্র কাবা শরিফের অভিমুখ (ডিগ্রি)',
    digitalTasbih: 'ডিজিটাল তাসবিহ',
    tapToCount: 'গণনা করতে স্পর্শ করুন',
    resetCount: 'রিসেট',
    gratitudeJournal: 'কৃতজ্ঞতা ও নিয়তের ডায়েরি',
    islamicEvents: 'প্রধান ইসলামি দিনপঞ্জি',

    // Group Khatm
    groupKhatmTitle: 'সম্মিলিত কোরআন খতম',
    createKhatm: 'নতুন খতম শুরু করুন',
    joinKhatm: 'কোড দিয়ে যোগ দিন',
    claimPara: 'পারা নির্বাচন করুন',
    claimCount: 'সূরা পুনরাবৃত্তি গ্রহণ করুন',
    completedKhatm: 'খতম সম্পন্ন হয়েছে! মোবারকবাদ!',
    activeTasks: 'চলমান খতমসমূহ',

    // Family
    familyTitle: 'পারিবারিক মোড',
    manageProfiles: 'পরিবারের সদস্য ব্যবস্থাপনা',
    childProgress: 'সন্তানদের নামাজ ও কোরআন অগ্রগতি',

    // Settings & Landing
    accountSettings: 'অ্যাকাউন্ট সেটিংস',
    calculationMethod: 'গণনা পদ্ধতি',
    asrMadhab: 'আসর নামাজের ওয়াক্ত (মাজহাব)',
    locationSettings: 'স্থান ও সময় অঞ্চল',
    selectLanguage: 'ভাষা নির্বাচন করুন',
    getStarted: 'বিনামূল্যে শুরু করুন',
    signIn: 'লগইন করুন',
    signUp: 'নতুন অ্যাকাউন্ট তৈরি করুন',
    demoAdminLogin: 'অ্যাডমিন লগইন',
    demoUserLogin: 'ব্যবহারকারী লগইন',
  },
};

export const useTranslation = (lang: Language) => {
  const baseDict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const extDict = TRANSLATIONS_EXTENDED[lang] || TRANSLATIONS_EXTENDED.en;
  return (key: string, fallback?: string): string => {
    return (
      extDict?.[key] ||
      baseDict?.[key] ||
      TRANSLATIONS_EXTENDED.en?.[key] ||
      TRANSLATIONS.en[key] ||
      fallback ||
      key
    );
  };
};
