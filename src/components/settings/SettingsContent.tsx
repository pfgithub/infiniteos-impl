import React, { useState } from 'react';
import SettingsSidebar from '../SettingsSidebar';
import SystemSettings from './SystemSettings';
import AppearanceSettings from './AppearanceSettings';
import NetworkSettings from './NetworkSettings';
import UsersSettings from './UsersSettings';

function SettingsContent({ id }: { id: string }) {
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
    <div className="flex flex-grow overflow-hidden">
      <SettingsSidebar activePage={activePage} onNavigate={setActivePage} />
      {renderContent()}
    </div>
  );
}

export default SettingsContent;
