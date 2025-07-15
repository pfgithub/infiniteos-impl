import React from 'react';
import SettingsContent from './components/settings/SettingsContent';
import { SettingsIcon, BrowserIcon, FileExplorerIcon, GamesIcon, RecycleBinIcon } from './icons';
import GamesContent from './components/GamesContent';

const PlaceholderWindowContent: React.FC<{ id: string; appName: string }> = ({ appName }) => (
    <div className="flex-grow p-4 flex items-center justify-center text-center">
      <p>The <strong>{appName}</strong> application is not yet implemented.<br/> This is a placeholder window.</p>
    </div>
);
  
export const WINDOW_DEFS = {
    SETTINGS: {
      id: 'settings',
      title: 'Settings',
      icon: <SettingsIcon className="h-6 w-6" />,
      component: SettingsContent,
    },
    BROWSER: {
      id: 'browser',
      title: 'Browser',
      icon: <BrowserIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Browser" />,
    },
    FILE_EXPLORER: {
      id: 'file_explorer',
      title: 'File Explorer',
      icon: <FileExplorerIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="File Explorer" />,
    },
    GAMES: {
      id: 'my_games',
      title: 'My Games',
      icon: <GamesIcon className="h-6 w-6" />,
      component: GamesContent,
    },
    RECYCLE_BIN: {
      id: 'recycle_bin',
      title: 'Recycle Bin',
      icon: <RecycleBinIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Recycle Bin" />,
    },
};
