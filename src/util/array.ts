namespace Game.Util {
    export function generate<T>(n: number, f: () => T): T[] {
        const result = [];
        for (let i = 0; i < n; ++i)
            result.push(f());
        return result;
    }
}
