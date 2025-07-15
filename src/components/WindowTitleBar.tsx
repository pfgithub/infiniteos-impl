import React from 'react';
import { MinimizeIcon, MaximizeIcon, CloseIcon } from '../icons';

function WindowTitleBar({ icon, title, onClose, onMinimize, onMaximize }) {
  return (
    <div
      id={`window_${title.toLowerCase()}_title_bar`}
      className="window-title-bar flex items-center justify-between h-10 bg-gray-900/70 rounded-t-lg px-2 flex-shrink-0 cursor-default"
    >
      <div className="flex items-center gap-2">
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
