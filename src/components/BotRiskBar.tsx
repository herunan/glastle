import React from 'react';

interface BotRiskBarProps {
    risk: number;
}

export const BotRiskBar: React.FC<BotRiskBarProps> = ({ risk }) => {
    const clampedRisk = Math.min(100, Math.max(0, risk));

    // Color changes based on risk level
    let barColor = 'bg-blue-500';
    if (clampedRisk > 50) barColor = 'bg-amber-500';
    if (clampedRisk > 80) barColor = 'bg-red-500';

    return (
        <div className="flex items-center gap-3 w-full max-w-md mx-auto px-4 py-2">
            <span className="text-sm font-bold text-slate-700 whitespace-nowrap">Bot Detection</span>
            <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden border border-slate-300 shadow-inner">
                <div
                    className={`h-full transition-all duration-300 ease-out ${barColor}`}
                    style={{ width: `${clampedRisk}%` }}
                ></div>
            </div>
            <span className={`text-sm font-mono font-bold w-12 text-right ${clampedRisk > 80 ? 'text-red-600' : 'text-slate-600'}`}>
                {Math.round(clampedRisk)}%
            </span>
        </div>
    );
};
