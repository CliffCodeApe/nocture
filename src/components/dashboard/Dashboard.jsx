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
import TimerPage from '../timer/TimerPage';
import NotePage from '../notes/NotesPage';
import NotesModal from '../notes/NotesModal';

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
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskModalMode, setTaskModalMode] = useState('add'); // 'add' or 'edit'
    const [taskToEdit, setTaskToEdit] = useState(null); // Task data for editing
    const [taskModalInitialData, setTaskModalInitialData] = useState(null); // For pre-filling fields like deadline
    const [taskModalError, setTaskModalError] = useState(null);

    // State for managing the Notes feature
    const [activeNote, setActiveNote] = useState(null); // Currently displayed note (if any)
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false); // For Add/Edit Note modal
    const [viewingNote, setViewingNote] = useState(false); // For viewing an existing note

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

        // Reset active note when changing to non-note views
        if (!view.startsWith('note-')) {
            setActiveNote(null);
            setViewingNote(false);
        }

        // Close inbox panel when navigating to other views
        setIsInboxOpen(false);
        setActiveView(view);
    };

    // --- Notes Handling ---
    const handleNoteSelect = (note) => {
        setActiveNote(note);
        setViewingNote(true);
        setActiveView(`note-${note.id}`); // Mark as being in a specific note (no sidebar item will be active)
    };

    const handleAddNoteClick = () => {
        setIsNoteModalOpen(true);
    };

    const handleNoteModalClose = () => {
        setIsNoteModalOpen(false);
    };

    const handleCloseNoteView = () => {
        setViewingNote(false);
        setActiveNote(null);
        setActiveView('notes'); // Return to the notes grid view
    };

    const handleUpdateNote = (updatedNote) => {
        console.log('Note updated:', updatedNote);
        // Here you would update the note in your data source
    };

    const handleDeleteNote = (noteId) => {
        console.log('Delete note:', noteId);
        handleCloseNoteView();
        // Here you would delete the note from your data source
    };

    const handleToggleNotePin = (note) => {
        console.log('Toggle pin status:', note);
        // Here you would update the pin status in your data source
    };

    // --- Task Modal Handling ---
    // Function to open the modal, potentially with pre-filled data
    const handleOpenTaskModalRequest = (mode = 'add', taskData = null, initialData = null) => {
        setTaskModalMode(mode);
        setTaskToEdit(taskData);
        setTaskModalInitialData(initialData); // Store initial data (e.g., { deadline: 'YYYY-MM-DD' })
        setTaskModalError(null);
        setIsTaskModalOpen(true);
    };

    const handleCloseTaskModal = () => {
        setIsTaskModalOpen(false);
        setTaskToEdit(null);
        setTaskModalInitialData(null); // Clear initial data
    };

    // Function called after a task is saved (created or updated)
    const handleTaskSaved = () => {
        handleCloseTaskModal(); // Close modal on success
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
        handleOpenTaskModalRequest('add', null, initialData);
    };

    // --- Rendering Logic ---
    const renderContent = () => {
        // If viewing a note, render the NotePage component as a modal
        if (viewingNote && activeNote) {
            return (
                <NotePage
                    note={activeNote}
                    onBack={handleCloseNoteView}
                    onTogglePin={handleToggleNotePin}
                    onUpdateNote={handleUpdateNote}
                    onDeleteNote={handleDeleteNote}
                />
            );
        }

        switch (activeView) {
            case 'dashboard':
                return (
                    <div className="p-6 space-y-6">
                        <h1 className="text-3xl font-bold text-gray-800">Halo! Siap untuk produktif?</h1>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <TaskTablePreview
                                    setActiveView={setActiveView}
                                    onAddTaskRequest={() => handleOpenTaskModalRequest('add')}
                                />
                            </div>
                            <div>
                                <ReminderList />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div>
                                <NotesGrid
                                    onNoteSelect={handleNoteSelect}
                                    onAddNote={handleAddNoteClick}
                                />
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
                return (
                    <NotesGrid
                        fullView
                        onNoteSelect={handleNoteSelect}
                        onAddNote={handleAddNoteClick}
                    />
                );
            case 'calendar':
                return <CalendarPage />;
            case 'timer':
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
                                    onAddTaskRequest={() => handleOpenTaskModalRequest('add')}
                                />
                            </div>
                            <div>
                                <ReminderList />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div>
                                <NotesGrid
                                    onNoteSelect={handleNoteSelect}
                                    onAddNote={handleAddNoteClick}
                                />
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
            <Sidebar
                activeView={activeView}
                setActiveView={handleViewChange}
                onNoteSelect={handleNoteSelect}
                onAddNoteClick={handleAddNoteClick}
            />
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

            {/* Note Modal for adding new notes */}
            {isNoteModalOpen && (
                <NotesModal
                    isOpen={isNoteModalOpen}
                    onClose={handleNoteModalClose}
                    activeSidebarView={activeView}
                    onSave={(noteData) => {
                        console.log('Save note', noteData);
                        handleNoteModalClose();
                        // Logic to save note would go here
                    }}
                />
            )}

            {/* Task Modal Placeholder */}
            {/* {isTaskModalOpen && (
                <TaskModal
                    isOpen={isTaskModalOpen}
                    mode={taskModalMode}
                    initialData={taskModalInitialData}
                    taskData={taskToEdit}
                    onClose={handleCloseTaskModal}
                    onSaveSuccess={handleTaskSaved}
                />
            )} */}
        </div>
    );
};

export default Dashboard;