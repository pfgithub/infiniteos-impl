
import React, { useState, useEffect } from 'react';

import useWindowStore from '../store/windowStore';

import { WINDOW_DEFS } from '../windows';

import { todoImplement } from '../todo';

import { readDir } from '../filesystem';



const StartMenuItem = ({ id, icon, label, onClick }: { id: string, icon: React.ReactNode, label: string, onClick: () => void }) => (

  <button id={id} onClick={onClick} className="flex items-center gap-3 p-3 rounded-md hover:bg-white/10 w-full text-left transition-colors">

    {React.cloneElement(icon as React.ReactElement, { className: 'w-8 h-8 flex-shrink-0' })}

    <span className="text-white text-base">{label}</span>

  </button>

);



// Map from app filename in /Applications/ to the key in WINDOW_DEFS

const APP_FILENAME_TO_DEF_KEY: { [key: string]: keyof typeof WINDOW_DEFS } = {

    'Browser.app': 'BROWSER',

    'FileExplorer.app': 'FILE_EXPLORER',

    'Settings.app': 'SETTINGS',

    'GameCenter.app': 'GAMES',

    'TextEditor.app': 'TEXT_EDITOR',

    'MusicPlayer.app': 'MUSIC_PLAYER',

    'ImageViewer.app': 'IMAGE_VIEWER',

    'Feedback.app': 'FEEDBACK',

    'Calculator.app': 'CALCULATOR',

    'Terminal.app': 'TERMINAL',

    'EmailClient.app': 'EMAIL_CLIENT',

    'Calendar.app': 'CALENDAR',

    'Maps.app': 'MAPS',

    'Weather.app': 'WEATHER',

    'Photos.app': 'PHOTOS',

    'VideoPlayer.app': 'VIDEO_PLAYER',

    'Spreadsheet.app': 'SPREADSHEET',

    'Presentation.app': 'PRESENTATION',

    'WordProcessor.app': 'WORD_PROCESSOR',

    'CodeEditor.app': 'CODE_EDITOR',

    'Notes.app': 'NOTES',

    'Contacts.app': 'CONTACTS',

    'Clock.app': 'CLOCK',

    'Antivirus.app': 'ANTIVIRUS',

    'PDF_Reader.app': 'PDF_READER',

    'CloudStorage.app': 'CLOUD_STORAGE',

    'VPN.app': 'VPN',

    'SpaceAdventures.app': 'SPACE_ADVENTURES',

};



const StartMenu = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {

  const { openWindow } = useWindowStore();

  const [allApps, setAllApps] = useState<{ def: typeof WINDOW_DEFS[keyof typeof WINDOW_DEFS], label: string }[]>([]);



  useEffect(() => {

    const fetchApps = async () => {

        try {

            const appFiles = await readDir('/Applications/');

            const registeredApps = appFiles

                .map(file => {

                    const defKey = APP_FILENAME_TO_DEF_KEY[file.name];

                    if (defKey) {

                        const def = WINDOW_DEFS[defKey];

                        return { def, label: def.title };

                    }

                    return null;

                })

                .filter(Boolean) as { def: typeof WINDOW_DEFS[keyof typeof WINDOW_DEFS], label: string }[];

            

            // Add other special apps not in /Applications/

            const specialApps = [

                { def: WINDOW_DEFS.RECYCLE_BIN, label: 'Recycle Bin' },

            ];



            const combinedApps = [...registeredApps, ...specialApps];

            combinedApps.sort((a, b) => a.label.localeCompare(b.label));



            setAllApps(combinedApps);



        } catch (error) {

            console.error("Failed to load apps for start menu:", error);

            // set a default or empty list

            setAllApps([

                { def: WINDOW_DEFS.RECYCLE_BIN, label: 'Recycle Bin' },

            ]);

        }

    };

    if (isOpen) {

        fetchApps();

    }

  }, [isOpen]);



  const handleOpenWindow = (windowDef: typeof WINDOW_DEFS[keyof typeof WINDOW_DEFS]) => {

    openWindow(windowDef);

    onClose();

  };



  const pinnedApps = [

    { def: WINDOW_DEFS.BROWSER, label: 'Browser' },

    { def: WINDOW_DEFS.SETTINGS, label: 'Settings' },

    { def: WINDOW_DEFS.FILE_EXPLORER, label: 'File Explorer' },

    { def: WINDOW_DEFS.GAMES, label: 'My Games' },

  ];

  

  const pinnedAppIds = new Set(pinnedApps.map(p => p.def.id));

  const filteredAllApps = allApps.filter(app => !pinnedAppIds.has(app.def.id));



  if (!isOpen) {

    return null;

  }



  return (

    <div

      id="start_menu"

      className="absolute bottom-[52px] left-2 w-[550px] h-[650px] bg-gray-900/80 backdrop-blur-xl rounded-lg shadow-2xl z-[50000] flex flex-col p-4 text-white"

    >

      <div className="mb-4">

        <input 

          id="start_menu_search"

          type="text"

          placeholder="Search for apps, files, and settings"

          className="w-full bg-black/30 border border-white/20 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"

          onFocus={() => todoImplement("Start menu search was focused. Implement search functionality.")}

        />

      </div>



      <div className="flex-grow overflow-y-auto">

        <div className="mb-4">

            <h2 className="text-lg font-semibold px-2 mb-2">Pinned</h2>

            <div className="grid grid-cols-2 gap-2">

                {pinnedApps.map(({ def, label }) => (

                    <StartMenuItem

                        id={`start_menu_pinned_${def.id}`}

                        key={def.id}

                        icon={def.icon}

                        label={label}

                        onClick={() => handleOpenWindow(def)}

                    />

                ))}

            </div>

        </div>



        <div>

            <h2 className="text-lg font-semibold px-2 mb-2">All Apps</h2>

            <div className="grid grid-cols-2 gap-2">

                {filteredAllApps.map(({ def, label }) => (

                    <StartMenuItem

                        id={`start_menu_app_${def.id}`}

                        key={def.id}

                        icon={def.icon}

                        label={label}

                        onClick={() => handleOpenWindow(def)}

                    />

                ))}

            </div>

        </div>

      </div>



      <div className="mt-auto border-t border-white/10 pt-3 flex justify-between items-center flex-shrink-0">

          <div id="start_menu_user" className="flex items-center gap-3 hover:bg-white/10 p-2 rounded-md cursor-pointer transition-colors">

              <img src="/filesystem/Users/Admin/Pictures/Avatars/admin_avatar.png" alt="Admin" className="w-8 h-8 rounded-full bg-gray-500" />

              <span>Admin</span>

          </div>

          <button 

            id="start_menu_power" 

            className="p-2 rounded-full hover:bg-white/20 transition-colors" 

            aria-label="Power"

            onClick={() => todoImplement("The power button in the start menu was clicked. Implement power options (shutdown, restart).")}

            >

              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>

                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />

              </svg>

          </button>

      </div>

    </div>

  );

};



export default StartMenu;

