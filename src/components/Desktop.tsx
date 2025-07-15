import React from 'react';
import DesktopIcon from './DesktopIcon';
import { BrowserIcon, FileExplorerIcon, GamesIcon, RecycleBinIcon, SettingsIcon } from '../icons';

function Desktop() {
  return (
    <main className="flex-grow p-3">
      <div className="flex flex-col flex-wrap h-full content-start gap-1">
        <DesktopIcon id="desktop_icon_browser" label="Browser" icon={<BrowserIcon />} />
        <DesktopIcon id="desktop_icon_file_explorer" label="File Explorer" icon={<FileExplorerIcon />} />
        <DesktopIcon id="desktop_icon_my_games" label="My Games" icon={<GamesIcon />} />
        <DesktopIcon id="desktop_icon_recycle_bin" label="Recycle Bin" icon={<RecycleBinIcon />} />
        <DesktopIcon id="desktop_icon_settings" label="Settings" icon={<SettingsIcon />} />
      </div>
    </main>
  );
}

export default Desktop;