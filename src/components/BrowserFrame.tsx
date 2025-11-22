import React from 'react';

interface BrowserFrameProps {
    children: React.ReactNode;
}

export const BrowserFrame: React.FC<BrowserFrameProps> = ({ children }) => {
    return (
        <div className="w-full max-w-4xl mx-auto h-full bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col border border-slate-300">
            {/* Browser Chrome */}
            <div className="bg-slate-100 border-b border-slate-300 p-3 flex items-center gap-4 shrink-0">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 border border-green-600"></div>
                </div>

                {/* Fake URL Bar */}
                <div className="flex-1 bg-white border border-slate-300 rounded-md px-3 py-1 text-sm text-slate-600 flex items-center gap-2 shadow-inner">
                    <span className="text-slate-400">🔒</span>
                    <span className="truncate">glastle.buytickets.com/queue</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative bg-white flex flex-col">
                {children}
            </div>
        </div>
    );
};
