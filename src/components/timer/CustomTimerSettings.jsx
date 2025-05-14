const CustomTimerSettings = ({ customTime, timerLabel, onTimeChange, onLabelChange }) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 w-full mb-6">
            <div className="grid grid-cols-3 gap-2 flex-grow">
                <div className="flex flex-col">
                    <label htmlFor="hours" className="text-center text-sm text-gray-600 mb-1">
                        Jam
                    </label>
                    <input
                        type="number"
                        id="hours"
                        min="0"
                        max="23"
                        value={customTime.hours}
                        onChange={(e) => onTimeChange('hours', e.target.value)}
                        className="border border-gray-300 rounded-md p-2 text-center"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="minutes" className="text-center text-sm text-gray-600 mb-1">
                        Menit
                    </label>
                    <input
                        type="number"
                        id="minutes"
                        min="0"
                        max="59"
                        value={customTime.minutes}
                        onChange={(e) => onTimeChange('minutes', e.target.value)}
                        className="border border-gray-300 rounded-md p-2 text-center"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="seconds" className="text-center text-sm text-gray-600 mb-1">
                        Detik
                    </label>
                    <input
                        type="number"
                        id="seconds"
                        min="0"
                        max="59"
                        value={customTime.seconds}
                        onChange={(e) => onTimeChange('seconds', e.target.value)}
                        className="border border-gray-300 rounded-md p-2 text-center"
                    />
                </div>
            </div>

            <div className="flex flex-col flex-grow">
                <label htmlFor="timerLabel" className="text-center text-sm text-gray-600 mb-1">
                    Label
                </label>
                <input
                    type="text"
                    id="timerLabel"
                    placeholder="Nama pewaktu"
                    value={timerLabel}
                    onChange={onLabelChange}
                    className="border border-gray-300 rounded-md p-2"
                />
            </div>
        </div>
    );
};

export default CustomTimerSettings;