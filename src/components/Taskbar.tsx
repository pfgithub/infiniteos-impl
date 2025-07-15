import React from 'react';
import TaskbarItem from './TaskbarItem';
import SystemTray from './SystemTray';
import { StartIcon } from '../icons';
import { todoImplement } from '../todo';
import useWindowStore from '../store/windowStore';
import { WINDOW_DEFS } from '../windows';

function Taskbar() {
  const { windows, openWindow, focusWindow, toggleMinimize } = useWindowStore();

  const getFocusedWindow = () => {
    if (windows.length === 0) return null;
    const unminimizedWindows = windows.filter(w => !w.isMinimized);
    if (unminimizedWindows.length === 0) return null;
    return unminimizedWindows.reduce((a, b) => a.zIndex > b.zIndex ? a : b);
  };
  
  const focusedWindow = getFocusedWindow();

  const handleTaskbarAppClick = (windowDef: typeof WINDOW_DEFS[keyof typeof WINDOW_DEFS]) => {
    const window = windows.find(w => w.id === windowDef.id);
    if (!window) {
      openWindow(windowDef);
    } else {
      // If it's the focused window, minimize it. Otherwise, focus it.
      if (focusedWindow?.id === window.id) {
        toggleMinimize(window.id);
      } else {
        focusWindow(window.id);
      }
    }
  };

  const pinnedApps = [
    WINDOW_DEFS.FILE_EXPLORER,
    WINDOW_DEFS.BROWSER,
    WINDOW_DEFS.SETTINGS,
  ];

  const openWindowIds = new Set(windows.map(w => w.id));

  const taskbarApps = [...pinnedApps];
  const pinnedAppIds = new Set(pinnedApps.map(p => p.id));
  
  windows.forEach(w => {
    if (!pinnedAppIds.has(w.id)) {
      const windowDef = Object.values(WINDOW_DEFS).find(def => def.id === w.id);
      if (windowDef) {
        taskbarApps.push(windowDef);
      }
    }
  });


  return (
    <footer className="h-12 bg-gray-900/70 backdrop-blur-xl text-white flex items-center justify-between px-2 w-full flex-shrink-0 z-40">
      <div className="flex items-center gap-1">
        <button 
          id="start_button" 
          className="p-2 rounded hover:bg-white/20" 
          aria-label="Start Menu"
          onClick={() => todoImplement("The Start Menu button was clicked. Implement opening the start menu.")}
        >
          <StartIcon />
        </button>
        {taskbarApps.map(appDef => {
          const isOpen = openWindowIds.has(appDef.id);
          const isActive = isOpen && focusedWindow?.id === appDef.id;
          
          return (
            <TaskbarItem 
              key={appDef.id}
              id={`taskbar_app_${appDef.id}`} 
              label={appDef.title} 
              icon={React.cloneElement(appDef.icon as React.ReactElement, { className: 'h-6 w-6' })}
              isActive={isActive} 
              onClick={() => handleTaskbarAppClick(appDef)} 
            />
          );
        })}
      </div>
      <SystemTray />
    </footer>
  );
}

export default Taskbar;
