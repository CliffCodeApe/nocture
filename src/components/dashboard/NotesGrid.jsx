import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import NotesPage from '../notes/NotesPage';
import NotesModal from '../notes/NotesModal';

const NotesGrid = ({ notes, onNoteSelect, onAddNote }) => {
    const colorVariants = {
        purple: 'bg-purple-800 text-white',
        green: 'bg-green-600 text-white',
        yellow: 'bg-yellow-500 text-white',
        red: 'bg-red-600 text-white',
        blue: 'bg-blue-600 text-white',
        teal: 'bg-teal-600 text-white',
        pink: 'bg-pink-600 text-white'
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Catatan Saya</h2>
                <button
                    onClick={onAddNote}
                    className="text-gray-500 hover:text-gray-800"
                >
                    <Plus size={20} />
                </button>
            </div>

            {notes.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">Belum ada catatan</p>
                    <button
                        onClick={onAddNote}
                        className="mt-4 px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700"
                    >
                        Tambah Catatan Baru
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-3">
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            onClick={() => onNoteSelect(note)}
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
            )}
        </div>
    );
};

export default NotesGrid;