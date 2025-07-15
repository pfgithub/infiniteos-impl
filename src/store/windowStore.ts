import React from 'react';
import { create } from 'zustand';

export interface WindowInstance {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ComponentType<{ id: string }>;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
}

interface WindowState {
  windows: WindowInstance[];
  nextZIndex: number;
  openWindow: (windowConfig: Omit<WindowInstance, 'zIndex' | 'isMinimized' | 'isMaximized'>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
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
        // If window doesn't exist, add it
        const newWindow: WindowInstance = {
          ...windowConfig,
          zIndex: state.nextZIndex + 1,
          isMinimized: false,
          isMaximized: false,
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
      // If already focused, do nothing
      const focusedWindow = state.windows.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), state.windows[0]);
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
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      ),
    }));
  },
}));

export default useWindowStore;
