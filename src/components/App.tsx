import React from 'react';
import Desktop from './Desktop';
import Taskbar from './Taskbar';
import useWindowStore from '../store/windowStore';
import Window from './Window';

function App() {
  const { windows } = useWindowStore();

  const backgroundStyle = {
    backgroundImage: "url('/filesystem/Users/Admin/Pictures/Wallpapers/galaxy.jpg')",
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-cover bg-center" style={backgroundStyle}>
      <div className="h-full w-full flex flex-col relative">
        <Desktop />
        {windows.map((window) => (
          <Window key={window.id} window={window} />
        ))}
        <Taskbar />
      </div>
    </div>
  );
}

export default App;
