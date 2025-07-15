import React from 'react';
import { MinimizeIcon, MaximizeIcon, CloseIcon } from '../icons';
import { todoImplement } from '../todo';

function WindowTitleBar({ icon, title, onClose }) {
  return (
    <div
      id={`window_${title.toLowerCase()}_title_bar`}
      className="window-title-bar flex items-center justify-between h-10 bg-gray-900/70 rounded-t-lg px-2 flex-shrink-0"
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
      <div className="flex items-center">
        <button className="p-2 rounded-md hover:bg-white/10" aria-label="Minimize" onClick={() => todoImplement(`The minimize button on the '${title}' window was clicked. Implement minimizing the window.`)}>
          <MinimizeIcon />
        </button>
        <button className="p-2 rounded-md hover:bg-white/10" aria-label="Maximize" onClick={() => todoImplement(`The maximize button on the '${title}' window was clicked. Implement maximizing/restoring the window.`)}>
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
