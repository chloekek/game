namespace Game.Level {
    // A level is a 2D collection of chunks, each at a chunk coordinate. It can
    // be mutated and inspected using the methods on this interface.
    export interface Level<C extends Chunk> {
        // Set or delete the chunk at a chunk coordinate within the level.
        //
        // x and z may be any integers.
        setChunk(x: number, z: number, chunk: C | null): void;

        // Get the chunk at a chunk coordinate within the level.
        //
        // x and z may be any integers.
        getChunk(x: number, z: number): C | null;

        // Get an iterable of chunks.
        listChunks(): Iterable<[number, number, C]>;
    }

    // Get the tile at a position in the level.
    export function getTile<C extends Chunk>
                           (level: Level<C>, x: number, z: number): Tile {
        const chunkX = Math.floor(x / CHUNK_SIZE);
        const chunkZ = Math.floor(z / CHUNK_SIZE);
        const tileX  = Util.mod(x, CHUNK_SIZE);
        const tileZ  = Util.mod(z, CHUNK_SIZE);
        const chunk = level.getChunk(chunkX, chunkZ);
        if (chunk === null)
            return Tile.Void;
        else
            return chunk.getTile(tileX, tileZ);
    }

    // Set the tile at a position in the level, creating a new chunk if
    // necessary.
    export function setTile<C extends Chunk>(
        factory: () => C, level: Level<C>, x: number, z: number, tile: Tile,
    ): void {
        const chunkX = Math.floor(x / CHUNK_SIZE);
        const chunkZ = Math.floor(z / CHUNK_SIZE);
        const tileX  = Util.mod(x, CHUNK_SIZE);
        const tileZ  = Util.mod(z, CHUNK_SIZE);
        let chunk = level.getChunk(chunkX, chunkZ);
        if (chunk === null) {
            chunk = factory();
            level.setChunk(chunkX, chunkZ, chunk);
        }
        chunk.setTile(tileX, tileZ, tile);
    }

    // Implementation of the level interface that keeps a 2D collection of
    // chunks.
    export class PLevel<C extends Chunk> implements Level<C> {
        private readonly chunks: Map<string, C>;

        // Construct a level with no chunks.
        constructor() {
            this.chunks = new Map();
        }

        setChunk(x: number, z: number, chunk: C | null): void {
            const key = `${x}_${z}`;
            if (chunk === null)
                this.chunks.delete(key);
            else
                this.chunks.set(key, chunk);
        }

        getChunk(x: number, z: number): C | null {
            const key = `${x}_${z}`;
            return this.chunks.get(key) || null;
        }

        *listChunks(): Iterable<[number, number, C]> {
            for (let [k, v] of this.chunks.entries()) {
                let [x, z] = k.split("_").map(s => parseInt(s));
                yield [x, z, v];
            }
        }
    }

    // Implementation of the level interface that forwards its calls to another
    // instance of the level interface and updates the scene to reflect the
    // changes to the rendering apparatus.
    export class RLevel implements Level<RChunk> {
        // The configuration of this rlevel.
        private readonly inner: Level<RChunk>;

        // The group object that contains each rchunk. You are not to mutate the
        // child list of this group, but you are allowed to mutate the
        // transformation of this group.
        readonly group: THREE.Group;

        // Create an rlevel with an inner level, and add each rchunk to the
        // group.
        constructor(inner: Level<RChunk>) {
            this.inner = inner;
            this.group = new THREE.Group();

            for (let [x, z, rchunk] of inner.listChunks())
                this.internalSetChunk(x, z, rchunk);
        }

        setChunk(x: number, z: number, chunk: RChunk | null): void {
            this.inner.setChunk(x, z, chunk);
            this.internalSetChunk(x, z, chunk);
        }

        getChunk(x: number, z: number): RChunk | null {
            return this.inner.getChunk(x, z);
        }

        listChunks(): Iterable<[number, number, RChunk]> {
            return this.inner.listChunks();
        }

        // Just like setChunk, but do not update inner.
        private internalSetChunk(x: number, z: number, rchunk: RChunk | null): void {
            // Get the old rchunk and remove it from the group.
            const previous = this.inner.getChunk(x, z);
            if (previous !== null)
                this.group.remove(previous.group);

            if (rchunk !== null) {
                // Add the new chunk to the group.
                this.group.add(rchunk.group);

                // Adjust the coordinates of the rchunk group.
                rchunk.group.position.set(x * CHUNK_SIZE, 0, z * CHUNK_SIZE);
            }
        }
    }
}
