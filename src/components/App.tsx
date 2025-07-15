import React from 'react';
import Desktop from './Desktop';
import SettingsWindow from './SettingsWindow';
import Taskbar from './Taskbar';

function App() {
  const backgroundStyle = {
    backgroundImage: "url('/filesystem/Users/Admin/Pictures/Wallpapers/galaxy.jpg')",
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-cover bg-center" style={backgroundStyle}>
      <div className="h-full w-full flex flex-col relative">
        <Desktop />
        <SettingsWindow />
        <Taskbar />
      </div>
    </div>
  );
}

export default App;