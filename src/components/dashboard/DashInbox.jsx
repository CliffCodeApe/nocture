export const DashInbox = () => {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Halo! Siap untuk produktif?</h1>
            <div className="grid grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <TaskTablePreview
                        setActiveView={handleViewChange}
                        onAddTaskRequest={() => handleOpenTaskModalRequest('add')}
                    />
                </div>
                <div>
                    <ReminderList />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
                <div>
                    <NotesGrid
                        notes={notes}
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
    )
}
