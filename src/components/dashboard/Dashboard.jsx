import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import Sidebar from './Sidebar';
import TaskPage from '../task-management/TaskPage';
import TaskTablePreview from '../task-management/TaskTablePreview';
import NotesGrid from './NotesGrid';
import CalendarView from './CalendarView';
import CalendarPage from '../calendar/CalendarPage';
import ReminderList from './ReminderList';
import InboxContent from '../inbox/InboxContent';
import TimerPage from '../timer/TimerPage'; // Import the new TimerPage component

// Helper function to format date to YYYY-MM-DD key (for marking dates)
const formatDateToKey = (date) => {
    if (!date) return null;
    try {
        const d = new Date(date);
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

// Helper function to format Date object to YYYY-MM-DD string (for input[type=date])
const formatDateForInput = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Dashboard = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [dashboardTasksByDate, setDashboardTasksByDate] = useState(new Map());
    const [loadingCalendar, setLoadingCalendar] = useState(true);
    const [errorCalendar, setErrorCalendar] = useState(null);

    // State for the inbox panel
    const [isInboxOpen, setIsInboxOpen] = useState(false);

    // State for managing the shared Add/Edit Task Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [taskToEdit, setTaskToEdit] = useState(null); // Task data for editing
    const [modalInitialData, setModalInitialData] = useState(null); // For pre-filling fields like deadline
    const [modalError, setModalError] = useState(null);

    // --- Data Fetching ---
    const fetchDashboardCalendarData = async () => {
        setLoadingCalendar(true);
        setErrorCalendar(null);
        try {
            const fetchedTasks = await invoke('fetch_tasks');
            const tasksMap = new Map();
            fetchedTasks.forEach(task => {
                if (task.deadline) {
                    const dateKey = formatDateToKey(task.deadline);
                    if (dateKey && !tasksMap.has(dateKey)) {
                        tasksMap.set(dateKey, [true]); // Mark date as having tasks
                    }
                }
            });
            setDashboardTasksByDate(tasksMap);
        } catch (err) {
            console.error("Error fetching tasks for dashboard calendar:", err);
            setErrorCalendar("Gagal memuat data kalender.");
        } finally {
            setLoadingCalendar(false);
        }
    };

    // Fetch calendar data on mount
    useEffect(() => {
        fetchDashboardCalendarData();
    }, []);

    // --- View & Inbox Handling ---
    const handleViewChange = (view) => {
        // Special handling for inbox
        if (view === 'inbox') {
            setIsInboxOpen(true);
            setActiveView('inbox'); // Set active view to inbox so it's highlighted
            return;
        }

        // Close inbox panel when navigating to other views
        setIsInboxOpen(false);
        setActiveView(view);
    };

    // --- Modal Handling ---
    // Function to open the modal, potentially with pre-filled data
    const handleOpenModalRequest = (mode = 'add', taskData = null, initialData = null) => {
        setModalMode(mode);
        setTaskToEdit(taskData);
        setModalInitialData(initialData); // Store initial data (e.g., { deadline: 'YYYY-MM-DD' })
        setModalError(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTaskToEdit(null);
        setModalInitialData(null); // Clear initial data
    };

    // Function called after a task is saved (created or updated)
    const handleTaskSaved = () => {
        handleCloseModal(); // Close modal on success
        // Refresh data relevant to the dashboard
        fetchDashboardCalendarData(); // Refresh calendar markers
        console.log("Task saved, dashboard calendar refreshed.");
    };

    // --- Event Handlers ---
    // Handler for clicking a date on the dashboard calendar
    const handleDateClick = (clickedDate) => {
        console.log("Dashboard calendar date clicked:", clickedDate);
        const initialData = { deadline: formatDateForInput(clickedDate) };
        // Open modal in 'add' mode, passing the clicked date for pre-filling
        handleOpenModalRequest('add', null, initialData);
    };

    // --- Rendering Logic ---
    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <div className="p-6 space-y-6">
                        <h1 className="text-3xl font-bold text-gray-800">Halo! Siap untuk produktif?</h1>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <TaskTablePreview
                                    setActiveView={setActiveView}
                                    onAddTaskRequest={() => handleOpenModalRequest('add')}
                                />
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
                                {loadingCalendar && <div className="text-center p-4">Memuat kalender...</div>}
                                {errorCalendar && <div className="text-center p-4 text-red-600">{errorCalendar}</div>}
                                {!loadingCalendar && !errorCalendar && (
                                    <CalendarView
                                        tasksByDate={dashboardTasksByDate}
                                        onDateClick={handleDateClick}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'tasks':
                return <TaskPage />;
            case 'notes':
                return <NotesGrid fullView />;
            case 'calendar':
                return <CalendarPage />;
            case 'timer': // Changed from 'pomodoro' to 'timer'
                return <TimerPage />;
            case 'notifications':
                return <div className="p-6"><h1 className="text-2xl font-bold">Notifikasi</h1></div>;
            case 'trash':
                return <div className="p-6"><h1 className="text-2xl font-bold">Sampah</h1></div>;
            case 'inbox':
                return (
                    <div className="p-6 space-y-6">
                        <h1 className="text-3xl font-bold text-gray-800">Halo! Siap untuk produktif?</h1>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <TaskTablePreview
                                    setActiveView={setActiveView}
                                    onAddTaskRequest={() => handleOpenModalRequest('add')}
                                />
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
                                {loadingCalendar && <div className="text-center p-4">Memuat kalender...</div>}
                                {errorCalendar && <div className="text-center p-4 text-red-600">{errorCalendar}</div>}
                                {!loadingCalendar && !errorCalendar && (
                                    <CalendarView
                                        tasksByDate={dashboardTasksByDate}
                                        onDateClick={handleDateClick}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar activeView={activeView} setActiveView={handleViewChange} />
            <main className="flex-1 overflow-y-auto">
                {renderContent()}
            </main>

            {/* Render the InboxContent panel */}
            <InboxContent
                isOpen={isInboxOpen}
                onClose={() => {
                    setIsInboxOpen(false);
                    setActiveView('dashboard'); // Return to dashboard when inbox is closed
                }}
            />

            {/* Placeholder for the Task Modal */}
            {/* {isModalOpen && (
                <TaskModal
                    isOpen={isModalOpen}
                    mode={modalMode}
                    initialData={modalInitialData}
                    taskData={taskToEdit}
                    onClose={handleCloseModal}
                    onSaveSuccess={handleTaskSaved}
                />
            )} */}
        </div>
    );
};

export default Dashboard;