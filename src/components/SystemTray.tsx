import React, { useState, useEffect } from 'react';
import { WifiIcon, VolumeIcon } from '../icons';
import { todoImplement } from '../todo';

function SystemTray({ onDateTimeClick }: { onDateTimeClick: () => void }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

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
        onClick={onDateTimeClick}
      >
        <div id="tray_time">{time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
        <div id="tray_date">{time.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })}</div>
      </div>
    </div>
  );
}

export default SystemTray;
