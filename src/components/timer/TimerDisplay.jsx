const TimerDisplay = ({ timeLeft, isRunning, onStartTimer, onStopTimer, isCompleted, onSaveTimer }) => {
    // Format time as 00:00 or 00:00:00
    const formatTime = () => {
        const { hours, minutes, seconds } = timeLeft;
        const formattedHours = hours > 0 ? `${hours}:` : '';
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="relative w-64 h-64 flex items-center justify-center mb-6">
                {/* Circle background */}
                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>

                {/* Timer text */}
                <div className="text-5xl font-bold">{formatTime()}</div>
            </div>

            <div className="flex space-x-4">
                {!isCompleted ? (
                    <>
                        <button
                            onClick={onStartTimer}
                            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-8 rounded-md transition-colors"
                        >
                            {isRunning ? 'Pause' : 'Mulai'}
                        </button>

                        {/* Show Stop button only when timer is running or has been started */}
                        {isRunning && (
                            <button
                                onClick={onStopTimer}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-8 rounded-md transition-colors"
                            >
                                Stop
                            </button>
                        )}
                    </>
                ) : (
                    <button
                        onClick={onSaveTimer}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-8 rounded-md transition-colors"
                    >
                        Simpan Timer
                    </button>
                )}
            </div>
        </div>
    );
};

export default TimerDisplay;