import React from 'react';

function DesktopIcon({ id, label, icon, onClick }) {
  return (
    <div
      id={id}
      className="flex flex-col items-center p-2 rounded hover:bg-black/20 focus:bg-blue-500/50 cursor-pointer w-28 h-28 justify-center"
      tabIndex="0"
      onClick={onClick}
    >
      {icon}
      <p className="text-white text-shadow text-sm text-center mt-2 break-all">{label}</p>
    </div>
  );
}

export default DesktopIcon;
