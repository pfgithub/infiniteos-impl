import React, { useState, useEffect } from 'react';

const CalendarClockFlyout = ({ isOpen }: { isOpen: boolean }) => {
    const [today, setToday] = useState(new Date());
    const [displayDate, setDisplayDate] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setToday(new Date());
        }, 1000);
        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        if (isOpen) {
            // When opening, reset the calendar view to the current month
            setDisplayDate(new Date());
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }
    
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const monthName = displayDate.toLocaleString('default', { month: 'long' });
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays = [];
    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
        calendarDays.push(
            <div key={day} className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-white/20 ${isToday ? 'bg-blue-600 text-white' : ''}`}>
                {day}
            </div>
        );
    }
    
    const handlePrevMonth = () => {
        setDisplayDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setDisplayDate(new Date(year, month + 1, 1));
    };

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
        <div 
            id="calendar_clock_flyout"
            className="absolute bottom-[52px] right-2 w-96 bg-gray-900/80 backdrop-blur-xl rounded-lg shadow-2xl z-[50000] p-4 text-white flex flex-col gap-4"
        >
            {/* Top section with full date and time */}
            <div className="text-left">
                <p className="text-4xl font-light">{today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-sm text-gray-300">{today.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Calendar */}
            <div className="bg-black/20 p-3 rounded-md">
                <div className="flex justify-between items-center mb-2">
                    <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="font-semibold">{monthName} {year}</div>
                    <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-1">
                    {daysOfWeek.map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1 text-sm place-items-center">
                    {calendarDays}
                </div>
            </div>
        </div>
    );
};

export default CalendarClockFlyout;
