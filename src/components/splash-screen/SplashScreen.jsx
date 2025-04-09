import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import splashIcon from '../../assets/splash-icon.png';
import Dashboard from '../dashboard/Dashboard';  // Import Dashboard

const SplashScreen = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [autoplay, setAutoplay] = useState(true);
    const [showDashboard, setShowDashboard] = useState(false);  // New state to control dashboard visibility

    const slides = [
        {
            title: "Atur tugas dengan mudah, tetap fokus mencapai tujuan!",
            subtitle: "Simpan dan kelola tugas harianmu dengan tampilan yang rapi dan intuitif"
        },
        {
            title: "Produktivitas maksimal dengan teknik Pomodoro!",
            subtitle: "Kerja lebih fokus dan efisien dengan sesi kerja terstruktur"
        },
        {
            title: "Jangan lupa! Reminder siap mengingatkan tugas pentingmu.",
            subtitle: "Atur pengingat agar tidak ada tugas yang terlewat"
        }
    ];

    // Auto slide effect
    useEffect(() => {
        let interval;

        if (autoplay) {
            interval = setInterval(() => {
                setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [autoplay, slides.length]);

    const handleDotClick = (index) => {
        setCurrentSlide(index);
        setAutoplay(false);

        // Resume autoplay after 10 seconds of inactivity
        setTimeout(() => setAutoplay(true), 10000);
    };

    const handleSkip = () => {
        setShowDashboard(true);  // Navigate to Dashboard
    };

    // If dashboard is shown, render Dashboard
    if (showDashboard) {
        return <Dashboard />;
    }

    return (
        <div className="w-full h-screen bg-purple-800 flex flex-col justify-between items-center p-0 overflow-hidden">
            {/* Animated content */}
            <div className="flex-1 w-full max-w-2xl flex pt-8 justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className="w-full flex flex-col items-center"
                    >
                        {/* External splash icon with animation */}
                        <motion.div
                            className="w-96 h-96 relative mb-12 flex items-center justify-center"
                            animate={{
                                y: [0, 10, 0],
                                rotate: [0, 2, 0, -2, 0]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        >
                            <img
                                src={splashIcon}
                                alt="Splash Icon"
                                className="w-96 h-96 object-contain"
                            />
                        </motion.div>

                        {/* Slide text content */}
                        <motion.h1
                            className="text-white text-2xl sm:text-3xl font-bold text-center mb-4 px-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            {slides[currentSlide].title}
                        </motion.h1>

                        <motion.p
                            className="text-white text-center text-sm sm:text-base px-6 max-w-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            {slides[currentSlide].subtitle}
                        </motion.p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation and controls */}
            <div className="w-full flex flex-col items-center mb-8">
                {/* Skip to dashboard button */}
                <motion.button
                    onClick={handleSkip}
                    className="mb-8 bg-white text-purple-800 px-6 py-3 rounded-full font-semibold flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Mulai Sekarang
                    <ChevronRight className="ml-2" size={18} />
                </motion.button>

                {/* Dots navigation */}
                <div className="flex space-x-3">
                    {slides.map((_, index) => (
                        <motion.button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-purple-500' : 'bg-white bg-opacity-50'}`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;