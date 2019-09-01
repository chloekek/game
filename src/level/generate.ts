namespace Game.Level {
    export class Generator<C extends Chunk> {
        private readonly rng: Rng;
        private readonly chunkFactory: () => C;
        private readonly level: Level<C>;

        constructor(rng: Rng, chunkFactory: () => C, level: Level<C>) {
            this.rng = rng;
            this.chunkFactory = chunkFactory;
            this.level = level;
        }

        private setTile(x: number, z: number, tile: Tile): void {
            setTile(this.chunkFactory, this.level, x, z, tile);
        }

        generateDungeon(): void {
            for (let x = 0; x < 5; ++x)
            for (let z = 0; z < 5; ++z) {
                if (Math.random() < 0.5)
                    continue;
                const rx = 20 * x + randomInt(this.rng, 2,  6);
                const rz = 20 * z + randomInt(this.rng, 2,  6);
                const rw =          randomInt(this.rng, 4, 12);
                const rh =          randomInt(this.rng, 4, 12);
                this.generateRoom(rx, rz, rw, rh);
            }
        }

        generateRoom(x: number, z: number, w: number, h: number): void {
            // Generate horizontal room walls.
            for (let tx = x + 1; tx < x + w; ++tx) {
                this.setTile(tx, z + 0, Tile.Dungeon_Wall);
                this.setTile(tx, z + h, Tile.Dungeon_Wall);
            }

            // Generate vertical room walls.
            for (let tz = z + 1; tz < z + h; ++tz) {
                this.setTile(x + 0, tz, Tile.Dungeon_Wall);
                this.setTile(x + w, tz, Tile.Dungeon_Wall);
            }

            // Generate corner room walls.
            this.setTile(x + 0, z + 0, Tile.Dungeon_Wall);
            this.setTile(x + 0, z + h, Tile.Dungeon_Wall);
            this.setTile(x + w, z + 0, Tile.Dungeon_Wall);
            this.setTile(x + w, z + h, Tile.Dungeon_Wall);

            // Generate room floor.
            for (let tx = x + 1; tx < x + w; ++tx)
            for (let tz = z + 1; tz < z + h; ++tz)
                this.setTile(tx, tz, Tile.Dungeon_Floor);
        }
    }
}
