import React, { useState } from 'react';
import Desktop from './Desktop';
import SettingsWindow from './SettingsWindow';
import Taskbar from './Taskbar';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  const backgroundStyle = {
    backgroundImage: "url('/filesystem/Users/Admin/Pictures/Wallpapers/galaxy.jpg')",
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-cover bg-center" style={backgroundStyle}>
      <div className="h-full w-full flex flex-col relative">
        <Desktop />
        {isSettingsOpen && <SettingsWindow onClose={handleCloseSettings} />}
        <Taskbar isSettingsOpen={isSettingsOpen} />
      </div>
    </div>
  );
}

export default App;
