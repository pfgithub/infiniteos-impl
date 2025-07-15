import React from 'react';

function TaskbarItem({ id, label, icon, isActive = false }) {
  return (
    <div
      id={id}
      className={`p-2 rounded cursor-pointer ${
        isActive ? 'bg-blue-600/50' : 'hover:bg-white/20'
      }`}
      aria-label={label}
    >
      {icon}
    </div>
  );
}

export default TaskbarItem;