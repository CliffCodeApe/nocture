import React from 'react';
import { MoreHorizontal, Plus, Maximize2 } from 'lucide-react';

const TaskTablePreview = ({ setActiveView }) => {
    const tasks = [
        { id: 1, name: 'Design Project Framework', priority: 'High', dueDate: '27 Mei 2025' },
        { id: 2, name: 'Project Desktop', priority: 'Low', dueDate: '27 Mei 2025' },
        { id: 3, name: 'UI Report Formatter', priority: 'Medium', dueDate: '27 Mei 2025' },
        { id: 4, name: 'Design Project Framework', priority: 'High', dueDate: '27 Mei 2025' },
        { id: 5, name: 'Project Desktop', priority: 'High', dueDate: '27 Mei 2025' },
        { id: 6, name: 'UI Report Formatter', priority: 'Medium', dueDate: '27 Mei 2025' },
    ];

    const priorityColors = {
        'High': 'bg-red-100 text-red-800',
        'Medium': 'bg-yellow-100 text-yellow-800',
        'Low': 'bg-green-100 text-green-800'
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Tugas</h2>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setActiveView('tasks')}
                        className="text-gray-500 hover:text-gray-800"
                        title="View in full page"
                    >
                        <Maximize2 size={18} />
                    </button>
                    <button className="flex items-center text-sm text-gray-600 hover:text-gray-800 bg-purple-100 px-3 py-1 rounded-md">
                        <Plus size={16} className="mr-1" /> Tambah
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs text-gray-500 border-b">
                            <th className="pb-2 w-8">
                                <input type="checkbox" className="form-checkbox" />
                            </th>
                            <th className="pb-2">Nama</th>
                            <th className="pb-2">Prioritas</th>
                            <th className="pb-2">Batas Waktu</th>
                            <th className="pb-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id} className="border-b hover:bg-gray-50">
                                <td className="py-3">
                                    <input type="checkbox" className="form-checkbox" />
                                </td>
                                <td className="font-medium text-gray-800">{task.name}</td>
                                <td>
                                    <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]}`}>
                                        {task.priority === 'High' ? 'Tinggi' :
                                            task.priority === 'Medium' ? 'Sedang' : 'Rendah'}
                                    </span>
                                </td>
                                <td className="text-gray-600">{task.dueDate}</td>
                                <td className="text-right">
                                    <button className="text-gray-500 hover:text-gray-800">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskTablePreview;