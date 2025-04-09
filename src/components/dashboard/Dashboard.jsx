import React, { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import Sidebar from './Sidebar';
import TaskPage from '../task-management/TaskPage';
import TaskTablePreview from '../task-management/TaskTablePreview';
import NotesGrid from './NotesGrid';
import CalendarView from './CalendarView';
import ReminderList from './ReminderList';

const Dashboard = () => {
    const [activeView, setActiveView] = useState('dashboard');

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <div className="p-6 space-y-6">
                        <h1 className="text-3xl font-bold text-gray-800">Halo! Siap untuk produktif?</h1>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <TaskTablePreview setActiveView={setActiveView} />
                            </div>
                            <div>
                                <ReminderList />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div>
                                <NotesGrid />
                            </div>
                            <div className="lg:col-span-2">
                                <CalendarView />
                            </div>
                        </div>
                    </div>
                );
            case 'tasks':
                return <TaskPage />;
            case 'notes':
                return <NotesGrid fullView />;
            case 'calendar':
                return <CalendarView fullView />;
            case 'pomodoro':
                return <div className="p-6"><h1 className="text-2xl font-bold">Pomodoro Timer</h1></div>;
            case 'inbox':
                return <div className="p-6"><h1 className="text-2xl font-bold">Inbox</h1></div>;
            case 'notifications':
                return <div className="p-6"><h1 className="text-2xl font-bold">Notifikasi</h1></div>;
            case 'trash':
                return <div className="p-6"><h1 className="text-2xl font-bold">Sampah</h1></div>;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default Dashboard;