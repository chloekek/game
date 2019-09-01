namespace Game.Level {
    export enum Tile {
        Void,

        Dungeon_Door,
        Dungeon_Floor,
        Dungeon_Wall,
    }

    // An rtile is a visual depiction of a tile. What a tile looks like depends
    // not only on its theme but also on its coordinates. This allows for more
    // variation within a single theme.
    export type RTile = THREE.Object3D;

    // Return a new rtile for a tile. The position is used to generate different
    // variations of the same tile, that function identically but appear
    // differently for to give more varied scenery.
    export function rtileForTile(assets: Assets, x: number, z: number, tile: Tile): RTile {
        switch (tile) {
            case Tile.Void: return new THREE.Object3D();

            case Tile.Dungeon_Door:  return assets.scenery_dungeon_door1 .clone();
            case Tile.Dungeon_Floor: return assets.scenery_dungeon_floor1.clone();
            case Tile.Dungeon_Wall:  return assets.scenery_dungeon_wall1 .clone();

            default: throw Error("rtileForTile: unsupported tile");
        }
    }
}
