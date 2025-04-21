import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { MoreHorizontal, Plus, Maximize2 } from 'lucide-react';

// Helper function to get priority display (copied from TaskPage)
const getPriorityBadge = (priority) => {
    switch (priority) {
         case 'High': return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Tinggi</span>;
         case 'Medium': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Sedang</span>;
         case 'Low': return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Rendah</span>;
         default: return <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium">{priority}</span>;
     }
 };

// Terima prop baru: onAddTaskRequest
const TaskTablePreview = ({ setActiveView, onAddTaskRequest }) => {
    // State for tasks, loading, and error
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch tasks from backend when component mounts
    useEffect(() => {
        const fetchPreviewTasks = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedTasks = await invoke('fetch_tasks');
                const incompleteTasks = fetchedTasks
                    .filter(task => !task.completed)
                    .slice(0, 5); // Show max 5 incomplete tasks
                setTasks(incompleteTasks);
            } catch (err) {
                console.error("Error fetching tasks for preview:", err);
                setError("Gagal memuat preview tugas.");
            } finally {
                setLoading(false);
            }
        };

        fetchPreviewTasks();
        // TODO: Consider adding a mechanism to refresh this preview
        // if tasks are added/updated elsewhere (e.g., via events or prop changes)
    }, []); // Empty dependency array means this runs once on mount

    // Handler for the "Tambah" button click
    const handleOpenAddTaskModal = () => {
        // Call the function passed down from the parent (Dashboard)
        if (onAddTaskRequest) {
            onAddTaskRequest();
        } else {
            console.warn("onAddTaskRequest function not provided to TaskTablePreview");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Tugas Aktif</h2>
                <div className="flex items-center space-x-3">
                    {/* Button to navigate to the full TaskPage */}
                    <button
                        onClick={() => setActiveView('tasks')}
                        className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
                        title="Lihat semua tugas"
                    >
                        <Maximize2 size={18} />
                    </button>
                    {/* Button to add a new task - now calls the handler */}
                    <button
                        onClick={handleOpenAddTaskModal} // Use the updated handler
                        className="flex items-center text-sm text-gray-600 hover:text-gray-800 bg-purple-100 px-3 py-1 rounded-md"
                    >
                        <Plus size={16} className="mr-1" /> Tambah
                    </button>
                </div>
            </div>

            {/* Display loading or error state */}
            {loading && <div className="text-center py-4 text-gray-500">Memuat tugas...</div>}
            {error && <div className="text-center py-4 text-red-600 bg-red-50 p-2 rounded-md">{error}</div>}

            {/* Task Table */}
            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-gray-500 border-b">
                                <th className="pb-2 w-8"></th>
                                <th className="pb-2">Nama</th>
                                <th className="pb-2">Prioritas</th>
                                <th className="pb-2">Batas Waktu</th>
                                <th className="pb-2 text-right"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-6 text-gray-400">
                                        Tidak ada tugas aktif.
                                    </td>
                                </tr>
                            )}
                            {tasks.map((task) => (
                                <tr key={task.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-purple-600 border-gray-300 rounded cursor-not-allowed"
                                            checked={task.completed}
                                            readOnly disabled
                                        />
                                    </td>
                                    <td className={`py-3 font-medium text-gray-800 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                        {task.title}
                                    </td>
                                    <td className="py-3">
                                        {getPriorityBadge(task.priority)}
                                    </td>
                                    <td className={`py-3 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                        {task.deadline ? new Date(task.deadline).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                                    </td>
                                    <td className="py-3 text-right">
                                        <button className="text-gray-400 hover:text-gray-800 cursor-not-allowed">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TaskTablePreview;
