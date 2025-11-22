import React from 'react';

interface RefreshControlProps {
    phase: 'red' | 'amber' | 'green';
    onRefresh: () => void;
    disabled: boolean;
}

export const RefreshControl: React.FC<RefreshControlProps> = ({ phase, onRefresh, disabled }) => {
    const getPhaseColor = () => {
        switch (phase) {
            case 'red': return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
            case 'amber': return 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]';
            case 'green': return 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]';
        }
    };

    return (
        <div className="flex flex-col items-center gap-2 p-2 bg-slate-50 border-t border-slate-200 z-10 relative shrink-0">
            {/* Timing Indicator Bar */}
            <div className="w-full max-w-md h-2 bg-slate-300 rounded-full overflow-hidden flex">
                <div className={`h-full w-full transition-colors duration-100 ${getPhaseColor()}`}></div>
            </div>

            <button
                onClick={onRefresh}
                disabled={disabled}
                className={`
          w-full max-w-md py-4 rounded-lg font-bold text-xl tracking-wider text-white shadow-lg
          transition-all duration-75 active:scale-[0.98]
          ${disabled ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700'}
        `}
            >
                REFRESH
            </button>
        </div>
    );
};
