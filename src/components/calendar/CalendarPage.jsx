import React from 'react';
import { motion } from 'framer-motion';
import CalendarView from '../dashboard/CalendarView';

const CalendarPage = () => {
    // Dummy calendar events
    const events = [
        { date: '27 Mar 2025', tasks: ['Tugas Riset', 'Tugas Riset', 'Tugas Riset'] },
        { date: '28 Mar 2025', tasks: ['Project Desktop Update', 'Team Meeting'] },
        { date: '30 Mar 2025', tasks: ['Deadline Praktikum Cyber'] }
    ];

    return (
        <motion.div
            className="p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <h1 className="text-2xl font-bold mb-6">Calendar</h1>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <CalendarView events={events} />
                <div className="p-4 bg-gray-50 border-t">
                    <button className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition-colors">
                        Add New Event
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default CalendarPage;