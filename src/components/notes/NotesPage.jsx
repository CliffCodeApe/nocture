import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Pin, PinOff, Palette, ArrowLeft, Check, X } from 'lucide-react';

const NotesPage = ({ note, onBack, onTogglePin, onUpdateNote, onDeleteNote }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [editableNote, setEditableNote] = useState(note || {
        id: null,
        title: '',
        content: '',
        color: 'purple',
        isPinned: false
    });

    useEffect(() => {
        if (note) {
            setEditableNote(note);
        }
    }, [note]);

    const colorOptions = [
        { name: 'Purple', value: 'purple', class: 'bg-purple-800' },
        { name: 'Green', value: 'green', class: 'bg-green-600' },
        { name: 'Yellow', value: 'yellow', class: 'bg-yellow-500' },
        { name: 'Red', value: 'red', class: 'bg-red-600' },
        { name: 'Blue', value: 'blue', class: 'bg-blue-600' },
        { name: 'Teal', value: 'teal', class: 'bg-teal-600' },
        { name: 'Pink', value: 'pink', class: 'bg-pink-600' }
    ];

    const handleSaveNote = () => {
        if (editableNote.title.trim() === '') return;
        onUpdateNote(editableNote);
        setIsEditing(false);
    };

    const handlePinToggle = () => {
        const updatedNote = { ...editableNote, isPinned: !editableNote.isPinned };
        setEditableNote(updatedNote);
        onUpdateNote(updatedNote);
        if (onTogglePin) {
            onTogglePin(updatedNote);
        }
    };

    const handleColorChange = (color) => {
        const updatedNote = { ...editableNote, color };
        setEditableNote(updatedNote);
        onUpdateNote(updatedNote);
        setShowColorPicker(false);
    };

    const getColorClass = () => {
        const colorMap = {
            purple: 'bg-purple-800',
            green: 'bg-green-600',
            yellow: 'bg-yellow-500',
            red: 'bg-red-600',
            blue: 'bg-blue-600',
            teal: 'bg-teal-600',
            pink: 'bg-pink-600'
        };

        return colorMap[editableNote.color] || 'bg-purple-800';
    };

    return (
        <div className="fixed inset-0 z-50 flex ml-64">
            <div className="relative mx-auto my-auto w-full h-full z-10 shadow-lg shadow-gray-300/50">
                {/* Header color bar */}
                <div className={`${getColorClass()} h-52`}></div>

                {/* Title section - Now below the color header, removed border-b */}
                <div className="p-4 pl-28 pt-10">
                    <div className="flex justify-between items-center">
                        <div className="flex-1 overflow-hidden pr-8">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editableNote.title}
                                    onChange={(e) => setEditableNote({ ...editableNote, title: e.target.value })}
                                    className="w-full text-4xl font-bold focus:outline-none"
                                    placeholder="Judul catatan"
                                    autoFocus
                                />
                            ) : (
                                <h1 className="text-4xl font-bold text-gray-800 break-words">{editableNote.title}</h1>
                            )}
                        </div>

                        <div className="flex space-x-2">
                            {isEditing ? (
                                <button
                                    onClick={handleSaveNote}
                                    className="hover:bg-gray-100 rounded-full p-2"
                                >
                                    <Check size={20} className="text-green-600" />
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handlePinToggle}
                                        className="hover:bg-gray-100 rounded-full p-2"
                                        title={editableNote.isPinned ? "Unpin from Quick Access" : "Pin to Quick Access"}
                                    >
                                        {editableNote.isPinned ?
                                            <PinOff size={20} className="text-gray-700" /> :
                                            <Pin size={20} className="text-gray-700" />
                                        }
                                    </button>

                                    <div className="relative">
                                        <button
                                            onClick={() => setShowColorPicker(!showColorPicker)}
                                            className="hover:bg-gray-100 rounded-full p-2"
                                            title="Change note color"
                                        >
                                            <Palette size={20} className="text-gray-700" />
                                        </button>

                                        {showColorPicker && (
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg p-3 z-10">
                                                <h4 className="text-gray-800 font-medium mb-2 text-sm">Choose color</h4>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {colorOptions.map((color) => (
                                                        <button
                                                            key={color.value}
                                                            onClick={() => handleColorChange(color.value)}
                                                            className={`${color.class} w-8 h-8 rounded-full hover:opacity-80 ${editableNote.color === color.value ? 'ring-2 ring-gray-400 ring-offset-2' : ''
                                                                }`}
                                                            title={color.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="hover:bg-gray-100 rounded-full p-2"
                                        title="Edit note"
                                    >
                                        <Pencil size={20} className="text-gray-700" />
                                    </button>

                                    <button
                                        onClick={() => onDeleteNote(editableNote.id)}
                                        className="hover:bg-gray-100 rounded-full p-2"
                                        title="Delete note"
                                    >
                                        <Trash2 size={20} className="text-gray-700" />
                                    </button>
                                </>
                            )}

                            <button
                                onClick={onBack}
                                className="hover:bg-gray-100 rounded-full p-2 ml-2"
                                title="Close"
                            >
                                <X size={20} className="text-gray-700" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 pl-28 overflow-y-auto text-base" style={{ height: "calc(100% - 150px)" }}>
                    {isEditing ? (
                        <textarea
                            value={editableNote.content}
                            onChange={(e) => setEditableNote({ ...editableNote, content: e.target.value })}
                            className="w-full h-full resize-none border-none focus:outline-none text-base"
                            placeholder="Ketik sesuatu..."
                        />
                    ) : (
                        <div className="prose max-w-none text-base">
                            {editableNote.content || (
                                <p className="text-gray-400 italic">
                                    Catatan ini masih kosong. Klik ikon pensil untuk mengedit.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotesPage;