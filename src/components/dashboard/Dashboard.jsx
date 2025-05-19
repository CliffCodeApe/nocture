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
    // Core state
    const [activeView, setActiveView] = useState('dashboard');
    const [isInboxOpen, setIsInboxOpen] = useState(false);

    // Notes state
    const [notes, setNotes] = useState([]);
    const [viewingNote, setViewingNote] = useState(false);
    const [activeNote, setActiveNote] = useState(null);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

    // Calendar state
    const [dashboardTasksByDate, setDashboardTasksByDate] = useState(new Map());
    const [loadingCalendar, setLoadingCalendar] = useState(true);
    const [errorCalendar, setErrorCalendar] = useState(null);

    // Task modal state
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskModalMode, setTaskModalMode] = useState('add');
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [taskModalInitialData, setTaskModalInitialData] = useState(null);
    const [taskModalError, setTaskModalError] = useState(null);

    // Load notes from localStorage on component mount
    useEffect(() => {
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
        } else {
            // Initialize with some default notes if none exist
            const defaultNotes = [
                { id: 1, title: 'Riset Informatika', content: 'Lorem ipsum is a placeholder text commonly used in the design industry to fill spaces with content resembling real written text.', color: 'purple', isPinned: true },
                { id: 2, title: 'Praktikum Cyber', content: 'Notes tentang keamanan siber dan praktikumnya', color: 'green', isPinned: true },
                { id: 3, title: 'UNITY', content: 'Unity game development notes', color: 'yellow', isPinned: true },
                { id: 4, title: 'Machine Learning', content: 'Notes tentang machine learning project', color: 'blue', isPinned: false },
                { id: 5, title: 'UI/UX Design', content: 'Design principles and patterns', color: 'pink', isPinned: false }
            ];
            setNotes(defaultNotes);
            localStorage.setItem('notes', JSON.stringify(defaultNotes));
        }
    }, []);

    // Save notes to localStorage whenever they change
    useEffect(() => {
        if (notes.length > 0) {
            localStorage.setItem('notes', JSON.stringify(notes));
        }
    }, [notes]);

    // Filter pinned notes for the sidebar
    const pinnedNotes = notes.filter(note => note.isPinned);

    // Fetch calendar data on mount
    useEffect(() => {
        fetchDashboardCalendarData();
    }, []);

    // --- SIMPLIFIED HANDLERS ---

    // View handling
    const handleViewChange = (view) => {
        // Special handling for inbox
        if (view === 'inbox') {
            setIsInboxOpen(true);
            setActiveView('inbox');
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

    // Notes handling
    const handleNoteSelect = (note) => {
        setActiveNote(note);
        setViewingNote(true);
        setActiveView(`note-${note.id}`);
    };

    const handleAddNote = (newNote) => {
        setNotes([newNote, ...notes]);
    };

    const handleUpdateNote = (updatedNote) => {
        setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    };

    const handleDeleteNote = (noteId) => {
        setNotes(notes.filter(note => note.id !== noteId));
        setViewingNote(false);
        setActiveNote(null);
        handleViewChange('dashboard');
    };

    const handleToggleNotePin = (updatedNote) => {
        setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    };

    const handleCloseNoteView = () => {
        setViewingNote(false);
        setActiveNote(null);
        handleViewChange('dashboard');
    };

    // Task modal handling
    const handleOpenTaskModalRequest = (mode = 'add', taskData = null, initialData = null) => {
        setTaskModalMode(mode);
        setTaskToEdit(taskData);
        setTaskModalInitialData(initialData);
        setTaskModalError(null);
        setIsTaskModalOpen(true);
    };

    const handleCloseTaskModal = () => {
        setIsTaskModalOpen(false);
        setTaskToEdit(null);
        setTaskModalInitialData(null);
    };

    const handleTaskSaved = () => {
        handleCloseTaskModal();
        fetchDashboardCalendarData();
    };

    // Calendar handling
    const handleDateClick = (clickedDate) => {
        const initialData = { deadline: formatDateForInput(clickedDate) };
        handleOpenTaskModalRequest('add', null, initialData);
    };

    // Data fetching
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
                        tasksMap.set(dateKey, [true]);
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

    // Dashboard content rendering
    const renderDashboardContent = () => (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Halo! Siap untuk produktif?</h1>
            <div className="grid grid-cols-5 gap-6">
                <div className="col-span-3">
                    <TaskTablePreview
                        setActiveView={handleViewChange}
                        onAddTaskRequest={() => handleOpenTaskModalRequest('add')}
                    />
                </div>
                <div className="col-span-2">
                    <ReminderList />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <NotesGrid
                        notes={notes}
                        onNoteSelect={handleNoteSelect}
                        onAddNote={() => setIsNoteModalOpen(true)}
                    />
                </div>
                <div>
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

    // Main content rendering
    const renderContent = () => {
        // If viewing a note, show the NotePage component
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

        // Otherwise, render based on active view
        switch (activeView) {
            case 'dashboard':
            case 'inbox': // Both dashboard and inbox show the same content (dashboard is background of inbox)
                return renderDashboardContent();
            case 'tasks':
                return <TaskPage />;
            case 'notes':
                return (
                    <NotesGrid
                        fullView
                        notes={notes}
                        onNoteSelect={handleNoteSelect}
                        onAddNote={() => setIsNoteModalOpen(true)}
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
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar
                activeView={activeView}
                setActiveView={handleViewChange}
                pinnedNotes={pinnedNotes}
                onNoteSelect={handleNoteSelect}
                onAddNoteRequest={() => setIsNoteModalOpen(true)}
            />
            <main className="flex-1 overflow-y-auto">
                {renderContent()}
            </main>

            {/* Inbox panel */}
            <InboxContent
                isOpen={isInboxOpen}
                onClose={() => {
                    setIsInboxOpen(false);
                    handleViewChange('dashboard');
                }}
            />

            {/* Note Modal for adding new notes */}
            {isNoteModalOpen && (
                <NotesModal
                    isOpen={isNoteModalOpen}
                    onClose={() => setIsNoteModalOpen(false)}
                    activeSidebarView={activeView}
                    onSave={handleAddNote}
                />
            )}
        </div>
    );
};

export default Dashboard;