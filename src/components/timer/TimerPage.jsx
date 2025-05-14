import React, { useState, useEffect, useRef } from 'react';
import TimerExplanation from './TimerExplanation';
import TimerDisplay from './TimerDisplay';
import TimerPresets from './TimerPresets';
import CustomTimerSettings from './CustomTimerSettings';

const TimerPage = () => {
    // Timer states
    const [selectedPreset, setSelectedPreset] = useState('pomodoro');
    const [timerRunning, setTimerRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 25, seconds: 0 });
    const [isCompleted, setIsCompleted] = useState(false);
    const [initialTimeLeft, setInitialTimeLeft] = useState({ hours: 0, minutes: 25, seconds: 0 });

    // Custom timer states
    const [customTime, setCustomTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [timerLabel, setTimerLabel] = useState('');

    // Saved custom timers
    const [savedTimers, setSavedTimers] = useState([]);
    const [editingTimerIndex, setEditingTimerIndex] = useState(-1);

    // Reference for interval
    const timerRef = useRef(null);

    // Preset configurations
    const presets = {
        pomodoro: { hours: 0, minutes: 25, seconds: 0 },
        minute90: { hours: 1, minutes: 30, seconds: 0 },
        minute5217: { hours: 0, minutes: 52, seconds: 0 },
        custom: null,
    };

    // Explanations for each timer method
    const explanations = {
        pomodoro: 'Teknik Pomodoro adalah metode manajemen waktu di mana kamu bekerja fokus selama 25 menit, lalu istirahat selama 5 menit. Setelah 4 siklus, ambil istirahat panjang 15-30 menit. Metode ini membantu meningkatkan fokus dan mencegah kelelahan mental.',
        minute90: 'Metode ini menyarankan kamu bekerja selama 90 menit secara fokus, kemudian beristirahat selama 20-30 menit agar tetap bugar dan produktif. Metode ini mengikuti siklus ultradian alami tubuh yang membantu memaksimalkan energi dan konsentrasi.',
        minute5217: 'Metode ini menyarankan kamu bekerja selama 52 menit secara fokus, lalu beristirahat selama 17 menit agar tetap produktif sepanjang hari. Metode ini berdasarkan penelitian yang menunjukkan bahwa durasi ini adalah keseimbangan optimal untuk produktivitas dan istirahat.',
        custom: 'Sesuaikan waktu kerja dan istirahat berdasarkan kebutuhan dan preferensi pribadimu. Setiap orang memiliki ritme produktivitas yang berbeda, jadi temukan pola yang paling efektif untuk dirimu sendiri.',
        saved: 'Timer yang kamu simpan sebelumnya.',
    };

    // Handle preset selection
    const handlePresetChange = (preset, savedTimer = null) => {
        setSelectedPreset(preset);
        setTimerRunning(false);
        setIsCompleted(false);
        clearInterval(timerRef.current);
        setEditingTimerIndex(-1); // Reset editing state

        if (preset === 'saved' && savedTimer) {
            setTimeLeft(savedTimer.time);
            setInitialTimeLeft(savedTimer.time);
            setTimerLabel(savedTimer.label);
            return;
        }

        if (preset !== 'custom') {
            setTimeLeft(presets[preset]);
            setInitialTimeLeft(presets[preset]);
            setTimerLabel(''); // Reset timer label
        } else {
            setTimeLeft(customTime);
            setInitialTimeLeft(customTime);
        }
    };

    // Handle custom timer input changes
    const handleCustomTimeChange = (field, value) => {
        const numValue = parseInt(value) || 0;
        const newCustomTime = { ...customTime, [field]: numValue };
        setCustomTime(newCustomTime);

        if (selectedPreset === 'custom') {
            setTimeLeft(newCustomTime);
            setInitialTimeLeft(newCustomTime);
        }
    };

    // Handle timer start/pause
    const handleStartTimer = () => {
        if (timerRunning) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            return;
        }

        // Don't start if timer is at 00:00:00
        if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
            return;
        }

        setTimerRunning(true);
        setIsCompleted(false);

        timerRef.current = setInterval(() => {
            setTimeLeft(prevTime => {
                let newHours = prevTime.hours;
                let newMinutes = prevTime.minutes;
                let newSeconds = prevTime.seconds;

                if (newSeconds > 0) {
                    newSeconds--;
                } else if (newMinutes > 0) {
                    newMinutes--;
                    newSeconds = 59;
                } else if (newHours > 0) {
                    newHours--;
                    newMinutes = 59;
                    newSeconds = 59;
                } else {
                    // Timer completed
                    clearInterval(timerRef.current);
                    setTimerRunning(false);
                    setIsCompleted(true);

                    // You could play a sound or show notification here
                    try {
                        const audio = new Audio('/notification.mp3');
                        audio.play();
                    } catch (error) {
                        console.log('Audio playback not supported');
                    }

                    return { hours: 0, minutes: 0, seconds: 0 };
                }

                return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
            });
        }, 1000);
    };

    // Handle timer stop (reset)
    const handleStopTimer = () => {
        clearInterval(timerRef.current);
        setTimerRunning(false);
        setTimeLeft(initialTimeLeft);
        setIsCompleted(false);
    };

    // Handle saving custom timer
    const handleSaveTimer = () => {
        // Only save if there's a label and some time set
        if (timerLabel.trim() === '') {
            alert('Mohon berikan nama untuk timer ini');
            return;
        }

        if (initialTimeLeft.hours === 0 && initialTimeLeft.minutes === 0 && initialTimeLeft.seconds === 0) {
            alert('Mohon atur waktu terlebih dahulu');
            return;
        }

        const newTimer = {
            label: timerLabel,
            time: { ...initialTimeLeft }
        };

        if (editingTimerIndex >= 0) {
            // Update existing timer
            const updatedTimers = [...savedTimers];
            updatedTimers[editingTimerIndex] = newTimer;
            setSavedTimers(updatedTimers);
            setEditingTimerIndex(-1);
            alert('Timer berhasil diperbarui!');
        } else {
            // Add new timer
            setSavedTimers(prev => [...prev, newTimer]);
            alert('Timer berhasil disimpan!');
        }

        // Reset the timer to initial state
        setTimeLeft(initialTimeLeft);
        setIsCompleted(false);
    };

    // Handle editing a saved timer
    const handleEditTimer = (index) => {
        const timerToEdit = savedTimers[index];
        setCustomTime(timerToEdit.time);
        setTimerLabel(timerToEdit.label);
        setTimeLeft(timerToEdit.time);
        setInitialTimeLeft(timerToEdit.time);
        setSelectedPreset('custom');
        setEditingTimerIndex(index);
    };

    // Handle deleting a saved timer
    const handleDeleteTimer = (index) => {
        if (confirm('Apakah Anda yakin ingin menghapus timer ini?')) {
            const updatedTimers = savedTimers.filter((_, i) => i !== index);
            setSavedTimers(updatedTimers);

            // If currently editing this timer, reset editing state
            if (editingTimerIndex === index) {
                setEditingTimerIndex(-1);
                setSelectedPreset('pomodoro');
                setTimeLeft(presets.pomodoro);
                setInitialTimeLeft(presets.pomodoro);
                setTimerLabel('');
            }
        }
    };

    // Clean up interval on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-3xl mx-auto">
            <TimerPresets
                selectedPreset={selectedPreset}
                onPresetChange={handlePresetChange}
                savedTimers={savedTimers}
                onEditTimer={handleEditTimer}
                onDeleteTimer={handleDeleteTimer}
            />

            <TimerExplanation
                explanation={explanations[selectedPreset === 'saved' ? 'custom' : selectedPreset]}
            />

            {selectedPreset === 'custom' && (
                <CustomTimerSettings
                    customTime={customTime}
                    timerLabel={timerLabel}
                    onTimeChange={handleCustomTimeChange}
                    onLabelChange={(e) => setTimerLabel(e.target.value)}
                />
            )}

            <TimerDisplay
                timeLeft={timeLeft}
                isRunning={timerRunning}
                onStartTimer={handleStartTimer}
                onStopTimer={handleStopTimer}
                isCompleted={isCompleted}
                onSaveTimer={handleSaveTimer}
            />

            {editingTimerIndex >= 0 && (
                <div className="mt-4 text-sm text-blue-600">
                    Sedang mengedit timer: {savedTimers[editingTimerIndex].label}
                </div>
            )}
        </div>
    );
};

export default TimerPage;