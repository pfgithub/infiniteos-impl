import React from 'react';
import { WifiIcon, VolumeIcon } from '../icons';

function SystemTray() {
  return (
    <div className="flex items-center gap-4 px-2">
      <div id="tray_network_status" className="cursor-pointer" aria-label="Network Status: Connected">
        <WifiIcon />
      </div>
      <div id="tray_volume" className="cursor-pointer" aria-label="Volume: 80%">
        <VolumeIcon />
      </div>
      <div id="tray_datetime" className="text-sm font-sans text-right cursor-pointer">
        <div id="tray_time">10:40 PM</div>
        <div id="tray_date">7/14/2025</div>
      </div>
    </div>
  );
}

export default SystemTray;