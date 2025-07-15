import React from 'react';
import { AppearanceIcon, SystemIcon, NetworkIcon, UsersIcon } from '../icons';

const SettingsNavItem = ({ id, label, icon, isActive = false, onClick }) => (
  <button
    id={id}
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-2 rounded text-left transition ${
      isActive ? 'bg-blue-600/50' : 'hover:bg-white/10'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const navItems = [
    { id: 'settings_nav_system', label: 'System', icon: <SystemIcon />, page: 'System' },
    { id: 'settings_nav_appearance', label: 'Appearance', icon: <AppearanceIcon />, page: 'Appearance' },
    { id: 'settings_nav_network', label: 'Network', icon: <NetworkIcon />, page: 'Network' },
    { id: 'settings_nav_users', label: 'User Accounts', icon: <UsersIcon />, page: 'Users' },
];

function SettingsSidebar({ activePage, onNavigate }) {
  return (
    <div className="w-64 bg-black/20 p-3 flex-shrink-0 flex flex-col gap-1">
      {navItems.map(item => (
        <SettingsNavItem 
          key={item.page}
          id={item.id} 
          label={item.label} 
          icon={item.icon} 
          isActive={activePage === item.page}
          onClick={() => onNavigate(item.page)} 
        />
      ))}
    </div>
  );
}

export default SettingsSidebar;
