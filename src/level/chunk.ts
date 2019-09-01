namespace Game.Level {
    export const CHUNK_SIZE = 16;
    const TILE_COUNT = CHUNK_SIZE * CHUNK_SIZE;

    // A chunk is a 2D grid of tiles. It can be mutated and inspected using the
    // methods on this interface.
    export interface Chunk {
        // Set the tile at a tile coordinate within the chunk.
        //
        // x and z must both be integers in the range [0, CHUNK_SIZE).
        setTile(x: number, z: number, tile: Tile): void;

        // Get the tile at a tile coordinate within the chunk.
        //
        // x and z must both be integers in the range [0, CHUNK_SIZE).
        getTile(x: number, z: number): Tile;
    }

    // Implementation of the chunk interface that keeps a 2D array of tiles.
    export class PChunk implements Chunk {
        // The tiles in this pchunk, as an array of size TILE_COUNT. To access
        // the tile at position (x, z), use the formula x * CHUNK_SIZE + z.
        private readonly tiles: Tile[];

        // Construct a new pchunk with all void tiles.
        constructor() {
            this.tiles = Util.generate(TILE_COUNT, () => Tile.Void);
        }

        setTile(x: number, z: number, tile: Tile): void {
            if (x < 0 || z < 0 || x >= CHUNK_SIZE || z >= CHUNK_SIZE)
                throw Error("PChunk.setTile: tile coordinates out of bounds");
            this.tiles[x * CHUNK_SIZE + z] = tile;
        }

        getTile(x: number, z: number): Tile {
            if (x < 0 || z < 0 || x >= CHUNK_SIZE || z >= CHUNK_SIZE)
                throw Error("PChunk.setTile: tile coordinates out of bounds");
            return this.tiles[x * CHUNK_SIZE + z];
        }
    }

    // Implementation of the chunk interface that forwards its calls to another
    // instance of the chunk interface and updates the scene to reflect the
    // changes to the rendering apparatus.
    export class RChunk implements Chunk {
        // The configuration of this rchunk.
        private readonly assets: Assets;
        private readonly inner: Chunk;

        // The group object that contains an rtile for each tile. You are not to
        // mutate the child list of this group, but you are allowed to mutate
        // the transformation of this group.
        readonly group: THREE.Group;

        // The rtiles in this rchunk, as an array of size TILE_COUNT. To access
        // the tile at position (x, z), use the formula x * CHUNK_SIZE + z.
        private readonly tiles: RTile[];

        // Create an rchunk with an inner chunk, and generate rtiles for the
        // existing tiles in the inner chunk.
        constructor(assets: Assets, inner: Chunk) {
            this.assets = assets;
            this.inner = inner;

            this.group = new THREE.Group();

            this.tiles = Util.generate(TILE_COUNT, () => new THREE.Object3D());
            for (let x = 0; x < CHUNK_SIZE; ++x)
            for (let z = 0; z < CHUNK_SIZE; ++z) {
                this.internalSetTile(x, z, inner.getTile(x, z));
            }
        }

        setTile(x: number, z: number, tile: Tile): void {
            this.inner.setTile(x, z, tile);
            this.internalSetTile(x, z, tile);
        }

        getTile(x: number, z: number): Tile {
            return this.inner.getTile(x, z);
        }

        // Just like setTile, but do not update inner.
        private internalSetTile(x: number, z: number, tile: Tile): void {
            // Remove the old rtile from the group.
            const previous = this.tiles[x * CHUNK_SIZE + z];
            this.group.remove(previous);

            // Create the new rtile and add it to the group and array of rtiles.
            const rtile = rtileForTile(this.assets, x, z, tile);
            this.group.add(rtile);
            this.tiles[x * CHUNK_SIZE + z] = rtile;

            // Adjust the coordinates of the rtile.
            rtile.position.set(x, 0, z);
        }
    }
}
