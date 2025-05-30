import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

const InboxContent = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUpcomingTasks = async () => {
            if (!isOpen) {
                setMessages([]); // Clear messages when not open
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const fetchedTasks = await invoke('fetch_tasks');

                const upcomingTasks = fetchedTasks
                    .filter(task => !task.completed && task.deadline)
                    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                    .slice(0, 10) // Ambil 10 task terdekat
                    .map(task => ({
                        id: task.id,
                        title: task.title,
                        date: new Date(task.deadline).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }),
                        icon: FileText, // Menggunakan ikon yang sudah ada
                        originalDeadline: task.deadline // Simpan deadline asli untuk referensi jika perlu
                    }));
                setMessages(upcomingTasks);
            } catch (err) {
                console.error("Error fetching upcoming tasks for inbox:", err);
                setError("Gagal memuat tugas di inbox.");
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingTasks();
    }, [isOpen]);

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
                    <div className="flex justify-between items-center p-6 text-white">
                        <h2 className="text-xl font-medium flex items-center gap-2">
                            Inbox (Tugas Terdekat)
                        </h2>
                    </div>

                    {loading && (
                        <div className="p-6 text-center text-purple-200">Memuat tugas...</div>
                    )}
                    {error && (
                        <div className="p-6 text-center text-red-300 bg-red-700 bg-opacity-50 rounded-md mx-4">
                            {error}
                        </div>
                    )}

                    {!loading && !error && messages.length === 0 && (
                        <div className="p-6 text-center text-purple-200">
                            Tidak ada tugas dengan tenggat waktu terdekat.
                        </div>
                    )}

                    {!loading && !error && messages.length > 0 && (
                        <div className="space-y-1">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className="px-6 py-4 hover:bg-purple-600 transition-colors cursor-pointer"
                                >
                                    <div className="flex text-white items-start gap-3">
                                        <div className="pt-1">
                                            <message.icon size={20} />
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
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InboxContent;