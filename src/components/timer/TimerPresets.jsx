const TimerPresets = ({ selectedPreset, onPresetChange, savedTimers, onEditTimer, onDeleteTimer }) => {
    const presets = [
        { id: 'pomodoro', label: 'Pomodoro' },
        { id: 'minute90', label: 'Metode 90 menit' },
        { id: 'minute5217', label: 'Metode 52/17' },
        { id: 'custom', label: 'Custom' },
    ];

    return (
        <div className="flex flex-col w-full mb-4">
            <div className="flex space-x-2 w-full mb-4">
                {presets.map((preset) => (
                    <button
                        key={preset.id}
                        className={`py-2 px-4 rounded-md flex-1 transition-colors ${selectedPreset === preset.id
                                ? 'bg-purple-800 text-white'
                                : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
                            }`}
                        onClick={() => onPresetChange(preset.id)}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            {/* Saved timers section with edit and delete options */}
            {savedTimers.length > 0 && (
                <div className="w-full">
                    <div className="mb-2 text-sm text-gray-600">Timer Tersimpan:</div>
                    <div className="space-y-2">
                        {savedTimers.map((timer, index) => (
                            <div key={index} className="flex items-center border border-gray-200 rounded-md p-2 bg-white">
                                <div
                                    className="flex-grow cursor-pointer"
                                    onClick={() => onPresetChange('saved', timer)}
                                >
                                    <span className="font-medium">{timer.label}</span>
                                    <span className="text-sm text-gray-600 ml-2">
                                        ({timer.time.hours > 0 ? `${timer.time.hours}j ` : ''}
                                        {timer.time.minutes > 0 ? `${timer.time.minutes}m ` : ''}
                                        {timer.time.seconds > 0 ? `${timer.time.seconds}d` : ''})
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        className="text-blue-600 hover:text-blue-800 px-2 py-1"
                                        onClick={() => onEditTimer(index)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-800 px-2 py-1"
                                        onClick={() => onDeleteTimer(index)}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimerPresets;