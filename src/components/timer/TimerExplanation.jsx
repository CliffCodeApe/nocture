import React from 'react';

const TimerExplanation = ({ explanation }) => {
    return (
        <div className="bg-purple-100 rounded-lg p-4 mb-6 w-full">
            <p className="text-purple-900 text-sm leading-relaxed">{explanation}</p>
        </div>
    );
};

export default TimerExplanation;