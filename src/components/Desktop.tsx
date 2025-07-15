import React from 'react';
import DesktopIcon from './DesktopIcon';
import { BrowserIcon, FileExplorerIcon, GamesIcon, RecycleBinIcon, SettingsIcon } from '../icons';
import useWindowStore from '../store/windowStore';
import { WINDOW_DEFS } from '../windows';

function Desktop() {
  const { openWindow } = useWindowStore();

  return (
    <main className="flex-grow p-3">
      <div className="flex flex-col flex-wrap h-full content-start gap-1">
        <DesktopIcon 
          id="desktop_icon_browser" 
          label="Browser" 
          icon={<BrowserIcon />} 
          onClick={() => openWindow(WINDOW_DEFS.BROWSER)} />
        <DesktopIcon 
          id="desktop_icon_file_explorer" 
          label="File Explorer" 
          icon={<FileExplorerIcon />}
          onClick={() => openWindow(WINDOW_DEFS.FILE_EXPLORER)} />
        <DesktopIcon 
          id="desktop_icon_my_games" 
          label="My Games" 
          icon={<GamesIcon />} 
          onClick={() => openWindow(WINDOW_DEFS.GAMES)} />
        <DesktopIcon 
          id="desktop_icon_recycle_bin" 
          label="Recycle Bin" 
          icon={<RecycleBinIcon />}
          onClick={() => openWindow(WINDOW_DEFS.RECYCLE_BIN)} />
        <DesktopIcon 
          id="desktop_icon_settings" 
          label="Settings" 
          icon={<SettingsIcon />} 
          onClick={() => openWindow(WINDOW_DEFS.SETTINGS)} />
      </div>
    </main>
  );
}

export default Desktop;
