import React from 'react';
import DesktopIcon from './DesktopIcon';
import { BrowserIcon, FileExplorerIcon, GamesIcon, RecycleBinIcon, SettingsIcon } from '../icons';
import { todoImplement } from '../todo';

function Desktop() {
  return (
    <main className="flex-grow p-3">
      <div className="flex flex-col flex-wrap h-full content-start gap-1">
        <DesktopIcon 
          id="desktop_icon_browser" 
          label="Browser" 
          icon={<BrowserIcon />} 
          onClick={() => todoImplement("The 'Browser' desktop icon was clicked. Implement opening the browser window.")} />
        <DesktopIcon 
          id="desktop_icon_file_explorer" 
          label="File Explorer" 
          icon={<FileExplorerIcon />}
          onClick={() => todoImplement("The 'File Explorer' desktop icon was clicked. Implement opening the file explorer window.")} />
        <DesktopIcon 
          id="desktop_icon_my_games" 
          label="My Games" 
          icon={<GamesIcon />} 
          onClick={() => todoImplement("The 'My Games' desktop icon was clicked. Implement opening a game library or launcher window.")} />
        <DesktopIcon 
          id="desktop_icon_recycle_bin" 
          label="Recycle Bin" 
          icon={<RecycleBinIcon />}
          onClick={() => todoImplement("The 'Recycle Bin' desktop icon was clicked. Implement opening the Recycle Bin window to view and manage deleted files.")} />
        <DesktopIcon 
          id="desktop_icon_settings" 
          label="Settings" 
          icon={<SettingsIcon />} 
          onClick={() => todoImplement("The 'Settings' desktop icon was clicked. Implement showing/hiding the Settings window.")} />
      </div>
    </main>
  );
}

export default Desktop;
