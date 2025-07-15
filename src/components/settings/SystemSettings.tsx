import React from 'react';

function SystemSettings() {
  return (
    <div className="flex-grow p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">System</h2>
      <div className="space-y-6">
        {/* Device Specifications */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-white/10 pb-2">Device Specifications</h3>
          <div className="bg-black/20 p-4 rounded-lg mt-3 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Device name</span><span className="font-medium">CuOS-Desktop</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Processor</span><span className="font-medium">CuOS Virt-Core i7-13700K 3.40 GHz</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Installed RAM</span><span className="font-medium">16.0 GB</span></div>
            <div className="flex justify-between"><span className="text-gray-400">System type</span><span className="font-medium">64-bit operating system</span></div>
          </div>
        </div>

        {/* Storage */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-white/10 pb-2">Storage</h3>
          <div className="bg-black/20 p-4 rounded-lg mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg">System (C:)</span>
              <span className="text-gray-400 text-sm">128 GB used of 512 GB</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-4">
              <div className="bg-blue-500 h-4 rounded-full" style={{ width: '25%' }}></div>
            </div>
            <button id="settings_storage_details" className="mt-4 text-blue-400 hover:underline">Show more details</button>
          </div>
        </div>

        {/* OS Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-white/10 pb-2">CuOS Specifications</h3>
          <div className="bg-black/20 p-4 rounded-lg mt-3 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Edition</span><span className="font-medium">CuOS Home</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Version</span><span className="font-medium">1.2 "Aquamarine"</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Installed on</span><span className="font-medium">06/21/2025</span></div>
            <button id="settings_check_updates" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors w-full sm:w-auto">Check for updates</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemSettings;
