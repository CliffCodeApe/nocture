import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const NotesPage = () => {
    const { categoryId } = useParams();

    // Map category IDs to names and colors
    const categories = {
        '1': { name: 'Riset Informatika', color: 'bg-purple-700' },
        '2': { name: 'Praktikum Cyber', color: 'bg-green-500' },
        '3': { name: 'UNITY', color: 'bg-yellow-400' }
    };

    // Get current category
    const currentCategory = categories[categoryId] || { name: 'Unknown Category', color: 'bg-gray-400' };

    // Dummy notes
    const notes = [
        { id: 1, title: 'Research Paper Notes', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', date: '25 Mar 2025' },
        { id: 2, title: 'Meeting Notes', content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', date: '26 Mar 2025' },
        { id: 3, title: 'Ideas for Project', content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', date: '27 Mar 2025' },
    ];

    return (
        <motion.div
            className="p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="flex items-center mb-6">
                <div className={`w-4 h-4 rounded-sm ${currentCategory.color} mr-3`}></div>
                <h1 className="text-2xl font-bold">{currentCategory.name} Notes</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map(note => (
                    <div
                        key={note.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <div className={`h-2 ${currentCategory.color}`}></div>
                        <div className="p-4">
                            <h3 className="font-medium mb-2">{note.title}</h3>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{note.content}</p>
                            <div className="text-xs text-gray-500">{note.date}</div>
                        </div>
                    </div>
                ))}

                {/* Add new note card */}
                <div className="bg-white rounded-lg shadow-md border-2 border-dashed border-gray-300 flex items-center justify-center h-48 cursor-pointer hover:border-purple-400 transition-colors">
                    <div className="text-center p-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <p className="text-gray-600">Add New Note</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default NotesPage;