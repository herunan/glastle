import React from 'react';
import { FallingItem, ITEM_CONFIG } from '../types';

interface PlayFieldProps {
    items: FallingItem[];
    onItemClick: (id: number) => void;
    message: string | null;
}

export const PlayField: React.FC<PlayFieldProps> = ({ items, onItemClick, message }) => {
    return (
        <div className="flex-1 relative bg-slate-50 overflow-hidden select-none">
            {/* Message Toast */}
            {message && (
                <div className="absolute top-4 left-0 right-0 flex justify-center z-20 pointer-events-none">
                    <div className="bg-slate-800/90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm animate-bounce">
                        {message}
                    </div>
                </div>
            )}

            {/* Pop-up Items */}
            {items.map((item) => {
                const config = ITEM_CONFIG[item.type];
                // Calculate opacity based on lifetime
                // Fade in for first 10%, fade out for last 20%
                const lifePct = item.lifetime / item.maxLifetime;
                let opacity = 1;
                if (lifePct > 0.9) opacity = (1 - lifePct) * 10;
                if (lifePct < 0.2) opacity = lifePct * 5;

                return (
                    <button
                        key={item.id}
                        onClick={() => onItemClick(item.id)}
                        className="absolute transform -translate-x-1/2 hover:scale-110 active:scale-95 transition-transform cursor-pointer z-10 group"
                        style={{
                            left: `${item.x}%`,
                            top: `${item.y}%`,
                            opacity: opacity
                        }}
                    >
                        <div className="flex flex-col items-center animate-bounce">
                            <div className="text-2xl filter drop-shadow-md bg-white/90 rounded-full p-2 border-2 border-slate-100 whitespace-nowrap flex">{config.icon}</div>
                            <span className={`text-[10px] font-bold bg-white/90 px-1 rounded shadow-sm mt-1 whitespace-nowrap text-slate-700`}>
                                {config.label}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
