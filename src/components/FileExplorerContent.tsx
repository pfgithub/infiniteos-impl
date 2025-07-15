import React, { useState, useEffect, useMemo } from 'react';
import { readDir, trashFile } from '../filesystem';
import { todoImplement } from '../todo';
import {
  FolderIcon,
  FileIcon,
  ArrowUpIcon,
  HomeIcon,
  SystemIcon,
  AppearanceIcon,
  VolumeIcon,
  VideoIcon,
  DownloadIcon
} from '../icons';

type FsItem = { name: string; path: string; isDir: boolean };

const SidebarItem = ({ icon, label, path, activePath, onClick }: {
  icon: React.ReactNode,
  label: string,
  path: string,
  activePath: string,
  onClick: (path: string) => void
}) => (
  <button
    onClick={() => onClick(path)}
    className={`w-full flex items-center gap-3 p-2 rounded text-left transition ${
      activePath === path ? 'bg-blue-600/50' : 'hover:bg-white/10'
    }`}
  >
    {React.cloneElement(icon as React.ReactElement, { className: 'h-5 w-5 flex-shrink-0' })}
    <span>{label}</span>
  </button>
);

const FileGridItem = ({ name, isDir, onDoubleClick }: { name: string, isDir: boolean, onDoubleClick: () => void }) => (
  <button
    onDoubleClick={onDoubleClick}
    className="flex flex-col items-center p-2 rounded hover:bg-black/20 focus:bg-blue-500/50 cursor-pointer w-28 h-28 justify-center text-center"
  >
    <div className="text-yellow-400">
      {isDir ? <FolderIcon /> : <FileIcon />}
    </div>
    <p className="text-white text-shadow text-sm mt-2 break-all">{name}</p>
  </button>
);

const FileExplorerContent: React.FC<{ id: string }> = ({ id }) => {
  const [currentPath, setCurrentPath] = useState('/Users/Admin/');
  const [addressBarPath, setAddressBarPath] = useState(currentPath);
  const [contents, setContents] = useState<FsItem[]>([]);
  const [history, setHistory] = useState([currentPath]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        setError(null);
        const dirContents = await readDir(currentPath);
        dirContents.sort((a, b) => {
          if (a.isDir !== b.isDir) {
            return a.isDir ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
        setContents(dirContents);
      } catch (err) {
        console.error(`Failed to read directory ${currentPath}:`, err);
        setError(`Could not read directory: ${currentPath}.`);
      }
    };
    fetchContents();
    setAddressBarPath(currentPath);
  }, [currentPath]);

  const navigateTo = (path: string) => {
    if (path === currentPath) return;

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
  };
  
  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPath(history[newIndex]);
    }
  };
  
  const goUp = () => {
    if (currentPath === '/') return;
    const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/', currentPath.length - 2)) + '/';
    navigateTo(parentPath || '/');
  };

  const handleItemDoubleClick = (item: FsItem) => {
    if (item.isDir) {
      navigateTo(item.path);
    } else {
      todoImplement(`Open file: ${item.path}. This should open the file with its default application.`);
    }
  };
  
  const handleAddressBarSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      navigateTo(addressBarPath);
  }

  const quickAccessItems = useMemo(() => [
    { label: 'Home', path: '/Users/Admin/', icon: <HomeIcon /> },
    { label: 'Desktop', path: '/Users/Admin/Desktop/', icon: <SystemIcon /> },
    { label: 'Documents', path: '/Users/Admin/Documents/', icon: <FileIcon /> },
    { label: 'Downloads', path: '/Users/Admin/Downloads/', icon: <DownloadIcon /> },
    { label: 'Pictures', path: '/Users/Admin/Pictures/', icon: <AppearanceIcon /> },
    { label: 'Music', path: '/Users/Admin/Music/', icon: <VolumeIcon /> },
    { label: 'Videos', path: '/Users/Admin/Videos/', icon: <VideoIcon /> },
  ], []);

  return (
    <div className="flex h-full bg-gray-800 text-white">
      <div className="w-52 bg-black/20 p-2 flex-shrink-0 flex flex-col gap-1">
        <h3 className="px-2 pt-2 pb-1 text-sm font-semibold text-gray-400">Quick Access</h3>
        {quickAccessItems.map(item => (
          <SidebarItem
            key={item.path}
            {...item}
            activePath={currentPath}
            onClick={navigateTo}
          />
        ))}
      </div>
      <div className="flex-grow flex flex-col">
        <div className="flex-shrink-0 h-12 bg-black/25 flex items-center px-2 gap-1 border-b border-white/10">
          <button onClick={goBack} disabled={historyIndex === 0} className="p-2 rounded-full hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={goForward} disabled={historyIndex >= history.length - 1} className="p-2 rounded-full hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
          <button onClick={goUp} disabled={currentPath === '/'} className="p-2 rounded-full hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">
            <ArrowUpIcon />
          </button>
          <form onSubmit={handleAddressBarSubmit} className="flex-grow ml-2">
            <input
                type="text"
                value={addressBarPath}
                onChange={(e) => setAddressBarPath(e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-full bg-gray-900 text-white p-1 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a path"
            />
          </form>
        </div>
        <div className="flex-grow p-4 overflow-y-auto">
          {error ? (
             <div className="text-red-400">{error}</div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {contents.map(item => (
                <FileGridItem
                  key={item.path}
                  name={item.name}
                  isDir={item.isDir}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileExplorerContent;
