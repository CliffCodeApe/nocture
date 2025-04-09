import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const NotesGrid = ({ fullView = false }) => {
    const [notes, setNotes] = useState([
        { id: 1, title: 'Riset Informatika', color: 'purple' },
        { id: 2, title: 'Praktikum Cyber', color: 'green' },
        { id: 3, title: 'UNITY', color: 'yellow' },
        { id: 4, title: 'UNITY', color: 'yellow' },
        { id: 5, title: 'UNITY', color: 'yellow' },
        { id: 6, title: 'UNITY', color: 'yellow' },
        { id: 7, title: 'UNITY', color: 'yellow' },
        { id: 8, title: 'UNITY', color: 'yellow' },
        { id: 9, title: 'Proposal BAB 1 Penelitian', color: 'yellow' }
    ]);

    const colorVariants = {
        purple: 'bg-purple-800 text-white',
        green: 'bg-green-600 text-white',
        yellow: 'bg-yellow-500 text-white'
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    {fullView ? 'All Notes' : 'My Notes'}
                </h2>
                <button className="text-gray-500 hover:text-gray-800">
                    <Plus size={20} />
                </button>
            </div>
            <div className={`grid ${fullView ? 'grid-cols-2 gap-4' : 'grid-cols-2 gap-3'}`}>
                {notes.map((note) => (
                    <div
                        key={note.id}
                        className={`
                            ${colorVariants[note.color]} 
                            rounded-lg p-3 
                            flex items-center justify-between
                            hover:opacity-90 cursor-pointer
                            transition-all duration-200
                        `}
                    >
                        <span className="font-medium text-sm truncate">{note.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotesGrid;