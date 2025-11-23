import React, { useState } from 'react';
import { GameResult } from '../types';

interface ResultModalProps {
    result: GameResult;
    stats: {
        refreshes: number;
        finalRisk: number;
        timeElapsed: number;
        queuePosition: number;
    };
    onPlayAgain: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, stats, onPlayAgain }) => {
    const [copied, setCopied] = useState(false);

    if (!result) return null;

    const isWin = result === 'win';

    const getTitle = () => {
        switch (result) {
            case 'win': return 'YOU HAVE REACHED THE FRONT OF THE QUEUE!';
            case 'bot': return 'SUSPICIOUS ACTIVITY DETECTED';
            case 'lostPlace': return 'CONNECTION LOST';
            default: return 'GAME OVER';
        }
    };

    const getSubtext = () => {
        switch (result) {
            case 'win': return 'You got Glastle tickets!';
            case 'bot': return 'You have been removed from the queue due to bot-like behaviour.';
            case 'soldOut': return "Time's up! Tickets sold out.";
            case 'lostPlace': return 'You appear to have lost your place in the queue.';
            default: return '';
        }
    };

    // Format time from milliseconds
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Calculate bars (logic matches QueueDisplay)
    const maxQueue = 50000;
    const progressPct = Math.max(0, Math.min(100, ((maxQueue - stats.queuePosition) / maxQueue) * 100));
    const totalSegments = 40;
    const filledSegments = Math.floor((progressPct / 100) * totalSegments);

    const handleShare = async () => {
        const timeStr = formatTime(stats.timeElapsed);

        let text = '';
        const baseText = `I just played Glastle\nThe Glastonbury ticket queue game\n`;
        const scoreLine = `⏱️ ${timeStr} 🔄 ${stats.refreshes} 🟩 ${filledSegments}/${totalSegments}\n`;
        const linkLine = `Play at https://glastle.surge.sh`;

        if (result === 'bot') {
            text = `${baseText}Result: 🤖\n${scoreLine}${linkLine}`;
        } else if (result === 'soldOut') {
            text = `${baseText}Result: 🫴\n${scoreLine}${linkLine}`;
        } else if (result === 'win') {
            text = `${baseText}Result: 🎟️\n${scoreLine}${linkLine}`;
        } else {
            text = `${baseText}Result: 📉\n${scoreLine}${linkLine}`;
        }

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center border border-slate-200 mb-20 max-h-[85vh] overflow-y-auto">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 ${isWin ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isWin ? '🎟️' : '🚫'}
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                    {getTitle()}
                </h2>
                <p className="text-slate-600 mb-6">
                    {getSubtext()}
                </p>

                <div className="bg-slate-50 rounded-lg p-4 mb-6 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-slate-500">Refreshes</p>
                        <p className="font-bold text-slate-900">{stats.refreshes}</p>
                    </div>
                    <div>
                        <p className="text-slate-500">Bot Detection</p>
                        <p className={`font-bold ${stats.finalRisk > 80 ? 'text-red-600' : 'text-slate-900'}`}>
                            {Math.round(stats.finalRisk)}%
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-500">Time</p>
                        <p className="font-bold text-slate-900">{formatTime(stats.timeElapsed)}</p>
                    </div>
                    <div>
                        <p className="text-slate-500">Queue Progress</p>
                        <p className="font-bold text-slate-900">{filledSegments}/{totalSegments}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleShare}
                        className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                        {copied ? 'Copied!' : 'Share Result'}
                        {!copied && <span className="text-lg">📋</span>}
                    </button>

                    <button
                        onClick={onPlayAgain}
                        className="w-full py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                    >
                        Play Glastle Again
                    </button>
                </div>
            </div>
        </div>
    );
};
