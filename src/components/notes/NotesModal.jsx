import React, { useState } from 'react';
import { X } from 'lucide-react';

const NotesModal = ({ isOpen, onClose, onSave, activeSidebarView = "dashboard" }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [color, setColor] = useState('purple');
    const [error, setError] = useState('');

    const colorOptions = [
        { name: 'Purple', value: 'purple', class: 'bg-purple-800' },
        { name: 'Green', value: 'green', class: 'bg-green-600' },
        { name: 'Yellow', value: 'yellow', class: 'bg-yellow-500' },
        { name: 'Red', value: 'red', class: 'bg-red-600' },
        { name: 'Blue', value: 'blue', class: 'bg-blue-600' },
        { name: 'Teal', value: 'teal', class: 'bg-teal-600' },
        { name: 'Pink', value: 'pink', class: 'bg-pink-600' }
    ];

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        if (!title.trim()) {
            setError('Judul tidak boleh kosong');
            return;
        }

        const newNote = {
            id: Date.now(), // Temporary ID, should be replaced by backend
            title: title.trim(),
            content: content.trim(),
            color,
            isPinned: false,
            createdAt: new Date().toISOString()
        };

        onSave(newNote);
        reset();
        onClose();
    };

    const reset = () => {
        setTitle('');
        setContent('');
        setColor('purple');
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex ml-64">
            {/* Blurred background - positioned to cover just the content area */}
            <div className="absolute inset-0 bg-transparent  backdrop-brightness-90 z-0"></div>
            {/* Modal content */}
            <div className="relative mx-auto my-auto bg-white rounded-lg shadow-xl max-w-3xl w-full h-5/6 z-10">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Tambah Catatan Baru</h2>
                    <button
                        onClick={() => {
                            reset();
                            onClose();
                        }}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col" style={{ height: "calc(100% - 73px)" }}>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (e.target.value.trim()) setError('');
                            }}
                            placeholder="Judul"
                            className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600`}
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>

                    <div className="mb-4">
                        <div className="flex space-x-2 mb-2">
                            {colorOptions.map((colorOption) => (
                                <button
                                    key={colorOption.value}
                                    type="button"
                                    onClick={() => setColor(colorOption.value)}
                                    className={`${colorOption.class} w-6 h-6 rounded-full hover:opacity-80 ${color === colorOption.value ? 'ring-2 ring-gray-400 ring-offset-2' : ''
                                        }`}
                                    title={colorOption.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 mb-4">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Ketik sesuatu..."
                            className="w-full h-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-2 hover:bg-gray-100"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotesModal;