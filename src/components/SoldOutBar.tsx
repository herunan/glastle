import React from 'react';

interface SoldOutBarProps {
    progress: number;
}

export const SoldOutBar: React.FC<SoldOutBarProps> = ({ progress }) => {
    // Progress 0-100 maps to 2 minutes (120 seconds)
    // 0% = 120s remaining
    // 100% = 0s remaining
    const totalSeconds = 120;
    const remainingSeconds = Math.max(0, Math.ceil(totalSeconds * (1 - progress / 100)));

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return (
        <div className="w-full max-w-xs mx-auto px-4 py-2 text-center">
            <span className="font-bold text-slate-600 text-sm mr-2">Sells out in</span>
            <span className={`font-mono font-bold text-lg ${remainingSeconds < 30 ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>
                {timeString}
            </span>
        </div>
    );
};
