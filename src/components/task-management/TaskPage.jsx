import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

const TaskPage = () => {
    const [tasks, setTasks] = useState([
        { id: 1, name: 'Project Framework', priority: 'High', dueDate: '27 May 2025', category: 'Studi', completed: false },
        { id: 2, name: 'Project Framework', priority: 'High', dueDate: '27 May 2025', category: 'Studi', completed: false },
        { id: 3, name: 'Project Framework', priority: 'High', dueDate: '27 May 2025', category: 'Kerja', completed: false },
        { id: 4, name: 'Project Framework', priority: 'High', dueDate: '27 May 2025', category: 'Pribadi', completed: false },
        { id: 5, name: 'Project Framework', priority: 'High', dueDate: '27 May 2025', category: 'Studi', completed: false },
        { id: 6, name: 'Project Framework', priority: 'High', dueDate: '27 May 2025', category: 'Kerja', completed: false },
        { id: 7, name: 'Project Framework', priority: 'High', dueDate: '27 May 2025', category: 'Pribadi', completed: false },
        { id: 8, name: 'Project Framework', priority: 'High', dueDate: '27 May 2025', category: 'Kerja', completed: false },
        { id: 9, name: 'Project Framework', priority: 'High', dueDate: '27 May 2025', category: 'Studi', completed: false },
        { id: 10, name: 'Project Framework', priority: 'High', dueDate: '27 May 2025', category: 'Kerja', completed: false },
        { id: 11, name: 'Project Framework', priority: 'High', dueDate: '27 May 2025', category: 'Pribadi', completed: true },
        { id: 12, name: 'Project Framework', priority: 'High', dueDate: '27 May 2025', category: 'Pribadi', completed: true },
        { id: 13, name: 'Project Framework', priority: 'High', dueDate: '27 May 2025', category: 'Pribadi', completed: true },
        { id: 14, name: 'Project Framework', priority: 'High', dueDate: '27 May 2025', category: 'Pribadi', completed: false },
        { id: 15, name: 'Project Framework', priority: 'High', dueDate: '27 May 2025', category: 'Pribadi', completed: false },
    ]);

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Studi':
                return <span className="text-gray-700">📚</span>;
            case 'Kerja':
                return <span className="text-gray-700">💼</span>;
            case 'Pribadi':
                return <span className="text-gray-700">👤</span>;
            default:
                return null;
        }
    };

    const toggleTaskCompletion = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Tugas</h1>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center">
                    <Plus size={20} className="mr-2" /> Tambah
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="grid grid-cols-12 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
                    <div className="col-span-1">
                        <input type="checkbox" className="form-checkbox" />
                    </div>
                    <div className="col-span-4">Nama</div>
                    <div className="col-span-2 flex items-center">
                        <span>Prioritas</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <span>Batas Waktu</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <span>Kategori</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                    </div>
                    <div className="col-span-1"></div>
                </div>

                <div className="divide-y divide-gray-200">
                    {tasks.map(task => (
                        <div key={task.id} className="grid grid-cols-12 px-6 py-4 hover:bg-gray-50 items-center">
                            <div className="col-span-1">
                                <input
                                    type="checkbox"
                                    className={`form-checkbox h-5 w-5 ${task.completed ? 'text-purple-600' : 'text-gray-300'}`}
                                    checked={task.completed}
                                    onChange={() => toggleTaskCompletion(task.id)}
                                />
                            </div>
                            <div className="col-span-4 font-medium text-gray-800">{task.name}</div>
                            <div className="col-span-2">
                                <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm">
                                    Tinggi
                                </span>
                            </div>
                            <div className="col-span-2 text-gray-600">{task.dueDate}</div>
                            <div className="col-span-2 flex items-center space-x-2">
                                {getCategoryIcon(task.category)}
                                <span className="text-gray-700">{task.category}</span>
                            </div>
                            <div className="col-span-1 text-right">
                                <button className="text-gray-400 hover:text-red-500">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskPage;