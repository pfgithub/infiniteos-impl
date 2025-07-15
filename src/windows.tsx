import React from 'react';
import SettingsContent from './components/settings/SettingsContent';
import FeedbackContent from './components/FeedbackContent';
import { SettingsIcon, BrowserIcon, FileExplorerIcon, GamesIcon, RecycleBinIcon, AppearanceIcon, InfoIcon, NetworkIcon, SystemIcon, UsersIcon, VolumeIcon, ClockIcon, FileIcon, CalculatorIcon, ArcaneLegacyIcon, TowerForgeDefenseIcon } from './icons';
import GamesContent from './components/GamesContent';
import DungeonDelveMainMenu from './components/games/dungeondelve/DungeonDelveMainMenu';
import BrowserContent from './components/BrowserContent';
import CyberRunnerMainMenu from './components/games/cyberrunner/CyberRunnerMainMenu';
import ClockContent from './components/ClockContent';
import FileExplorerContent from './components/FileExplorerContent';
import { todoImplement } from './todo';
import RecycleBinContent from './components/RecycleBinContent';
import IslandEscapeMainMenu from './components/games/islandescape/IslandEscapeMainMenu';
import CitySkylinesMainMenu from './components/games/cityskylines/CitySkylinesMainMenu';
import CalculatorContent from './components/CalculatorContent';
import PixelQuestMainMenu from './components/games/pixelquest/PixelQuestMainMenu';
import ArcaneLegacyMainMenu from './components/games/arcanelegacy/ArcaneLegacyMainMenu';
import TowerForgeDefenseMainMenu from './components/games/towerforgedefense/TowerForgeDefenseMainMenu';

const PlaceholderWindowContent: React.FC<{ id: string; appName: string }> = ({ appName }) => (
    <div className="flex-grow p-4 flex flex-col items-center justify-center text-center gap-4">
      <div>
        <p>The <strong>{appName}</strong> application is not yet implemented.</p>
        <p>This is a placeholder window.</p>
      </div>
      <button
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        onClick={() => todoImplement(`Implement the ${appName} application.`)}
      >
        Implement {appName}
      </button>
    </div>
);

export const WINDOW_DEFS = {
    SETTINGS: {
      id: 'settings',
      title: 'Settings',
      icon: <SettingsIcon className="h-6 w-6" />,
      component: SettingsContent,
    },
    BROWSER: {
      id: 'browser',
      title: 'Browser',
      icon: <BrowserIcon className="h-6 w-6" />,
      component: BrowserContent,
    },
    FILE_EXPLORER: {
      id: 'file_explorer',
      title: 'File Explorer',
      icon: <FileExplorerIcon className="h-6 w-6" />,
      component: FileExplorerContent,
    },
    GAMES: {
      id: 'my_games',
      title: 'My Games',
      icon: <GamesIcon className="h-6 w-6" />,
      component: GamesContent,
    },
    RECYCLE_BIN: {
      id: 'recycle_bin',
      title: 'Recycle Bin',
      icon: <RecycleBinIcon className="h-6 w-6" />,
      component: RecycleBinContent,
    },
    DUNGEON_DELVE: {
      id: 'dungeondelve_game',
      title: 'Dungeon Delve',
      icon: <GamesIcon className="h-6 w-6" />,
      component: DungeonDelveMainMenu,
    },
    CYBER_RUNNER: {
      id: 'cyberrunner_game',
      title: 'CyberRunner 2077',
      icon: <GamesIcon className="h-6 w-6" />,
      component: CyberRunnerMainMenu,
    },
    ISLAND_ESCAPE: {
      id: 'islandescape_game',
      title: 'Island Escape',
      icon: <GamesIcon className="h-6 w-6" />,
      component: IslandEscapeMainMenu,
    },
    CITY_SKYLINES: {
      id: 'cityskylines_game',
      title: 'City Skylines II',
      icon: <GamesIcon className="h-6 w-6" />,
      component: CitySkylinesMainMenu,
    },
    PIXEL_QUEST: {
      id: 'pixelquest_game',
      title: 'Pixel Quest',
      icon: <GamesIcon className="h-6 w-6" />,
      component: PixelQuestMainMenu,
    },
    ARCANE_LEGACY: {
      id: 'arcanelegacy_game',
      title: 'Arcane Legacy',
      icon: <ArcaneLegacyIcon className="h-6 w-6" />,
      component: ArcaneLegacyMainMenu,
    },
    TOWER_FORGE_DEFENSE: {
        id: 'towerforgedefense_game',
        title: 'TowerForge Defense',
        icon: <TowerForgeDefenseIcon className="h-6 w-6" />,
        component: TowerForgeDefenseMainMenu,
    },
    TEXT_EDITOR: {
      id: 'text_editor',
      title: 'Text Editor',
      icon: <FileIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Text Editor" />,
    },
    MUSIC_PLAYER: {
      id: 'music_player',
      title: 'Music Player',
      icon: <VolumeIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Music Player" />,
    },
    IMAGE_VIEWER: {
      id: 'image_viewer',
      title: 'Image Viewer',
      icon: <AppearanceIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Image Viewer" />,
    },
    FEEDBACK: {
      id: 'feedback',
      title: 'Feedback',
      icon: <InfoIcon className="h-6 w-6" />,
      component: FeedbackContent,
    },
    CALCULATOR: {
      id: 'calculator',
      title: 'Calculator',
      icon: <CalculatorIcon className="h-6 w-6" />,
      component: CalculatorContent,
    },
    TERMINAL: {
      id: 'terminal',
      title: 'Terminal',
      icon: <SystemIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Terminal" />,
    },
    EMAIL_CLIENT: {
      id: 'email_client',
      title: 'Email Client',
      icon: <NetworkIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Email Client" />,
    },
    CALENDAR: {
      id: 'calendar',
      title: 'Calendar',
      icon: <SystemIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Calendar" />,
    },
    MAPS: {
      id: 'maps',
      title: 'Maps',
      icon: <BrowserIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Maps" />,
    },
    WEATHER: {
      id: 'weather',
      title: 'Weather',
      icon: <BrowserIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Weather" />,
    },
    PHOTOS: {
      id: 'photos',
      title: 'Photos',
      icon: <AppearanceIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Photos" />,
    },
    VIDEO_PLAYER: {
      id: 'video_player',
      title: 'Video Player',
      icon: <SystemIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Video Player" />,
    },
    SPREADSHEET: {
      id: 'spreadsheet',
      title: 'Spreadsheet',
      icon: <FileIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Spreadsheet" />,
    },
    PRESENTATION: {
      id: 'presentation',
      title: 'Presentation',
      icon: <FileIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Presentation" />,
    },
    WORD_PROCESSOR: {
      id: 'word_processor',
      title: 'Word Processor',
      icon: <FileIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Word Processor" />,
    },
    CODE_EDITOR: {
      id: 'code_editor',
      title: 'Code Editor',
      icon: <SystemIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Code Editor" />,
    },
    NOTES: {
      id: 'notes',
      title: 'Notes',
      icon: <FileIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Notes" />,
    },
    CONTACTS: {
      id: 'contacts',
      title: 'Contacts',
      icon: <UsersIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Contacts" />,
    },
    CLOCK: {
      id: 'clock',
      title: 'Clock',
      icon: <ClockIcon className="h-6 w-6" />,
      component: ClockContent,
    },
    ANTIVIRUS: {
      id: 'antivirus',
      title: 'Antivirus',
      icon: <SystemIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Antivirus" />,
    },
    PDF_READER: {
      id: 'pdf_reader',
      title: 'PDF Reader',
      icon: <FileIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="PDF Reader" />,
    },
    CLOUD_STORAGE: {
      id: 'cloud_storage',
      title: 'Cloud Storage',
      icon: <BrowserIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Cloud Storage" />,
    },
    VPN: {
      id: 'vpn',
      title: 'VPN',
      icon: <NetworkIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="VPN" />,
    },
    SPACE_ADVENTURES: {
      id: 'space_adventures',
      title: 'Space Adventures',
      icon: <GamesIcon className="h-6 w-6" />,
      component: (props: {id: string}) => <PlaceholderWindowContent {...props} appName="Space Adventures" />,
    },
};
