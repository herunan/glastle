import React from 'react';

interface QueueDisplayProps {
    position: number;
}

export const QueueDisplay: React.FC<QueueDisplayProps> = ({ position }) => {
    // Max queue is 50k. 
    // We want a segmented bar. Let's say 50 segments.
    // Each segment represents 2% of progress.
    const maxQueue = 50000;
    const progressPct = Math.max(0, Math.min(100, ((maxQueue - position) / maxQueue) * 100));
    const totalSegments = 40;
    const filledSegments = Math.floor((progressPct / 100) * totalSegments);

    return (
        <div className="bg-white p-4 pb-2">
            <div className="w-full bg-zinc-800 p-1 flex gap-[2px]">
                {Array.from({ length: totalSegments }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-6 flex-1 transition-colors duration-300 ${i < filledSegments ? 'bg-emerald-500' : 'bg-transparent'
                            }`}
                    ></div>
                ))}
            </div>

        </div>
    );
};
