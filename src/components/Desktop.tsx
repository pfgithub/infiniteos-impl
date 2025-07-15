import React, { useState, useEffect } from 'react';
import DesktopIcon from './DesktopIcon';
import { BrowserIcon, FileExplorerIcon, GamesIcon, RecycleBinIcon, SettingsIcon, ClockIcon, CalculatorIcon, ArcaneLegacyIcon, TowerForgeDefenseIcon } from '../icons';
import useWindowStore from '../store/windowStore';
import { WINDOW_DEFS } from '../windows';
import { readDir } from '../filesystem';

const desktopFileMap: Record<string, { icon: React.ReactElement, windowDef: (typeof WINDOW_DEFS)[keyof typeof WINDOW_DEFS] }> = {
    'Browser.desktop': { icon: <BrowserIcon />, windowDef: WINDOW_DEFS.BROWSER },
    'File Explorer.desktop': { icon: <FileExplorerIcon />, windowDef: WINDOW_DEFS.FILE_EXPLORER },
    'Games.desktop': { icon: <GamesIcon />, windowDef: WINDOW_DEFS.GAMES },
    'Recycle Bin.desktop': { icon: <RecycleBinIcon />, windowDef: WINDOW_DEFS.RECYCLE_BIN },
    'Settings.desktop': { icon: <SettingsIcon />, windowDef: WINDOW_DEFS.SETTINGS },
    'Clock.desktop': { icon: <ClockIcon />, windowDef: WINDOW_DEFS.CLOCK },
    'Calculator.desktop': { icon: <CalculatorIcon />, windowDef: WINDOW_DEFS.CALCULATOR },
    'Arcane Legacy.desktop': { icon: <ArcaneLegacyIcon />, windowDef: WINDOW_DEFS.ARCANE_LEGACY },
    'TowerForge Defense.desktop': { icon: <TowerForgeDefenseIcon />, windowDef: WINDOW_DEFS.TOWER_FORGE_DEFENSE },
};

function Desktop() {
  const { openWindow } = useWindowStore();
  const [icons, setIcons] = useState<any[]>([]);

  useEffect(() => {
    const fetchDesktopIcons = async () => {
      try {
        const files = await readDir('/Users/Admin/Desktop/');
        const desktopIcons = files
          .filter(file => !file.isDir && desktopFileMap[file.name])
          .map(file => {
            const { icon, windowDef } = desktopFileMap[file.name];
            return {
              id: `desktop_icon_${windowDef.id}`,
              label: windowDef.title,
              icon,
              onClick: () => openWindow(windowDef)
            };
          });
        setIcons(desktopIcons);
      } catch (error) {
        console.error("Failed to load desktop icons:", error);
      }
    };
    fetchDesktopIcons();
  }, [openWindow]);

  return (
    <main className="h-full p-3 overflow-auto">
      <div className="flex flex-col flex-wrap h-full content-start gap-1">
        {icons.map(iconProps => <DesktopIcon key={iconProps.id} {...iconProps} />)}
      </div>
    </main>
  );
}

export default Desktop;
