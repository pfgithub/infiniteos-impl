import React from 'react';
import { MinimizeIcon, MaximizeIcon, CloseIcon } from '../icons';

function WindowTitleBar({ icon, title, isMaximized, onClose, onMinimize, onMaximize, onDragMouseDown }) {
  const handleDoubleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onMaximize();
  };

  return (
    <div
      id={`window_${title.toLowerCase().replace(/\s/g, '_')}_title_bar`}
      className={`window-title-bar flex items-center justify-between h-10 bg-gray-900/70 ${isMaximized ? '' : 'rounded-t-lg'} px-2 flex-shrink-0 select-none`}
      style={{ cursor: isMaximized ? 'default' : 'move' }}
      onMouseDown={onDragMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex items-center gap-2 pointer-events-none">
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
      <div className="flex items-center">
        <button className="p-2 rounded-md hover:bg-white/10" aria-label="Minimize" onClick={onMinimize}>
          <MinimizeIcon />
        </button>
        <button className="p-2 rounded-md hover:bg-white/10" aria-label="Maximize" onClick={onMaximize}>
          <MaximizeIcon />
        </button>
        <button className="p-2 rounded-md hover:bg-red-600" aria-label="Close" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

export default WindowTitleBar;
