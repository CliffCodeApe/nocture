import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { invoke } from '@tauri-apps/api/core';
import { X } from 'lucide-react';
import CalendarView from '../dashboard/CalendarView';

const formatDateForInput = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return ''; 
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Helper function to format date to YYYY-MM-DD key (for marking dates/lookup)
const formatDateToKey = (date) => {
    if (!date) return null;
    try {
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return null;
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (e) {
        console.error("Error formatting date to key:", date, e);
        return null;
    }
};

// Helper function to format Date object or ISO string to 'YYYY-MM-DDTHH:MM:SS'
const formatDateToSimpleISO = (dateInput) => {
    if (!dateInput) return null;
    let date;
    try {
        date = new Date(dateInput);
         if (isNaN(date.getTime())) {
             console.warn("Could not parse date string for backend:", dateInput);
             return null;
         }
    } catch (e) {
        console.error("Error parsing date string:", dateInput, e);
        return null;
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};


const CalendarPage = () => {
    const [tasksForCalendar, setTasksForCalendar] = useState(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalError, setModalError] = useState(null);

    // --- Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [editingTask, setEditingTask] = useState(null); // Stores the original task being edited
    // State for the form fields (used for both add and edit)
    const [formState, setFormState] = useState({
        id: null, // Store ID for updates
        title: '',
        category: 'Personal',
        priority: 'Medium',
        deadline: '',
    });

    // --- Data Fetching ---
    const fetchAndProcessTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedTasks = await invoke('fetch_tasks');
            const tasksMap = new Map();
            fetchedTasks.forEach(task => {
                if (task.deadline) {
                    const dateKey = formatDateToKey(task.deadline);
                    if (dateKey) {
                         if (!tasksMap.has(dateKey)) {
                            tasksMap.set(dateKey, []);
                        }
                        tasksMap.get(dateKey).push(task);
                    }
                }
            });
            setTasksForCalendar(tasksMap);
        } catch (err) {
            console.error("Error fetching or processing tasks for calendar:", err);
            setError("Gagal memuat data kalender.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAndProcessTasks();
    }, []);

    // --- Modal Handling ---
    const openTaskModal = (mode = 'add', data = null) => {
        setModalMode(mode);
        setModalError(null);
        if (mode === 'edit' && data) {
            // Editing an existing task
            setEditingTask(data); // Store original task data (including id, created_at)
            setFormState({ // Pre-fill form state
                id: data.id,
                title: data.title || '',
                category: data.category || 'Personal',
                priority: data.priority || 'Medium',
                deadline: formatDateForInput(data.deadline), // Format for input
            });
        } else {
            // Adding a new task
            setEditingTask(null);
            setFormState({ // Reset form state
                id: null,
                title: '',
                category: 'Personal',
                priority: 'Medium',
                // Pre-fill deadline if data is a Date object (from calendar click)
                deadline: (data instanceof Date) ? formatDateForInput(data) : '',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseTaskModal = () => {
        setIsModalOpen(false);
        setEditingTask(null); // Clear editing task on close
        setModalError(null);
        // Reset form state might be needed depending on desired behavior
        setFormState({ id: null, title: '', category: 'Personal', priority: 'Medium', deadline: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    // Handles saving (create or update)
    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        setModalError(null);

        if (!formState.title) {
             setModalError("Judul tidak boleh kosong");
             return;
        }

        if (modalMode === 'edit' && editingTask) {
            // --- Update Task Logic ---
            const payload = {
                // Include all fields from the original task, updated with form state
                ...editingTask, // Start with original task data (includes created_at, completed status)
                id: editingTask.id, // Ensure ID is correct
                title: formState.title,
                category: formState.category,
                priority: formState.priority,
                // Format deadline and updated_at for the backend command
                deadline: formatDateToSimpleISO(formState.deadline), // Format date from input
                updated_at: formatDateToSimpleISO(new Date()), // Set new updated_at
                 // Make sure 'completed' status is preserved from original editingTask
                 // completed: editingTask.completed // Already included via spread
                 // Make sure 'created_at' is preserved and formatted correctly
                 created_at: formatDateToSimpleISO(editingTask.created_at)
            };
             // Remove potentially incompatible fields if they exist in editingTask but not Task struct
             // delete payload.originalTask; // Example if such a field existed

            try {
                console.log("Sending Update Payload:", payload);
                await invoke('update_task', { task: payload });
                handleCloseTaskModal();
                fetchAndProcessTasks(); // Refresh data
            } catch (err) {
                console.error("Error updating task:", err);
                const errorMsg = typeof err === 'string' ? err : "Gagal memperbarui tugas.";
                setModalError(errorMsg);
            }

        } else {
            // --- Create Task Logic ---
            const payload = {
                title: formState.title,
                category: formState.category,
                priority: formState.priority,
                deadline: formState.deadline || null, // Send date string YYYY-MM-DD or null
            };
            try {
                console.log("Sending Create Payload:", payload);
                await invoke('create_task', { payload });
                handleCloseTaskModal();
                fetchAndProcessTasks(); // Refresh data
            } catch (err) {
                console.error("Error creating task:", err);
                const errorMsg = typeof err === 'string' ? err : "Gagal menambahkan tugas.";
                setModalError(errorMsg);
            }
        }
    };

    // --- Calendar Interaction ---
    const handleDateClick = (date) => {
        const dateKey = formatDateToKey(date);
        const tasksOnDate = tasksForCalendar.get(dateKey);

        if (tasksOnDate && tasksOnDate.length > 0) {
            // Tasks exist: open modal in 'edit' mode with the first task
            // Note: This assumes we edit the *first* task found on that date.
            // A more complex UI would be needed to choose which task to edit if multiple exist.
            openTaskModal('edit', tasksOnDate[0]);
        } else {
            // No tasks: open modal in 'add' mode with pre-filled deadline
            openTaskModal('add', date); // Pass Date object
        }
    };

    // --- Rendering ---
    return (
        <motion.div
            className="p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <h1 className="text-2xl font-bold mb-6">Kalender</h1>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center text-gray-500">Memuat kalender...</div>
                ) : (
                    <CalendarView
                        tasksByDate={tasksForCalendar}
                        onDateClick={handleDateClick}
                        fullView={true}
                    />
                )}
                <div className="p-4 bg-gray-50 border-t flex justify-end">
                    <button
                        onClick={() => openTaskModal('add')} // Open modal in 'add' mode without pre-filled date
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                    >
                        Tambah Tugas Baru
                    </button>
                </div>
            </div>

            {/* Unified Add/Edit Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md scale-100 transition-transform duration-300">
                        <div className="flex justify-between items-center mb-4">
                            {/* Dynamic Modal Title */}
                            <h2 className="text-xl font-bold text-gray-800">
                                {modalMode === 'edit' ? 'Edit Tugas' : 'Tambah Tugas Baru'}
                            </h2>
                            <button onClick={handleCloseTaskModal} className="text-gray-500 hover:text-gray-800">
                                <X size={24} />
                            </button>
                        </div>
                        {modalError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{modalError}</div>}
                        {/* Form uses handleTaskSubmit */}
                        <form onSubmit={handleTaskSubmit}>
                            {/* Title Input - uses formState */}
                            <div className="mb-4">
                                <label htmlFor="modal-title" className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                                <input
                                    type="text" id="modal-title" name="title"
                                    value={formState.title} onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    required autoFocus
                                />
                            </div>
                            {/* Category Select - uses formState */}
                            <div className="mb-4">
                                <label htmlFor="modal-category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select
                                    id="modal-category" name="category"
                                    value={formState.category} onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="Personal">Personal</option>
                                    <option value="Work">Work</option>
                                    <option value="Study">Study</option>
                                </select>
                            </div>
                            {/* Priority Select - uses formState */}
                             <div className="mb-4">
                                <label htmlFor="modal-priority" className="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
                                <select
                                    id="modal-priority" name="priority"
                                    value={formState.priority} onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            {/* Deadline Input - uses formState */}
                             <div className="mb-4">
                                <label htmlFor="modal-deadline" className="block text-sm font-medium text-gray-700 mb-1">Batas Waktu (Opsional)</label>
                                <input
                                    type="date" id="modal-deadline" name="deadline"
                                    value={formState.deadline} onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={handleCloseTaskModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                                    Batal
                                </button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                                    {/* Dynamic Button Text */}
                                    {modalMode === 'edit' ? 'Update Tugas' : 'Simpan Tugas'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default CalendarPage;
