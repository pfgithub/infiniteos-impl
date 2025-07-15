import React, { useState } from 'react';
import WindowTitleBar from './WindowTitleBar';
import SettingsSidebar from './SettingsSidebar';
import SystemSettings from './settings/SystemSettings';
import AppearanceSettings from './settings/AppearanceSettings';
import NetworkSettings from './settings/NetworkSettings';
import UsersSettings from './settings/UsersSettings';
import { SettingsIcon } from '../icons';

function SettingsWindow() {
  const [activePage, setActivePage] = useState('System');

  const renderContent = () => {
    switch (activePage) {
      case 'Appearance':
        return <AppearanceSettings />;
      case 'Network':
        return <NetworkSettings />;
      case 'Users':
        return <UsersSettings />;
      case 'System':
      default:
        return <SystemSettings />;
    }
  };

  return (
    <div
      id="window_settings"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] max-w-[95vw] h-[640px] max-h-[85vh] flex flex-col bg-gray-800/80 backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl text-white z-20"
    >
      <WindowTitleBar title="Settings" icon={<SettingsIcon className="h-6 w-6" />} />
      <div className="flex flex-grow overflow-hidden">
        <SettingsSidebar activePage={activePage} onNavigate={setActivePage} />
        {renderContent()}
      </div>
    </div>
  );
}

export default SettingsWindow;
