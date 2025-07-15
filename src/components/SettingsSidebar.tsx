import React from 'react';
import { AppearanceIcon, SystemIcon, NetworkIcon, UsersIcon } from '../icons';

const SettingsNavItem = ({ id, label, icon, isActive = false }) => (
  <button
    id={id}
    className={`w-full flex items-center gap-3 p-2 rounded text-left transition ${
      isActive ? 'bg-blue-600/50' : 'hover:bg-white/10'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

function SettingsSidebar() {
  return (
    <div className="w-56 bg-black/20 p-3 flex-shrink-0 flex flex-col gap-1">
      <SettingsNavItem id="settings_nav_appearance" label="Appearance" icon={<AppearanceIcon />} />
      <SettingsNavItem id="settings_nav_system" label="System" icon={<SystemIcon />} isActive={true} />
      <SettingsNavItem id="settings_nav_network" label="Network" icon={<NetworkIcon />} />
      <SettingsNavItem id="settings_nav_users" label="User Accounts" icon={<UsersIcon />} />
    </div>
  );
}

export default SettingsSidebar;