import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Trash2, Plus, X } from 'lucide-react';

// Helper function (copy from ReminderList or define globally/import)
// Formats Date object or ISO string to 'YYYY-MM-DDTHH:MM:SS'
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


const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        category: 'Personal',
        priority: 'Medium',
        deadline: '',
    });
    const [error, setError] = useState(null); // State for displaying errors

    const fetchAndSetTasks = async () => {
        setError(null); // Clear previous errors on fetch
        try {
            const fetchedTasks = await invoke('fetch_tasks');
            setTasks(fetchedTasks);
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setError("Gagal mengambil data tugas.");
        }
    };

    useEffect(() => {
        fetchAndSetTasks();
    }, []);

    const handleDeleteTaskClick = async (id) => {
        setError(null);
        try {
            await invoke('delete_task', { id });
            // Update local state immediately
            setTasks(currentTasks => currentTasks.filter(task => task.id !== id));
        } catch (err) {
            console.error("Error deleting task:", err);
            setError("Gagal menghapus tugas.");
        }
    };

    const handleToggleComplete = async (taskToToggle) => {
        setError(null); // Clear previous errors

        // --- PERBAIKAN DIMULAI ---
        // Explicitly construct payload, format ALL dates to simple 'YYYY-MM-DDTHH:MM:SS'
        const updatedTaskData = {
            id: taskToToggle.id,
            title: taskToToggle.title,
            category: taskToToggle.category,
            priority: taskToToggle.priority,
            // Format dates to 'YYYY-MM-DDTHH:MM:SS'
            deadline: formatDateToSimpleISO(taskToToggle.deadline),
            completed: !taskToToggle.completed, // Toggle the status
            created_at: formatDateToSimpleISO(taskToToggle.created_at), // Format existing
            updated_at: formatDateToSimpleISO(new Date()), // Format current time
        };
        // --- PERBAIKAN SELESAI ---

        try {
            console.log("Sending update payload (TaskPage):", updatedTaskData); // Debug log
            await invoke('update_task', { task: updatedTaskData });
            // Update local state to reflect the change immediately
            setTasks(currentTasks => currentTasks.map(task =>
                task.id === updatedTaskData.id ? updatedTaskData : task
            ));
        } catch (err) {
            console.error("Error updating task (TaskPage):", err);
             // Optional: Revert UI change on error
             // setTasks(currentTasks => currentTasks.map(task =>
             //     task.id === taskToToggle.id ? taskToToggle : task
             // ));
            setError(`Gagal memperbarui tugas. Error: ${typeof err === 'string' ? err : 'Lihat konsol.'}`);
        }
    };

    // --- Implementasi Fungsi Tambah Task ---
    const handleOpenModal = () => {
        setNewTask({ title: '', category: 'Personal', priority: 'Medium', deadline: '' });
        setError(null); // Clear error when opening modal
        setIsModalOpen(true);
    };

     const handleCloseTaskModal = () => setIsModalOpen(false); // Function to close modal

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setError(null);
        const payload = {
            title: newTask.title,
            category: newTask.category,
            priority: newTask.priority,
            deadline: newTask.deadline || null,
        };
        if (!payload.title) {
             setError("Judul tidak boleh kosong"); // Show error to user
             return;
        }
        try {
            await invoke('create_task', { payload });
            setIsModalOpen(false);
            fetchAndSetTasks(); // Refresh task list
        } catch (err) {
            console.error("Error creating task:", err);
            setError(`Gagal menambahkan tugas. Error: ${typeof err === 'string' ? err : 'Lihat konsol.'}`);
        }
    };
    // --- Akhir Implementasi Fungsi Tambah ---


    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Study': return <span className="text-gray-700">📚</span>;
            case 'Work': return <span className="text-gray-700">💼</span>;
            case 'Personal': return <span className="text-gray-700">👤</span>;
            default: return null;
        }
    };

     const getPriorityBadge = (priority) => {
       switch (priority) {
            case 'High': return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Tinggi</span>;
            case 'Medium': return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Sedang</span>;
            case 'Low': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Rendah</span>;
            default: return <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium">{priority}</span>;
        }
    };


    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Tugas</h1>
                <button
                    onClick={handleOpenModal}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                    <Plus size={20} className="mr-2" /> Tambah
                </button>
            </div>

            {/* Display error messages */}
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

            {/* Tabel Task */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                 {/* Header Tabel */}
                 <div className="grid grid-cols-12 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
                    <div className="col-span-1"></div> {/* Checkbox column */}
                    <div className="col-span-4">Nama</div>
                    <div className="col-span-2">Prioritas</div>
                    <div className="col-span-2">Batas Waktu</div>
                    <div className="col-span-2">Kategori</div>
                    <div className="col-span-1"></div> {/* Actions column */}
                </div>
                {/* Body Tabel */}
                <div className="divide-y divide-gray-200">
                    {tasks.length === 0 && (
                         <div className="text-center py-10 text-gray-500">Memuat tugas atau belum ada tugas...</div>
                    )}
                    {tasks.map(task => (
                        <div key={task.id} className="grid grid-cols-12 px-6 py-4 hover:bg-gray-50 items-center">
                            {/* Checkbox Column */}
                            <div className="col-span-1">
                                <input
                                    type="checkbox"
                                    className={`form-checkbox h-5 w-5 rounded border-gray-300 cursor-pointer ${task.completed ? 'text-purple-600' : 'text-gray-400'} focus:ring-purple-500 focus:ring-opacity-50 focus:ring-offset-0`}
                                    checked={task.completed}
                                    onChange={() => handleToggleComplete(task)} // Attach the handler here
                                    aria-label={`Tandai ${task.title} sebagai ${task.completed ? 'belum selesai' : 'selesai'}`}
                                />
                            </div>
                            {/* Task Title */}
                            <div className={`col-span-4 font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.title}</div>
                            {/* Priority */}
                            <div className="col-span-2">
                                {getPriorityBadge(task.priority)}
                            </div>
                            {/* Deadline */}
                            <div className={`col-span-2 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                {/* Format deadline date for display */}
                                {task.deadline ? new Date(task.deadline).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                            </div>
                            {/* Category */}
                            <div className="col-span-2 flex items-center space-x-2">
                                {getCategoryIcon(task.category)}
                                <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.category}</span>
                            </div>
                            {/* Actions (Delete) */}
                            <div className="col-span-1 text-right">
                                <button
                                    onClick={() => handleDeleteTaskClick(task.id)}
                                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-100"
                                    aria-label={`Hapus tugas ${task.title}`}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

             {/* Modal Tambah Task */}
             {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Tambah Tugas Baru</h2>
                            <button onClick={handleCloseTaskModal} className="text-gray-500 hover:text-gray-800">
                                <X size={24} />
                            </button>
                        </div>
                        {/* Display modal-specific errors */}
                        {/* {modalError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{modalError}</div>} */}
                        <form onSubmit={handleCreateTask}>
                            {/* Form fields remain the same */}
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                                <input type="text" id="title" name="title" value={newTask.title} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" required />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select id="category" name="category" value={newTask.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                                    <option value="Personal">Personal</option>
                                    <option value="Work">Work</option>
                                    <option value="Study">Study</option>
                                </select>
                            </div>
                             <div className="mb-4">
                                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
                                <select id="priority" name="priority" value={newTask.priority} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                             <div className="mb-4">
                                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">Batas Waktu (Opsional)</label>
                                <input type="date" id="deadline" name="deadline" value={newTask.deadline} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
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

export default TaskPage;
