import React from 'react';
import WindowTitleBar from './WindowTitleBar';
import SettingsSidebar from './SettingsSidebar';
import SettingsContent from './SettingsContent';
import { SettingsIcon } from '../icons';

function SettingsWindow() {
  return (
    <div
      id="window_settings"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] max-w-[95vw] h-[600px] max-h-[85vh] flex flex-col bg-gray-800/80 backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl text-white z-20"
    >
      <WindowTitleBar title="Settings" icon={<SettingsIcon className="h-6 w-6" />} />
      <div className="flex flex-grow overflow-hidden">
        <SettingsSidebar />
        <SettingsContent />
      </div>
    </div>
  );
}

export default SettingsWindow;