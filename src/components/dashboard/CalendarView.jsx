import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = ({ fullView = false, tasksByDate = new Map(), onDateClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const formatDateToKey = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const generateCalendarDays = () => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ key: `empty-${i}`, day: null, date: null });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            days.push({ key: `day-${i}`, day: i, date: date });
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
    const todayKey = formatDateToKey(new Date());

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <button onClick={handlePrevMonth} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100">
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-800 text-center w-36">
                        {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={handleNextMonth} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                    <div key={day} className="text-xs text-gray-500 font-medium pb-2">{day}</div>
                ))}

                {calendarDays.map(({ key, day, date }) => {
                    const dateKey = date ? formatDateToKey(date) : null;
                    const hasTasks = dateKey ? tasksByDate.has(dateKey) : false;
                    const isToday = dateKey === todayKey;

                    return (
                        <div
                            key={key}
                            onClick={() => day && onDateClick && onDateClick(date)}
                            className={`
                                p-2 rounded-lg text-sm relative transition-colors duration-150
                                ${day ? 'cursor-pointer hover:bg-gray-100' : 'text-transparent'}
                                ${isToday ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-800'}
                                ${hasTasks ? (isToday ? 'bg-purple-300' : 'bg-purple-200') : ''}
                                ${hasTasks ? (isToday ? 'text-purple-900' : 'text-gray-900') : ''}
                            `}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
