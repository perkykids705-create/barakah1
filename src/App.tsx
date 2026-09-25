/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell, ActiveTab } from './components/layout/AppShell';
import { HomeDashboard } from './components/modules/HomeDashboard';
import { PrayerModule } from './components/modules/PrayerModule';
import { QuranModule } from './components/modules/QuranModule';
import { RamadanModule } from './components/modules/RamadanModule';
import { ProductivityModule } from './components/modules/ProductivityModule';
import { SpiritualToolsModule } from './components/modules/SpiritualToolsModule';
import { ZakatModule } from './components/modules/ZakatModule';
import { GroupKhatmModule } from './components/modules/GroupKhatmModule';
import { FamilyModeModule } from './components/modules/FamilyModeModule';
import { SettingsModule } from './components/modules/SettingsModule';
import { AdminDashboard } from './components/modules/AdminDashboard';
import { LandingPage } from './components/modules/LandingPage';
import { VirtualKeyboardToolbar } from './components/common/VirtualKeyboardToolbar';

const MainContent: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  if (!currentUser) {
    return <LandingPage onSuccessfulAuth={() => setActiveTab('home')} />;
  }

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'prayer':
        return <PrayerModule />;
      case 'quran':
        return <QuranModule />;
      case 'ramadan':
        return <RamadanModule />;
      case 'productivity':
        return <ProductivityModule />;
      case 'spiritual':
        return <SpiritualToolsModule />;
      case 'zakat':
        return <ZakatModule />;
      case 'group_khatm':
        return <GroupKhatmModule />;
      case 'family':
        return <FamilyModeModule />;
      case 'settings':
        return <SettingsModule />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomeDashboard onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <AppShell activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderActiveModule()}
    </AppShell>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
      <VirtualKeyboardToolbar />
    </AppProvider>
  );
}
