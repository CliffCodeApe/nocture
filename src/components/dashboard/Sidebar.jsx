import {
    Home,
    Mail,
    CheckSquare,
    Calendar,
    Clock,
    Bell,
    Trash2,
    Plus,
    FileText
} from 'lucide-react';

const Sidebar = ({ activeView, setActiveView, pinnedNotes = [], onAddNoteRequest }) => {
    const topMenuItems = [
        { icon: Home, label: 'Beranda', key: 'dashboard' },
        { icon: Mail, label: 'Inbox', key: 'inbox' },
        { icon: CheckSquare, label: 'Tugas', key: 'tasks' },
        { icon: Calendar, label: 'Kalender', key: 'calendar' },
        { icon: Clock, label: 'Timer', key: 'timer' },
        { icon: FileText, label: 'Catatan', key: 'notes' },
    ];

    const bottomMenuItems = [
        { icon: Bell, label: 'Notifikasi', key: 'notifications' },
        { icon: Trash2, label: 'Sampah', key: 'trash' }
    ];

    // Notes color mapping
    const noteColors = {
        purple: 'bg-purple-800',
        green: 'bg-green-600',
        yellow: 'bg-yellow-500',
        red: 'bg-red-600',
        blue: 'bg-blue-600',
        teal: 'bg-teal-600',
        pink: 'bg-pink-600'
    };

    const handleNoteClick = (note) => {
        // Set active view to notes and pass the selected note ID
        setActiveView(`note-${note.id}`);
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900">Nocture</h2>
            </div>

            {/* Top navigation items */}
            <nav className="px-3">
                {topMenuItems.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setActiveView(item.key)}
                        className={`
                            w-full flex items-center py-3 px-3 rounded-lg mb-1
                            ${activeView === item.key
                                ? 'bg-purple-800 text-white'
                                : 'hover:bg-gray-100 text-gray-800'}
                            transition-colors duration-200
                        `}
                    >
                        <item.icon className="mr-3" size={20} />
                        <span className="text-sm font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Divider */}
            <div className="mt-3 mb-3 border-t border-gray-200"></div>

            {/* Notes section */}
            <div className="px-3 mb-2">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-medium text-gray-900">Catatan Saya</h3>
                    <button
                        onClick={onAddNoteRequest}
                        className="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs"
                    >
                        <Plus size={14} className="mr-1" /> Tambah
                    </button>
                </div>

                {pinnedNotes.length === 0 ? (
                    <div className="text-xs text-gray-500 pl-2">
                        Pin catatan untuk akses cepat
                    </div>
                ) : (
                    pinnedNotes.map((note) => (
                        <div
                            key={note.id}
                            className="flex items-center mb-2 cursor-pointer hover:bg-gray-100 rounded p-1"
                            onClick={() => handleNoteClick(note)}
                        >
                            <div className={`${noteColors[note.color]} w-4 h-4 rounded-sm mr-3`}></div>
                            <span className="text-sm text-gray-800 truncate">{note.title}</span>
                        </div>
                    ))
                )}
            </div>

            {/* Divider */}
            <div className="mt-3 mb-3 border-t border-gray-200"></div>

            {/* Bottom navigation items */}
            <nav className="px-3 mt-auto">
                {bottomMenuItems.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setActiveView(item.key)}
                        className={`
                            w-full flex items-center py-3 px-3 rounded-lg mb-1
                            ${activeView === item.key
                                ? 'bg-purple-800 text-white'
                                : 'hover:bg-gray-100 text-gray-800'}
                            transition-colors duration-200
                        `}
                    >
                        <item.icon className="mr-3" size={20} />
                        <span className="text-sm font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;