import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = ({ fullView = false }) => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)); // March 2025

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const generateCalendarDays = () => {
        const days = [];

        // Add empty slots for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const calendarDays = generateCalendarDays();

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <button onClick={handlePrevMonth} className="text-gray-500 hover:text-gray-800">
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-800">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={handleNextMonth} className="text-gray-500 hover:text-gray-800">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-xs text-gray-500 font-medium">{day}</div>
                ))}
                {calendarDays.map((day, index) => (
                    <div
                        key={index}
                        className={`
                            ${day ? 'hover:bg-purple-100 cursor-pointer' : ''}
                            ${day === 27 ? 'bg-purple-800 text-white' : ''}
                            p-2 rounded-lg text-sm
                            ${!day ? 'text-gray-300' : 'text-gray-800'}
                        `}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarView;