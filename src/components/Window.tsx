import React from 'react';
import WindowTitleBar from './WindowTitleBar';
import useWindowStore, { WindowInstance } from '../store/windowStore';

interface WindowProps {
  window: WindowInstance;
}

const MIN_WIDTH = 300;
const MIN_HEIGHT = 200;

function Window({ window: w }: WindowProps) {
  const { closeWindow, focusWindow, toggleMinimize, toggleMaximize, setWindowProps } = useWindowStore();

  const handleClose = () => closeWindow(w.id);
  const handleMinimize = () => toggleMinimize(w.id);
  const handleMaximize = () => toggleMaximize(w.id);
  
  const handleFocus = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).dataset.resizeHandle) {
      return;
    }
    focusWindow(w.id);
  };
  
  const handleDragMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    // Prevent drag from starting on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    if (w.isMaximized) {
      // It's tricky to start dragging immediately after restore due to state update latency.
      // For now, restoring on drag is sufficient. User can then drag the restored window.
      // A better implementation might wait for the state update before starting the drag.
      return;
    }

    focusWindow(w.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = w.x;
    const initialY = w.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newX = initialX + moveEvent.clientX - startX;
      const newY = initialY + moveEvent.clientY - startY;
      setWindowProps(w.id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>, direction: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (w.isMaximized) return;

    focusWindow(w.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const { x, y, width, height } = w;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newProps: Partial<WindowInstance> = {};

      if (direction.includes('e')) {
        newProps.width = Math.max(width + dx, MIN_WIDTH);
      }
      if (direction.includes('w')) {
        const newWidth = Math.max(width - dx, MIN_WIDTH);
        if (newWidth > MIN_WIDTH) {
          newProps.width = newWidth;
          newProps.x = x + dx;
        }
      }
      if (direction.includes('s')) {
        newProps.height = Math.max(height + dy, MIN_HEIGHT);
      }
      if (direction.includes('n')) {
        const newHeight = Math.max(height - dy, MIN_HEIGHT);
        if (newHeight > MIN_HEIGHT) {
          newProps.height = newHeight;
          newProps.y = y + dy;
        }
      }
      
      if (Object.keys(newProps).length > 0) {
        setWindowProps(w.id, newProps);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const WindowContent = w.component;

  const windowClasses = "absolute flex flex-col bg-gray-800/80 backdrop-blur-xl border border-white/20 text-white shadow-2xl transition-all duration-100";
  
  const style: React.CSSProperties = w.isMaximized 
    ? { top: 0, left: 0, width: '100vw', height: 'calc(100vh - 48px)', borderRadius: 0, transform: 'none' }
    : {
        transform: `translate(${w.x}px, ${w.y}px)`,
        width: `${w.width}px`,
        height: `${w.height}px`,
        borderRadius: '0.5rem',
      };

  const visibilityClass = w.isMinimized ? 'hidden' : 'flex';
  
  const resizeHandles = [
    { dir: 'n', cursor: 'ns-resize', className: 'top-0 left-1/2 -translate-x-1/2 h-2 w-full' },
    { dir: 's', cursor: 'ns-resize', className: 'bottom-0 left-1/2 -translate-x-1/2 h-2 w-full' },
    { dir: 'w', cursor: 'ew-resize', className: 'left-0 top-1/2 -translate-y-1/2 w-2 h-full' },
    { dir: 'e', cursor: 'ew-resize', className: 'right-0 top-1/2 -translate-y-1/2 w-2 h-full' },
    { dir: 'nw', cursor: 'nwse-resize', className: 'top-0 left-0 h-3 w-3' },
    { dir: 'ne', cursor: 'nesw-resize', className: 'top-0 right-0 h-3 w-3' },
    { dir: 'sw', cursor: 'nesw-resize', className: 'bottom-0 left-0 h-3 w-3' },
    { dir: 'se', cursor: 'nwse-resize', className: 'bottom-0 right-0 h-3 w-3' },
  ];

  return (
    <div
      id={`window_${w.id}`}
      className={`${windowClasses} ${visibilityClass} top-0 left-0`}
      style={{ ...style, zIndex: w.zIndex }}
      onMouseDown={handleFocus}
    >
      {!w.isMaximized && resizeHandles.map(handle => (
        <div
          key={handle.dir}
          data-resize-handle="true"
          className={`absolute ${handle.className}`}
          style={{ cursor: handle.cursor }}
          onMouseDown={(e) => handleResizeMouseDown(e, handle.dir)}
        />
      ))}

      <WindowTitleBar 
        title={w.title} 
        icon={w.icon}
        isMaximized={w.isMaximized}
        onClose={handleClose} 
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
        onDragMouseDown={handleDragMouseDown}
      />
      <div className="flex-grow flex flex-col overflow-hidden">
        <WindowContent id={w.id} />
      </div>
    </div>
  );
}

export default Window;
