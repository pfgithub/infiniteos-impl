import React, { useState, useEffect, useRef } from 'react';
import { todoImplement } from '../todo';

type Tab = 'Clock' | 'Alarm' | 'Stopwatch' | 'Timer';

// --- Clock Tab ---
const ClockTab = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-white p-8">
            <div className="text-7xl font-mono tracking-widest">{formatTime(time)}</div>
            <div className="text-xl mt-4">{formatDate(time)}</div>
        </div>
    );
};

// --- Alarm Tab ---
interface Alarm {
    id: number;
    time: string;
    label: string;
    enabled: boolean;
}

const AlarmTab = () => {
    const [alarms, setAlarms] = useState<Alarm[]>([
        { id: 1, time: '07:00', label: 'Wake up', enabled: true },
        { id: 2, time: '09:00', label: 'Morning Meeting', enabled: false },
    ]);

    const handleToggle = (id: number) => {
        setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
    };

    const handleDelete = (id: number) => {
        setAlarms(alarms.filter(a => a.id !== id));
    };

    return (
        <div className="p-6 text-white space-y-4">
            <h2 className="text-2xl font-bold">Alarms</h2>
            <button
                onClick={() => todoImplement('Implement adding a new alarm, including a UI to set time and label.')}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
                Add Alarm
            </button>
            <div className="space-y-3">
                {alarms.map(alarm => (
                    <div key={alarm.id} className="bg-black/20 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="text-3xl">{alarm.time}</p>
                            <p className="text-gray-400">{alarm.label}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" className="sr-only peer" checked={alarm.enabled} onChange={() => handleToggle(alarm.id)} />
                                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                                    <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-all peer-checked:translate-x-[1.5rem] peer-checked:bg-green-500"></div>
                                </div>
                            </label>
                            <button onClick={() => handleDelete(alarm.id)} className="text-red-500 hover:text-red-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Stopwatch Tab ---
const StopwatchTab = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning) {
            const startTime = Date.now() - time;
            timerRef.current = window.setInterval(() => {
                setTime(Date.now() - startTime);
            }, 10);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning]);

    const handleStartStop = () => setIsRunning(!isRunning);
    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
        setLaps([]);
    };
    const handleLap = () => {
        setLaps([time, ...laps]);
    };

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
        const milliseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
        return `${minutes}:${seconds}.${milliseconds}`;
    };

    return (
        <div className="flex flex-col items-center justify-start h-full text-white p-8 space-y-6">
            <div className="text-7xl font-mono tracking-widest">{formatTime(time)}</div>
            <div className="flex gap-4">
                <button onClick={handleStartStop} className="w-24 py-2 bg-blue-600 hover:bg-blue-700 rounded">{isRunning ? 'Stop' : 'Start'}</button>
                <button onClick={handleLap} disabled={!isRunning} className="w-24 py-2 bg-gray-600 hover:bg-gray-500 rounded disabled:opacity-50">Lap</button>
                <button onClick={handleReset} className="w-24 py-2 bg-red-600 hover:bg-red-500 rounded">Reset</button>
            </div>
            <div className="w-full flex-grow overflow-y-auto bg-black/20 rounded-lg p-2">
                <ul className="space-y-1">
                    {laps.map((lap, index) => (
                        <li key={index} className="flex justify-between p-2 rounded bg-gray-700/50">
                            <span>Lap {laps.length - index}</span>
                            <span>{formatTime(lap)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// --- Timer Tab ---
const TimerTab = () => {
    return (
        <div className="p-6 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Timer</h2>
            <p className="text-gray-400 mb-4">The timer functionality is not yet implemented.</p>
            <button
                onClick={() => todoImplement('Implement the Timer feature in the Clock app. It should allow setting a duration (HH:MM:SS), a start/pause button, a reset button, and should notify the user when the time is up.')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
                Implement Timer
            </button>
        </div>
    );
};

// --- Main Component ---
const ClockContent: React.FC<{ id: string }> = () => {
    const [activeTab, setActiveTab] = useState<Tab>('Clock');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Alarm': return <AlarmTab />;
            case 'Stopwatch': return <StopwatchTab />;
            case 'Timer': return <TimerTab />;
            case 'Clock':
            default: return <ClockTab />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-800 text-white">
            <div className="flex-shrink-0 flex border-b border-white/20">
                {(['Clock', 'Alarm', 'Stopwatch', 'Timer'] as Tab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-center transition-colors ${activeTab === tab ? 'bg-blue-600' : 'bg-gray-900/50 hover:bg-gray-700'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="flex-grow overflow-y-auto">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default ClockContent;
