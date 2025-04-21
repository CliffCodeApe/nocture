import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import Sidebar from './Sidebar';
import TaskPage from '../task-management/TaskPage';
import TaskTablePreview from '../task-management/TaskTablePreview';
import NotesGrid from './NotesGrid';
import CalendarView from './CalendarView';
import CalendarPage from '../calendar/CalendarPage';
import ReminderList from './ReminderList';
import InboxPage from '../inbox/InboxPage';
// Import komponen modal (jika sudah dibuat terpisah)
// import TaskModal from '../shared/TaskModal'; // Example path

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

    // --- Modal Handling ---
    // Function to open the modal, potentially with pre-filled data
    const handleOpenModalRequest = (mode = 'add', taskData = null, initialData = null) => {
        setModalMode(mode);
        setTaskToEdit(taskData);
        setModalInitialData(initialData); // Store initial data (e.g., { deadline: 'YYYY-MM-DD' })
        setModalError(null);
        setIsModalOpen(true);
        // Note: The actual modal component will need to use modalInitialData
        // to pre-fill its internal form state when mode is 'add'.
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
        // We might need a way to tell TaskTablePreview and ReminderList to refresh too
        // This could involve passing refresh functions or using a global state/event system
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
                                    // Pass the function to request opening the modal
                                    onAddTaskRequest={() => handleOpenModalRequest('add')}
                                />
                            </div>
                            <div>
                                {/* ReminderList might also need onAddTaskRequest */}
                                {/* <ReminderList onAddTaskRequest={() => handleOpenModalRequest('add')} /> */}
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
                                        // Pass the date click handler
                                        onDateClick={handleDateClick}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                );
            // Other cases remain the same for now...
            case 'tasks':
                // TaskPage might need props like:
                // onEditTaskRequest={(task) => handleOpenModalRequest('edit', task)}
                // onAddTaskRequest={() => handleOpenModalRequest('add')}
                return <TaskPage />;
            case 'notes':
                return <NotesGrid fullView />;
            case 'calendar':
                 // CalendarPage might need props like:
                 // onAddTaskRequest={(initialData) => handleOpenModalRequest('add', null, initialData)}
                return <CalendarPage />;
            case 'pomodoro':
                return <div className="p-6"><h1 className="text-2xl font-bold">Pomodoro Timer</h1></div>;
            case 'inbox':
                 return <InboxPage />;
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

            {/* Render the shared Task Modal here */}
            {/* This assumes you have a separate TaskModal component */}
            {/* You would pass necessary props like isOpen, mode, initialData, taskData, onClose, onSaveSuccess etc. */}
            {/* Example: */}
            {/* {isModalOpen && (
                <TaskModal
                    isOpen={isModalOpen}
                    mode={modalMode}
                    initialData={modalInitialData} // Pass initial data for pre-filling
                    taskData={taskToEdit} // Pass task data for editing
                    onClose={handleCloseModal}
                    onSaveSuccess={handleTaskSaved} // Function to call on successful save
                    // Pass invoke function or handle invoke calls within TaskModal
                />
            )} */}
        </div>
    );
};

export default Dashboard;
