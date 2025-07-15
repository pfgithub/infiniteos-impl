import React from 'react';
import { WifiIcon, VolumeIcon } from '../icons';
import { todoImplement } from '../todo';

function SystemTray() {
  return (
    <div className="flex items-center gap-4 px-2">
      <div 
        id="tray_network_status" 
        className="cursor-pointer" 
        aria-label="Network Status: Connected"
        onClick={() => todoImplement("The network status icon in the system tray was clicked. Implement opening a network status flyout/panel.")}
      >
        <WifiIcon />
      </div>
      <div 
        id="tray_volume" 
        className="cursor-pointer" 
        aria-label="Volume: 80%"
        onClick={() => todoImplement("The volume icon in the system tray was clicked. Implement opening a volume control flyout/panel.")}
      >
        <VolumeIcon />
      </div>
      <div 
        id="tray_datetime" 
        className="text-sm font-sans text-right cursor-pointer"
        onClick={() => todoImplement("The date and time in the system tray was clicked. Implement opening a calendar and clock flyout/panel.")}
      >
        <div id="tray_time">10:40 PM</div>
        <div id="tray_date">7/14/2025</div>
      </div>
    </div>
  );
}

export default SystemTray;
