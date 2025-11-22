import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserFrame } from './components/BrowserFrame';
import { QueueDisplay } from './components/QueueDisplay';
import { BotRiskBar } from './components/BotRiskBar';
import { SoldOutBar } from './components/SoldOutBar';
import { PlayField } from './components/PlayField';
import { RefreshControl } from './components/RefreshControl';
import { ResultModal } from './components/ResultModal';
import { GameState, FallingItem, FallingItemType, ITEM_CONFIG } from './types';
import { SeededRNG } from './utils/rng';

// Constants
const INITIAL_QUEUE = 50000;
const MAX_QUEUE = 60000;
const SOLD_OUT_TIME_MS = 120 * 1000; // 2 minutes
const GAME_TICK_MS = 16;

function App() {
    // Session Seed (Random each time)
    const seedRef = useRef(Math.floor(Math.random() * 1000000));
    const rngRef = useRef(new SeededRNG(seedRef.current));

    // Game State
    const [gameState, setGameState] = useState<GameState>({
        queuePosition: INITIAL_QUEUE,
        botRisk: 0,
        refreshes: 0,
        gameOver: false,
        gameResult: null,
        fallingItems: [],
        powerUpsClicked: 0,
        soldOutProgress: 0,
    });

    const [timingPhase, setTimingPhase] = useState<'red' | 'amber' | 'green'>('red');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Refs for mutable state in loop
    const lastRefreshTimeRef = useRef<number>(0);
    const refreshCountInWindowRef = useRef<number>(0);
    const animationFrameRef = useRef<number>();
    const gameStartTimeRef = useRef<number>(0);
    const consecutiveGreenRefreshesRef = useRef<number>(0);
    const lastBadItemSpawnTimeRef = useRef<number>(0);

    // Cycle management
    const cycleStateRef = useRef({
        phase: 'red' as 'red' | 'amber' | 'green',
        timeInPhase: 0,
        duration: 1000, // current phase duration
    });

    // Initialize/Reset Game
    const resetGame = useCallback(() => {
        seedRef.current = Math.floor(Math.random() * 1000000);
        rngRef.current = new SeededRNG(seedRef.current);

        setGameState({
            queuePosition: INITIAL_QUEUE,
            botRisk: 0,
            refreshes: 0,
            gameOver: false,
            gameResult: null,
            fallingItems: [],
            powerUpsClicked: 0,
            soldOutProgress: 0,
        });
        setTimingPhase('red');
        setToastMessage(null);
        lastRefreshTimeRef.current = 0;
        refreshCountInWindowRef.current = 0;
        gameStartTimeRef.current = Date.now();
        consecutiveGreenRefreshesRef.current = 0;
        lastBadItemSpawnTimeRef.current = 0;

        cycleStateRef.current = {
            phase: 'red',
            timeInPhase: 0,
            duration: 1000
        };
    }, []);

    // Start game on mount
    useEffect(() => {
        gameStartTimeRef.current = Date.now();
    }, []);

    // Helper to spawn item
    const spawnItem = (isGood: boolean) => {
        let types: FallingItemType[];

        if (isGood) {
            // Good items: incognito, newBrowser, goodVpn, newComputer
            types = ['incognito', 'newBrowser', 'goodVpn', 'newComputer'];
        } else {
            // Bad items: badVpn, newTab
            types = ['badVpn', 'newTab'];
        }

        const typeIndex = rngRef.current.rangeInt(0, types.length - 1);
        const lifetime = rngRef.current.rangeInt(300, 700); // Much faster popups

        const newItem: FallingItem = {
            id: Date.now() + Math.random(),
            type: types[typeIndex],
            x: rngRef.current.range(10, 90),
            y: rngRef.current.range(10, 40), // Higher up to avoid clipping
            lifetime: lifetime,
            maxLifetime: lifetime
        };

        setGameState(prev => ({
            ...prev,
            fallingItems: [...prev.fallingItems, newItem]
        }));
    };

    // Main Game Loop
    useEffect(() => {
        if (gameState.gameOver) {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            return;
        }

        const loop = (timestamp: number) => {
            const now = Date.now();

            // 1. Update Timing Phase (Randomized)
            const cs = cycleStateRef.current;
            cs.timeInPhase += GAME_TICK_MS;

            if (cs.timeInPhase >= cs.duration) {
                // Switch phase
                cs.timeInPhase = 0;
                if (cs.phase === 'red') {
                    cs.phase = 'amber';
                    cs.duration = rngRef.current.rangeInt(300, 600); // Short amber
                } else if (cs.phase === 'amber') {
                    cs.phase = 'green';
                    cs.duration = rngRef.current.rangeInt(400, 800); // Variable green
                } else {
                    cs.phase = 'red';
                    cs.duration = rngRef.current.rangeInt(1000, 2000); // Long red
                }
                setTimingPhase(cs.phase);
            }

            // 2. Update Sold Out Progress
            const timeElapsed = now - gameStartTimeRef.current;
            const soldOutPct = (timeElapsed / SOLD_OUT_TIME_MS) * 100;

            // 3. Random Bad Item Spawns
            if (timestamp - lastBadItemSpawnTimeRef.current > 3000) { // Check every 3s
                if (rngRef.current.next() > 0.6) { // 40% chance
                    spawnItem(false);
                }
                lastBadItemSpawnTimeRef.current = timestamp;
            }

            // 4. Update Items (Lifetime)
            setGameState(prev => {
                const nextItems = prev.fallingItems
                    .map(item => ({ ...item, lifetime: item.lifetime - GAME_TICK_MS }))
                    .filter(item => item.lifetime > 0);

                return {
                    ...prev,
                    fallingItems: nextItems,
                    soldOutProgress: soldOutPct
                };
            });

            animationFrameRef.current = requestAnimationFrame(loop);
        };

        animationFrameRef.current = requestAnimationFrame(loop);
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [gameState.gameOver]);

    // Check Win/Loss Conditions
    useEffect(() => {
        if (gameState.gameOver) return;

        if (gameState.queuePosition <= 0) {
            setGameState(prev => ({ ...prev, gameOver: true, gameResult: 'win', queuePosition: 0 }));
        } else if (gameState.botRisk >= 100) {
            setGameState(prev => ({ ...prev, gameOver: true, gameResult: 'bot', botRisk: 100 }));
        } else if (gameState.queuePosition > MAX_QUEUE) {
            setGameState(prev => ({ ...prev, gameOver: true, gameResult: 'lostPlace' }));
        } else if (gameState.soldOutProgress >= 100) {
            setGameState(prev => ({ ...prev, gameOver: true, gameResult: 'soldOut', soldOutProgress: 100 }));
        }
    }, [gameState.queuePosition, gameState.botRisk, gameState.soldOutProgress, gameState.gameOver]);

    // Handlers
    const handleRefresh = () => {
        if (gameState.gameOver) return;

        const now = Date.now();
        if (now - lastRefreshTimeRef.current < 1000) {
            refreshCountInWindowRef.current += 1;
        } else {
            refreshCountInWindowRef.current = 1;
        }
        lastRefreshTimeRef.current = now;

        let riskAdd = 0;
        let queueAdd = 0;
        let msg = null;

        if (refreshCountInWindowRef.current >= 4) {
            riskAdd += 10; // Reduced penalty
            queueAdd += 1000;
            msg = "Too many requests!";
            consecutiveGreenRefreshesRef.current = 0;
        }

        if (timingPhase === 'green') {
            queueAdd -= 1000; // Good progress
            queueAdd -= 500; // Small steady progress
            // Reward: Spawn item!
            spawnItem(true);
        } else if (timingPhase === 'amber') {
            // queueAdd += 500; // Removed pushback
            riskAdd += 15;
            msg = msg || "Suspicious refresh timing...";
        } else {
            // queueAdd += 1000; // Removed pushback
            riskAdd += 25;
            msg = msg || "Bad timing!";
        }

        const variance = rngRef.current.rangeInt(-50, 50);
        // Ensure variance doesn't make queue go up significantly, or just remove variance for bad refreshes?
        // Let's keep variance but clamp so it doesn't increase total queue position significantly if we want "never lose place".
        // Actually, let's just apply variance to progress (negative queueAdd).
        // If queueAdd is 0, variance might make it +50. That's probably fine (negligible), but let's be safe.
        if (queueAdd > 0) queueAdd = 0;

        setGameState(prev => ({
            ...prev,
            refreshes: prev.refreshes + 1,
            queuePosition: Math.min(prev.queuePosition + queueAdd + variance, prev.queuePosition), // Never go above current (never lose place)
            botRisk: prev.botRisk + riskAdd
        }));

        if (msg) showToast(msg);
    };

    const handleItemClick = (id: number) => {
        if (gameState.gameOver) return;

        const item = gameState.fallingItems.find(i => i.id === id);
        if (!item) return;

        const config = ITEM_CONFIG[item.type];

        // Ensure item effects don't push back queue
        const queueEffect = Math.min(0, config.queueEffect);

        setGameState(prev => ({
            ...prev,
            fallingItems: prev.fallingItems.filter(i => i.id !== id),
            queuePosition: prev.queuePosition + queueEffect,
            botRisk: prev.botRisk + config.riskEffect,
            powerUpsClicked: prev.powerUpsClicked + 1
        }));

        showToast(config.message);
    };

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 1500);
    };

    return (

        <div className="h-[100dvh] w-screen bg-slate-800 flex items-center justify-center p-2 pb-[env(safe-area-inset-bottom,20px)] font-sans overflow-hidden supports-[height:100dvh]:h-[100dvh]">
            <BrowserFrame>
                {/* Header */}
                <div className="p-3 md:p-6 bg-white border-b border-slate-100">
                    <div className="flex justify-center mb-3 md:mb-6">
                        <div className="bg-[#1a1a40] px-3 py-1 md:px-4 md:py-2 rounded-sm border-2 border-[#1a1a40]">
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-center" style={{ fontFamily: 'serif' }}>
                                <span className="text-[#FF3333]">G</span>
                                <span className="text-[#FFD700]">L</span>
                                <span className="text-[#FF69B4]">A</span>
                                <span className="text-[#4169E1]">S</span>
                                <span className="text-[#FF8C00]">T</span>
                                <span className="text-[#32CD32]">L</span>
                                <span className="text-[#9370DB]">E</span>
                            </h1>
                            <div className="text-white text-center text-[9px] md:text-[11px] tracking-[0.2em] font-serif mt-1">
                                GAME OF CONTEMPORARY PERFORMING ARTS
                            </div>
                        </div>
                    </div>

                    <h2 className="text-base md:text-lg text-slate-800 mb-2 md:mb-4 font-medium">You are now in the Glastle ticket sale queue!</h2>
                    <ul className="text-xs md:text-sm text-slate-600 space-y-1 md:space-y-3 list-disc list-inside">
                        <li>Refresh at the right time to move forward in the queue.</li>
                        <li>Power-ups will appear to help you, but beware of some that may affect bot detection!</li>
                    </ul>
                </div>

                {/* Game Area */}
                <QueueDisplay position={gameState.queuePosition} />

                <div className="relative flex-1 flex flex-col min-h-0 bg-slate-50">
                    <div className="flex justify-between items-start p-2 gap-4 z-10">
                        <BotRiskBar risk={gameState.botRisk} />
                    </div>

                    <PlayField
                        items={gameState.fallingItems}
                        onItemClick={handleItemClick}
                        message={toastMessage}
                    />
                </div>

                {/* Footer Controls */}
                <RefreshControl
                    phase={timingPhase}
                    onRefresh={handleRefresh}
                    disabled={gameState.gameOver}
                />

                <div>
                    <SoldOutBar progress={gameState.soldOutProgress} />
                </div>

                {/* Modals */}
                {gameState.gameOver && (
                    <ResultModal
                        result={gameState.gameResult}
                        stats={{
                            refreshes: gameState.refreshes,
                            finalRisk: gameState.botRisk,
                            timeElapsed: Date.now() - gameStartTimeRef.current,
                            queuePosition: gameState.queuePosition
                        }}
                        onPlayAgain={resetGame}
                    />
                )}
            </BrowserFrame>
        </div>
    );
}

export default App;
