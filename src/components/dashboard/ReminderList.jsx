import React, { useState } from 'react';
import { Plus, Check, Circle } from 'lucide-react';

const ReminderList = ({ fullView = false }) => {
    const [reminders, setReminders] = useState([
        {
            id: 1,
            title: 'Design Project Framework',
            time: 'Hari Ini',
            completed: false,
            type: 'purple'
        },
        {
            id: 2,
            title: 'Design Project Framework',
            time: 'Besok',
            completed: false,
            type: 'purple'
        },
        {
            id: 3,
            title: 'Design Project Framework',
            time: 'Yang Akan Datang',
            completed: false,
            type: 'purple'
        },
        {
            id: 4,
            title: 'Design Project Framework',
            time: 'Hari Ini',
            completed: false,
            type: 'purple'
        },
        {
            id: 5,
            title: 'Design Project Framework',
            time: 'Besok',
            completed: false,
            type: 'purple'
        }
    ]);

    const toggleCompletion = (id) => {
        setReminders(reminders.map(reminder =>
            reminder.id === id
                ? { ...reminder, completed: !reminder.completed }
                : reminder
        ));
    };

    // Group reminders by time category
    const remindersByTime = reminders.reduce((acc, reminder) => {
        if (!acc[reminder.time]) {
            acc[reminder.time] = [];
        }
        acc[reminder.time].push(reminder);
        return acc;
    }, {});

    const timeColorMap = {
        'Hari Ini': 'text-red-500',
        'Besok': 'text-yellow-500',
        'Yang Akan Datang': 'text-green-500'
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    {fullView ? 'All Reminders' : 'Pengingat'}
                </h2>
                <button className="text-gray-500 hover:text-gray-800">
                    <Plus size={20} />
                </button>
            </div>
            <div className="space-y-5">
                {Object.entries(remindersByTime).map(([time, timeReminders]) => (
                    <div key={time} className="space-y-2">
                        <h3 className={`text-sm font-medium ${timeColorMap[time] || 'text-gray-500'}`}>
                            {time}
                        </h3>
                        {timeReminders.map((reminder) => (
                            <div
                                key={reminder.id}
                                className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => toggleCompletion(reminder.id)}
                                        className={`
                                            ${reminder.completed
                                                ? 'bg-purple-500 text-white'
                                                : 'border-2 border-purple-300'}
                                            w-5 h-5 rounded-full flex items-center justify-center
                                        `}
                                    >
                                        {reminder.completed && <Check size={12} />}
                                    </button>
                                    <div>
                                        <p className={`
                                            text-sm font-medium 
                                            ${reminder.completed ? 'line-through text-gray-400' : 'text-gray-800'}
                                        `}>
                                            {reminder.title}
                                        </p>
                                    </div>
                                </div>
                                <Circle size={8} className="text-purple-500" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReminderList;