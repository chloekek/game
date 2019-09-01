namespace Game {
    export interface Rng {
        random(): number;
    }

    export function randomInt(rng: Rng, lower: number, upper: number): number {
        return Math.round(lower + (upper - lower) * rng.random());
    }
}
