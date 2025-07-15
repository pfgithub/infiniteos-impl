import React from 'react';
import { WifiIcon } from '../../icons';
import { todoImplement } from '../../todo';

function NetworkSettings() {
  const [wifiEnabled, setWifiEnabled] = React.useState(true);

  return (
    <div className="flex-grow p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Network & Internet</h2>
      <div className="space-y-6">

        {/* Wi-Fi */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-white/10 pb-2 flex items-center gap-2"><WifiIcon /> Wi-Fi</h3>
          <div className="bg-black/20 p-4 rounded-lg mt-3">
            <div className="flex items-center justify-between mb-4">
              <span>Wi-Fi</span>
              <label htmlFor="wifi_toggle" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    id="wifi_toggle" 
                    className="sr-only peer" 
                    checked={wifiEnabled} 
                    onChange={() => { setWifiEnabled(!wifiEnabled); todoImplement(`The Wi-Fi toggle was switched ${!wifiEnabled ? 'ON' : 'OFF'}. Implement the logic to actually enable or disable the Wi-Fi adapter.`); }} />
                  <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                  <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-all peer-checked:translate-x-[1.5rem] peer-checked:bg-green-500"></div>
                </div>
              </label>
            </div>
            {wifiEnabled && (
              <div>
                <h4 className="font-semibold mb-2">Available Networks</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 rounded hover:bg-white/10">
                    <span>CuOS-Guest-WiFi</span>
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm" onClick={() => todoImplement("The 'Connect' button for 'CuOS-Guest-WiFi' network was clicked. Implement the Wi-Fi connection logic, including asking for a password if necessary.")}>Connect</button>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-blue-600/30">
                    <span>MyHomeNetwork_5G (Connected)</span>
                    <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm" onClick={() => todoImplement("The 'Disconnect' button for 'MyHomeNetwork_5G' was clicked. Implement disconnecting from the current Wi-Fi network.")}>Disconnect</button>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded hover:bg-white/10">
                    <span>xfinitywifi</span>
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm" onClick={() => todoImplement("The 'Connect' button for 'xfinitywifi' network was clicked. Implement the Wi-Fi connection logic.")}>Connect</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ethernet */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-white/10 pb-2">Ethernet</h3>
          <div className="bg-black/20 p-4 rounded-lg mt-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Ethernet 1</span>
              <span className="text-gray-400">Network cable unplugged</span>
            </div>
          </div>
        </div>
        
        {/* VPN */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-white/10 pb-2">VPN</h3>
          <div className="bg-black/20 p-4 rounded-lg mt-3 flex justify-between items-center">
             <span>Not connected</span>
             <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors" onClick={() => todoImplement("The 'Add VPN' button in Network settings was clicked. Implement the UI and logic for adding a new VPN connection.")}>Add VPN</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NetworkSettings;
