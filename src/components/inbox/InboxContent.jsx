import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar } from 'lucide-react';

const InboxContent = ({ isOpen, onClose }) => {
    // Mock inbox messages that match what's shown in the image
    const messages = [
        {
            id: 1,
            title: 'Design Project Framework',
            date: '25 Maret 2025',
            icon: FileText
        },
        {
            id: 2,
            title: 'Design Project Framework',
            date: '25 Maret 2025',
            icon: FileText
        },
        {
            id: 3,
            title: 'Design Project Framework',
            date: '25 Maret 2025',
            icon: FileText
        },
        {
            id: 4,
            title: 'Design Project Framework',
            date: '25 Maret 2025',
            icon: FileText
        },
    ];

    // Close on Escape key
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                // Removed the semi-transparent overlay
                <motion.div
                    className="fixed top-0 left-64 h-full w-80 bg-purple-700 z-40 overflow-y-auto shadow-lg"
                    initial={{ x: -320, opacity: 0.5 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -320, opacity: 0 }}
                    transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30
                    }}
                >
                    {/* Header - removed the X button */}
                    <div className="flex justify-between items-center p-6 text-white">
                        <h2 className="text-xl font-medium flex items-center gap-2">
                            Inbox
                        </h2>
                    </div>

                    {/* Message list */}
                    <div className="space-y-1">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className="px-6 py-4 hover:bg-purple-600 transition-colors cursor-pointer"
                            >
                                <div className="flex text-white items-start gap-3">
                                    <div className="pt-1">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{message.title}</h3>
                                        <div className="flex items-center gap-1 text-sm text-purple-200 mt-1">
                                            <Calendar size={14} />
                                            <span>{message.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InboxContent;