import React from 'react';

interface HelpModalProps {
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
    return (
        <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-full overflow-y-auto p-4 sm:p-6 border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-slate-900">How to Play Glastle</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-6 text-slate-700">
                    {/* Game Objective */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">🎯 Objective</h3>
                        <p className="text-sm">
                            Survive the Glastonbury ticket queue! Refresh at the right time to move forward,
                            collect helpful power-ups, and avoid being flagged as a bot before tickets sell out.
                        </p>
                    </section>

                    {/* Controls */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">🎮 Controls</h3>
                        <ul className="text-sm space-y-1 list-disc list-inside">
                            <li>Tap or space bar to refresh</li>
                            <li>Tap or click on power up</li>
                        </ul>
                    </section>

                    {/* Timing */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">⏱️ Timing is Everything</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 min-w-[1rem] bg-green-500 rounded shrink-0"></div>
                                <span><strong>GREEN:</strong> Perfect time to refresh! Move forward in queue.</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 min-w-[1rem] bg-amber-400 rounded shrink-0"></div>
                                <span><strong>AMBER:</strong> Risky! May increase bot detection.</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 min-w-[1rem] bg-red-500 rounded shrink-0"></div>
                                <span><strong>RED:</strong> Don't refresh! Spam detection active.</span>
                            </div>
                        </div>
                    </section>

                    {/* Power-ups */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-3">💎 Power-ups</h3>
                        <div className="grid gap-3 text-sm">
                            {/* Helpful Power-ups */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="font-bold text-green-900 mb-2">✅ Helpful Power-ups</p>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <span className="text-lg whitespace-nowrap">💻✨</span>
                                        <div>
                                            <strong>New Computer:</strong> Big queue jump, no bot harm
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-lg whitespace-nowrap">🌍✔️</span>
                                        <div>
                                            <strong>Good VPN:</strong> Good queue jump, no bot harm
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Somewhat Helpful Power-ups */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <p className="font-bold text-amber-900 mb-2">⚠️ Somewhat Helpful Power-ups</p>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <span className="text-lg">🌐</span>
                                        <div>
                                            <strong>New Browser:</strong> Good queue jump, some bot harm
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-lg">🕵️</span>
                                        <div>
                                            <strong>New Incognito Tab:</strong> Small queue jump, some bot harm
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Harmful Power-ups */}
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="font-bold text-red-900 mb-2">🚫 Harmful Power-ups</p>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <span className="text-lg whitespace-nowrap">➕📄</span>
                                        <div>
                                            <strong>New Tab:</strong> No queue jump, some bot harm
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-lg whitespace-nowrap">🌍❌</span>
                                        <div>
                                            <strong>Bad VPN:</strong> No queue jump, big bot harm
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-6 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors"
                >
                    Got it! Let's Play
                </button>
            </div>
        </div>
    );
};
