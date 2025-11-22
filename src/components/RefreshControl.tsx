import React from 'react';

interface RefreshControlProps {
    phase: 'red' | 'amber' | 'green';
    onRefresh: () => void;
    disabled: boolean;
}

export const RefreshControl: React.FC<RefreshControlProps> = ({ phase, onRefresh, disabled }) => {
    const getButtonColor = () => {
        if (disabled) return 'bg-slate-400 cursor-not-allowed';

        switch (phase) {
            case 'red': return 'bg-red-500 hover:bg-red-600 active:bg-red-700';
            case 'amber': return 'bg-amber-400 hover:bg-amber-500 active:bg-amber-600';
            case 'green': return 'bg-green-500 hover:bg-green-600 active:bg-green-700';
        }
    };

    return (
        <div className="flex flex-col items-center gap-2 p-2 bg-slate-50 border-t border-slate-200 z-10 relative shrink-0">
            <button
                onClick={onRefresh}
                disabled={disabled}
                className={`
          w-full max-w-md py-4 rounded-lg font-bold text-xl tracking-wider text-white shadow-lg
          transition-all duration-75 active:scale-[0.98]
          ${getButtonColor()}
        `}
            >
                REFRESH
            </button>
        </div>
    );
};
