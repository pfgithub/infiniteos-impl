import React, { useState, useEffect, useCallback } from 'react';
import { getTrashItems, restoreTrashItem, deleteTrashItem, emptyTrash } from '../filesystem';
import { FileIcon } from '../icons';
import { todoImplement } from '../todo';

interface TrashItem {
  path: string;
  name: string;
  originalPath: string;
  deletedAt: string;
}

const RecycleBinContent: React.FC<{ id: string }> = ({ id }) => {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const trashItems = await getTrashItems();
      trashItems.sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());
      setItems(trashItems);
    } catch (err) {
      console.error('Failed to load recycle bin items:', err);
      setError('Could not load items from the Recycle Bin.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleEmptyTrash = async () => {
    if (window.confirm('Are you sure you want to permanently empty the Recycle Bin? All items will be deleted.')) {
      try {
        await emptyTrash();
        await fetchItems();
      } catch (err) {
        setError('Failed to empty the Recycle Bin.');
        console.error(err);
      }
    }
  };

  const handleRestoreItem = async (itemPath: string) => {
    try {
      await restoreTrashItem(itemPath);
      await fetchItems();
    } catch (err) {
      setError(`Failed to restore item. The original location might not exist anymore.`);
      console.error(err);
      todoImplement(`Failed to restore item: ${itemPath}. The original path directory might not exist. Implement creating parent directories if needed.`);
    }
  };

  const handleDeleteItem = async (itemPath: string) => {
    try {
      await deleteTrashItem(itemPath);
      await fetchItems();
    } catch (err) {
      setError('Failed to delete item.');
      console.error(err);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex-grow flex items-center justify-center">Loading items...</div>;
    }
    if (error) {
      return <div className="flex-grow flex items-center justify-center text-red-400">{error}</div>;
    }
    if (items.length === 0) {
      return <div className="flex-grow flex items-center justify-center text-gray-400">The Recycle Bin is empty.</div>;
    }

    return (
      <div className="flex-grow overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/20 sticky top-0">
            <tr>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Original Location</th>
              <th className="p-3 font-semibold">Date Deleted</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.path} className="border-b border-white/10 hover:bg-white/5">
                <td className="p-3 flex items-center gap-2">
                  <FileIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate" title={item.name}>{item.name.split('-').slice(1).join('-')}</span>
                </td>
                <td className="p-3 truncate" title={item.originalPath}>{item.originalPath}</td>
                <td className="p-3">{new Date(item.deletedAt).toLocaleString()}</td>
                <td className="p-3 space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => handleRestoreItem(item.path)}
                    className="text-blue-400 hover:underline"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.path)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex-grow flex flex-col bg-gray-800 text-white">
      <div className="flex-shrink-0 p-2 bg-black/25 flex items-center gap-2 border-b border-white/10">
        <button
          onClick={handleEmptyTrash}
          disabled={items.length === 0 || isLoading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Empty Recycle Bin
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default RecycleBinContent;
