import React from 'react';
import TaskbarItem from './TaskbarItem';
import SystemTray from './SystemTray';
import { StartIcon, FileExplorerIcon, BrowserIcon, SettingsIcon } from '../icons';

function Taskbar() {
  return (
    <footer className="h-12 bg-gray-900/70 backdrop-blur-xl text-white flex items-center justify-between px-2 w-full flex-shrink-0 z-40">
      <div className="flex items-center gap-1">
        <button id="start_button" className="p-2 rounded hover:bg-white/20" aria-label="Start Menu">
          <StartIcon />
        </button>
        <TaskbarItem id="taskbar_app_file_explorer" label="File Explorer" icon={<FileExplorerIcon className="w-6 h-6" />} />
        <TaskbarItem id="taskbar_app_browser" label="Browser" icon={<BrowserIcon className="h-6 w-6" />} />
        <TaskbarItem id="taskbar_app_settings" label="Settings" icon={<SettingsIcon className="h-6 w-6" />} isActive={true} />
      </div>
      <SystemTray />
    </footer>
  );
}

export default Taskbar;