export class SeededRNG {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    // Simple LCG
    next(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    range(min: number, max: number): number {
        return min + this.next() * (max - min);
    }

    rangeInt(min: number, max: number): number {
        return Math.floor(this.range(min, max + 1));
    }
}
