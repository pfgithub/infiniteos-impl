import React from 'react';
import { create } from 'zustand';

const DEFAULT_WIDTH = 900;
const DEFAULT_HEIGHT = 640;

export interface WindowInstance {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ComponentType<{ id: string }>;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  prevX?: number;
  prevY?: number;
  prevWidth?: number;
  prevHeight?: number;
}

interface WindowState {
  windows: WindowInstance[];
  nextZIndex: number;
  openWindow: (windowConfig: Omit<WindowInstance, 'zIndex' | 'isMinimized' | 'isMaximized' | 'x' | 'y' | 'width' | 'height' | 'prevX' | 'prevY' | 'prevWidth' | 'prevHeight'>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  setWindowProps: (id: string, props: Partial<WindowInstance>) => void;
}

const useWindowStore = create<WindowState>((set) => ({
  windows: [],
  nextZIndex: 100, // Starting z-index for windows

  openWindow: (windowConfig) => {
    set((state) => {
      const existingWindow = state.windows.find((w) => w.id === windowConfig.id);
      if (existingWindow) {
        // If window exists, focus it and un-minimize if needed
        return {
          windows: state.windows.map((w) =>
            w.id === windowConfig.id ? { ...w, zIndex: state.nextZIndex + 1, isMinimized: false } : w
          ),
          nextZIndex: state.nextZIndex + 1,
        };
      } else {
        // Position new windows with a slight cascade
        const openWindows = state.windows.filter(w => !w.isMinimized).length;
        const offset = openWindows * 30;
        const { innerWidth, innerHeight } = typeof window !== 'undefined' ? window : { innerWidth: 1920, innerHeight: 1080 };
        const taskbarHeight = 48;

        const newWindow: WindowInstance = {
          ...windowConfig,
          zIndex: state.nextZIndex + 1,
          isMinimized: false,
          isMaximized: false,
          width: DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT,
          x: (innerWidth - DEFAULT_WIDTH) / 2 + offset,
          y: (innerHeight - taskbarHeight - DEFAULT_HEIGHT) / 2 + offset,
        };
        return {
          windows: [...state.windows, newWindow],
          nextZIndex: state.nextZIndex + 1,
        };
      }
    });
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    }));
  },

  focusWindow: (id) => {
    set((state) => {
      const windowsSortedByZ = [...state.windows]
        .filter(w => !w.isMinimized)
        .sort((a,b) => b.zIndex - a.zIndex);
      
      const focusedWindow = windowsSortedByZ.length > 0 ? windowsSortedByZ[0] : null;

      if (focusedWindow && focusedWindow.id === id) {
        return state;
      }

      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, zIndex: state.nextZIndex + 1, isMinimized: false } : w
        ),
        nextZIndex: state.nextZIndex + 1,
      }
    });
  },

  toggleMinimize: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
      ),
    }));
  },

  toggleMaximize: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id === id) {
          if (w.isMaximized) {
            // Restore
            return {
              ...w,
              isMaximized: false,
              x: w.prevX ?? w.x,
              y: w.prevY ?? w.y,
              width: w.prevWidth ?? DEFAULT_WIDTH,
              height: w.prevHeight ?? DEFAULT_HEIGHT,
            };
          } else {
            // Maximize
            return {
              ...w,
              isMaximized: true,
              prevX: w.x,
              prevY: w.y,
              prevWidth: w.width,
              prevHeight: w.height,
            };
          }
        }
        return w;
      }),
    }));
  },

  setWindowProps: (id, props) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, ...props } : w)),
    }));
  },
}));

export default useWindowStore;
