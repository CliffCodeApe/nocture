import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import NotesPage from '../notes/NotesPage';
import NotesModal from '../notes/NotesModal';

const NotesGrid = ({ fullView = false, pinnedNotesOnly = false }) => {
    const [notes, setNotes] = useState([
        { id: 1, title: 'Riset Informatika', content: 'Lorem ipsum is a placeholder text commonly used in the design industry to fill spaces with content resembling real written text. Despite its nonsensical nature, lorem ipsum has been a staple in the creative process for centuries, allowing designers to focus on layout and design without the distraction of meaningful text.', color: 'purple', isPinned: true },
        { id: 2, title: 'Praktikum Cyber', content: 'Notes tentang keamanan siber dan praktikumnya', color: 'green', isPinned: true },
        { id: 3, title: 'UNITY', content: 'Unity game development notes', color: 'yellow', isPinned: true },
        { id: 4, title: 'Machine Learning', content: 'Notes tentang machine learning project', color: 'blue', isPinned: false },
        { id: 5, title: 'UI/UX Design', content: 'Design principles and patterns', color: 'pink', isPinned: false },
        { id: 6, title: 'Mobile Development', content: 'React Native vs Flutter', color: 'teal', isPinned: false },
        { id: 7, title: 'Database Systems', content: 'SQL vs NoSQL comparison', color: 'red', isPinned: false },
        { id: 8, title: 'Web Security', content: 'Common vulnerabilities and protections', color: 'blue', isPinned: false },
        { id: 9, title: 'Proposal BAB 1 Penelitian', content: 'Draft proposal penelitian', color: 'yellow', isPinned: false }
    ]);

    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const colorVariants = {
        purple: 'bg-purple-800 text-white',
        green: 'bg-green-600 text-white',
        yellow: 'bg-yellow-500 text-white',
        red: 'bg-red-600 text-white',
        blue: 'bg-blue-600 text-white',
        teal: 'bg-teal-600 text-white',
        pink: 'bg-pink-600 text-white'
    };

    const filteredNotes = pinnedNotesOnly
        ? notes.filter(note => note.isPinned)
        : notes;

    const handleUpdateNote = (updatedNote) => {
        setNotes(notes.map(note =>
            note.id === updatedNote.id ? updatedNote : note
        ));
    };

    const handleDeleteNote = (noteId) => {
        setNotes(notes.filter(note => note.id !== noteId));
        setSelectedNoteId(null);
    };

    const handleAddNote = (newNote) => {
        setNotes([newNote, ...notes]);
    };

    // If a note is selected, show the NotesPage
    if (selectedNoteId) {
        const selectedNote = notes.find(note => note.id === selectedNoteId);
        return (
            <NotesPage
                selectedNote={selectedNote}
                onBack={() => setSelectedNoteId(null)}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
            />
        );
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {fullView ? 'Semua Catatan' : 'Catatan Saya'}
                    </h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                {filteredNotes.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">
                            {pinnedNotesOnly
                                ? 'Belum ada catatan yang di-pin'
                                : 'Belum ada catatan'
                            }
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-4 px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700"
                        >
                            Tambah Catatan Baru
                        </button>
                    </div>
                ) : (
                    <div className={`grid ${fullView ? 'grid-cols-3 gap-4' : 'grid-cols-2 gap-3'}`}>
                        {filteredNotes.map((note) => (
                            <div
                                key={note.id}
                                onClick={() => setSelectedNoteId(note.id)}
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

            <NotesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddNote}
            />
        </>
    );
};

export default NotesGrid;