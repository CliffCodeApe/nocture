import React from 'react';
import { motion } from 'framer-motion';

const InboxPage = () => {
    // Dummy inbox messages
    const messages = [
        { id: 1, sender: 'System', title: 'Welcome to Nocture', date: '27 Mar 2025', read: true },
        { id: 2, sender: 'Notification', title: 'Task "Design Project Framework" due tomorrow', date: '27 Mar 2025', read: false },
        { id: 3, sender: 'Reminder', title: 'Don\'t forget to complete your Cyber praktikum', date: '26 Mar 2025', read: false },
    ];

    return (
        <motion.div
            className="p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <h1 className="text-2xl font-bold mb-6">Inbox</h1>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-b px-4 py-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Messages</span>
                        <span className="bg-purple-700 text-white text-xs px-2 py-1 rounded-full">
                            {messages.filter(m => !m.read).length} new
                        </span>
                    </div>
                </div>
                <div className="divide-y">
                    {messages.map(message => (
                        <div
                            key={message.id}
                            className={`p-4 hover:bg-gray-50 cursor-pointer ${!message.read ? 'bg-purple-50' : ''}`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className={`font-medium ${!message.read ? 'text-purple-700' : ''}`}>{message.title}</h3>
                                    <p className="text-sm text-gray-500">From: {message.sender}</p>
                                </div>
                                <span className="text-xs text-gray-500">{message.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default InboxPage;