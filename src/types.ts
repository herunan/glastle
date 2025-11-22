export type FallingItemType =
    | 'badVpn'
    | 'newTab'
    | 'incognito'
    | 'newBrowser'
    | 'goodVpn'
    | 'newComputer';

export interface FallingItem {
    id: number;
    type: FallingItemType;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
    lifetime: number; // ms remaining
    maxLifetime: number; // total ms
}

export type GameResult = 'win' | 'bot' | 'lostPlace' | 'soldOut' | null;

export interface GameState {
    queuePosition: number;
    botRisk: number;
    refreshes: number;
    gameOver: boolean;
    gameResult: GameResult;
    fallingItems: FallingItem[];
    powerUpsClicked: number;
    soldOutProgress: number; // 0-100 (used for timer calculation now)
}

// Config based on user request:
// Increase Bot Detection Only: New Tab, Bad VPN
// Decrease Queue & Increase Bot Detection: New Browser, Incognito
// Decrease Queue Only: Good VPN, New Computer

export const ITEM_CONFIG: Record<FallingItemType, {
    label: string;
    icon: string;
    queueEffect: number;
    riskEffect: number;
    message: string;
    color: string;
}> = {
    // FAKE POWERUPS (Only hurt bot detection)
    newTab: {
        label: 'New Tab',
        icon: '📄',
        queueEffect: 0,
        riskEffect: 15,
        message: 'Opening tabs is suspicious...',
        color: 'text-orange-500'
    },
    badVpn: {
        label: 'Bad VPN',
        icon: '🔒❌',
        queueEffect: 0,
        riskEffect: 25,
        message: 'Suspicious IP detected!',
        color: 'text-red-600'
    },

    // RISKY POWERUPS (Help queue, hurt bot detection)
    incognito: {
        label: 'Incognito',
        icon: '🕵️',
        queueEffect: -1000,
        riskEffect: 10,
        message: 'Incognito mode active.',
        color: 'text-blue-400'
    },
    newBrowser: {
        label: 'New Browser',
        icon: '🌐',
        queueEffect: -2000,
        riskEffect: 15,
        message: 'New browser session started.',
        color: 'text-indigo-500'
    },

    // SAFE POWERUPS (Help queue, no risk)
    goodVpn: {
        label: 'Good VPN',
        icon: '🔒✔️',
        queueEffect: -1500,
        riskEffect: 0,
        message: 'Clean connection established.',
        color: 'text-green-500'
    },
    newComputer: {
        label: 'New Computer',
        icon: '💻',
        queueEffect: -3000,
        riskEffect: 0,
        message: 'Fresh device ID detected.',
        color: 'text-purple-500'
    }
};
