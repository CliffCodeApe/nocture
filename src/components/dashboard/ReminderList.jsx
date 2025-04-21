import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Plus, Check, Circle, X } from 'lucide-react';

// Helper function to format Date object or ISO string to 'YYYY-MM-DDTHH:MM:SS'
const formatDateToSimpleISO = (dateInput) => {
    if (!dateInput) return null;

    let date;
    try {
        // Attempt to create a Date object from various possible ISO-like formats
        date = new Date(dateInput);
         if (isNaN(date.getTime())) { // Check if parsing failed
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

    // Return in YYYY-MM-DDTHH:MM:SS format
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};


const ReminderList = ({ fullView = false }) => {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalError, setModalError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        category: 'Personal',
        priority: 'Medium',
        deadline: '',
    });

    // Simplified date parsing for category check
    const getRelativeTimeCategory = (deadline) => {
        if (!deadline) return null;
        try {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const deadlineDate = new Date(deadline);
            if (isNaN(deadlineDate.getTime())) return null;

            const deadlineStartOfDay = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());

            if (deadlineStartOfDay < today) return "Sudah Lewat";
            if (deadlineStartOfDay.getTime() === today.getTime()) return "Hari Ini";
            if (deadlineStartOfDay.getTime() === tomorrow.getTime()) return "Besok";
            return "Yang Akan Datang";

        } catch (e) {
            console.error("Error in getRelativeTimeCategory:", deadline, e);
            return null;
        }
    };


    const fetchAndProcessTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedTasks = await invoke('fetch_tasks');
            const processedReminders = fetchedTasks
                .map(task => {
                    const timeCategory = getRelativeTimeCategory(task.deadline);
                    if (!timeCategory || timeCategory === "Sudah Lewat" || task.completed) return null;
                    return {
                        id: task.id,
                        title: task.title,
                        time: timeCategory,
                        completed: task.completed,
                        originalTask: task
                    };
                })
                .filter(reminder => reminder !== null);
            setReminders(processedReminders);
        } catch (err) {
            console.error("Error fetching tasks for reminders:", err);
            setError("Gagal memuat pengingat.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAndProcessTasks();
    }, []);

    const handleToggleComplete = async (reminderId) => {
        setError(null);
        const reminderToToggle = reminders.find(r => r.id === reminderId);
        if (!reminderToToggle || !reminderToToggle.originalTask) return;

        const originalTask = reminderToToggle.originalTask;

        // --- PERBAIKAN DIMULAI ---
        // Explicitly construct payload, format ALL dates to simple 'YYYY-MM-DDTHH:MM:SS'
        const updatedTaskData = {
            id: originalTask.id,
            title: originalTask.title,
            category: originalTask.category,
            priority: originalTask.priority,
            // Format dates to 'YYYY-MM-DDTHH:MM:SS'
            deadline: formatDateToSimpleISO(originalTask.deadline),
            completed: !originalTask.completed,
            created_at: formatDateToSimpleISO(originalTask.created_at), // Format existing
            updated_at: formatDateToSimpleISO(new Date()), // Format current time
        };
        // --- PERBAIKAN SELESAI ---


        try {
            console.log("Sending update payload:", updatedTaskData);
            await invoke('update_task', { task: updatedTaskData });
            setReminders(currentReminders => currentReminders.filter(r => r.id !== reminderId));
        } catch (err) {
            console.error("Error updating task completion (ReminderList):", err);
            const errorMessage = typeof err === 'string' ? err : "Terjadi kesalahan saat memperbarui tugas.";
            setError(`Gagal memperbarui status tugas. Error: ${errorMessage}`);
        }
    };


    // Modal Functions (remain the same)
    const handleOpenModal = () => {
        setNewTask({ title: '', category: 'Personal', priority: 'Medium', deadline: '' });
        setModalError(null);
        setIsModalOpen(true);
    };
    const handleCloseTaskModal = () => setIsModalOpen(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prev => ({ ...prev, [name]: value }));
    };
    const handleCreateTask = async (e) => {
        e.preventDefault();
        setModalError(null);
        const payload = {
            title: newTask.title,
            category: newTask.category,
            priority: newTask.priority,
            deadline: newTask.deadline || null, // Send YYYY-MM-DD or null
        };
        if (!payload.title) {
             setModalError("Judul tidak boleh kosong");
             return;
        }
        try {
            await invoke('create_task', { payload });
            setIsModalOpen(false);
            fetchAndProcessTasks();
        } catch (err) {
            console.error("Error creating task from reminder list:", err);
            setModalError(typeof err === 'string' ? err : "Gagal menambahkan tugas.");
        }
    };

    // Group reminders by time category for rendering
    const remindersByTime = reminders.reduce((acc, reminder) => {
        if (!acc[reminder.time]) acc[reminder.time] = [];
        acc[reminder.time].push(reminder);
        return acc;
    }, {});

    const timeOrder = ["Hari Ini", "Besok", "Yang Akan Datang"];
    const timeColorMap = {
        'Hari Ini': 'text-red-500',
        'Besok': 'text-yellow-500',
        'Yang Akan Datang': 'text-green-500'
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    {fullView ? 'All Reminders' : 'Pengingat'}
                </h2>
                <button onClick={handleOpenModal} className="text-gray-500 hover:text-gray-800">
                    <Plus size={20} />
                </button>
            </div>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

            {loading ? (
                <div className="text-center py-5 text-gray-500">Memuat pengingat...</div>
            ) : (
                <div className="space-y-5">
                    {reminders.length === 0 && !loading && (
                        <div className="text-center py-5 text-gray-400 text-sm">Tidak ada pengingat aktif.</div>
                    )}
                    {timeOrder.map(time => (
                        remindersByTime[time] && remindersByTime[time].length > 0 && (
                            <div key={time} className="space-y-2">
                                <h3 className={`text-sm font-medium ${timeColorMap[time] || 'text-gray-500'}`}>
                                    {time} ({remindersByTime[time].length})
                                </h3>
                                {remindersByTime[time].map((reminder) => (
                                    <div
                                        key={reminder.id}
                                        className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => handleToggleComplete(reminder.id)}
                                                className={`flex-shrink-0 border-2 border-purple-300 hover:border-purple-500 w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-150`}
                                                aria-label={`Tandai ${reminder.title} sebagai selesai`}
                                            />
                                            <div className="flex-grow min-w-0">
                                                <p className={`text-sm font-medium truncate text-gray-800`}>
                                                    {reminder.title}
                                                </p>
                                            </div>
                                        </div>
                                        <Circle size={8} className="text-purple-500 flex-shrink-0 ml-2" />
                                    </div>
                                ))}
                            </div>
                        )
                    ))}
                </div>
            )}

            {/* Modal Tambah Task */}
            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md scale-100 transition-transform duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Tambah Tugas Baru</h2>
                            <button onClick={handleCloseTaskModal} className="text-gray-500 hover:text-gray-800">
                                <X size={24} />
                            </button>
                        </div>
                        {modalError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{modalError}</div>}
                        <form onSubmit={handleCreateTask}>
                            {/* Form fields remain the same */}
                            <div className="mb-4">
                                <label htmlFor="reminder-modal-title" className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                                <input type="text" id="reminder-modal-title" name="title" value={newTask.title} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" required autoFocus />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="reminder-modal-category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select id="reminder-modal-category" name="category" value={newTask.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                                    <option value="Personal">Personal</option>
                                    <option value="Work">Work</option>
                                    <option value="Study">Study</option>
                                </select>
                            </div>
                             <div className="mb-4">
                                <label htmlFor="reminder-modal-priority" className="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
                                <select id="reminder-modal-priority" name="priority" value={newTask.priority} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                             <div className="mb-4">
                                <label htmlFor="reminder-modal-deadline" className="block text-sm font-medium text-gray-700 mb-1">Batas Waktu (Opsional)</label>
                                <input type="date" id="reminder-modal-deadline" name="deadline" value={newTask.deadline} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={handleCloseTaskModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"> Batal </button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"> Simpan Tugas </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReminderList;
