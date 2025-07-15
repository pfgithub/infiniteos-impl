import React from 'react';
import WindowTitleBar from './WindowTitleBar';
import useWindowStore, { WindowInstance } from '../store/windowStore';

interface WindowProps {
  window: WindowInstance;
}

function Window({ window: w }: WindowProps) {
  const { closeWindow, focusWindow, toggleMinimize, toggleMaximize } = useWindowStore();

  const handleClose = () => closeWindow(w.id);
  const handleMinimize = () => toggleMinimize(w.id);
  const handleMaximize = () => toggleMaximize(w.id);
  
  const handleFocus = (e: React.MouseEvent) => {
    // Prevent focus steal when clicking title bar buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    focusWindow(w.id);
  };

  const WindowContent = w.component;

  const windowClasses = "absolute flex flex-col bg-gray-800/80 backdrop-blur-xl border border-white/20 text-white";
  
  const sizeClasses = w.isMaximized 
    ? 'w-full h-full top-0 left-0 rounded-none' 
    : 'w-[900px] max-w-[95vw] h-[640px] max-h-[85vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-2xl';

  const visibilityClass = w.isMinimized ? 'hidden' : 'flex';

  return (
    <div
      id={`window_${w.id}`}
      className={`${windowClasses} ${sizeClasses} ${visibilityClass}`}
      style={{ zIndex: w.zIndex }}
      onMouseDown={handleFocus}
    >
      <WindowTitleBar 
        title={w.title} 
        icon={w.icon} 
        onClose={handleClose} 
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
      />
      <WindowContent id={w.id} />
    </div>
  );
}

export default Window;
