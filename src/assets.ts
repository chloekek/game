namespace Game {
    export class Assets {
        constructor(
            public scenery_dungeon_floor1: THREE.Object3D,
            public scenery_dungeon_door1: THREE.Object3D,
            public scenery_dungeon_wall1: THREE.Object3D,
            public items_potion_potion1: THREE.Object3D,
            public items_potion_potion2: THREE.Object3D,
            public items_potion_potion3: THREE.Object3D,
            public items_orb_orbFire: THREE.Object3D,
            public items_key_key1: THREE.Object3D,
            public items_scroll_scroll1: THREE.Object3D,
        ) {
        }

        static loadAll(): Promise<Assets> {
            return Promise.all([
                Assets.load("assets/scenery/dungeon/floor1"),
                Assets.load("assets/scenery/dungeon/door1"),
                Assets.load("assets/scenery/dungeon/wall1"),
                Assets.load("assets/items/potion/potion1"),
                Assets.load("assets/items/potion/potion2"),
                Assets.load("assets/items/potion/potion3"),
                Assets.load("assets/items/orb/orbFire"),
                Assets.load("assets/items/key/key1"),
                Assets.load("assets/items/scroll/scroll1"),
            ]).then(array => {
                return new Assets(...array);
            });
        }

        private static load(path: string): Promise<THREE.Object3D> {
            return new Promise((resolve, reject) => {
                const mtlLoader = new THREE.MTLLoader();
                mtlLoader.load(path + ".mtl", materials => {
                    materials.preload();

                    const objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load(path + ".obj", object => {
                        const wrapped = Assets.wrap(path, object);
                        resolve(wrapped);
                    }, undefined, reject);
                }, undefined, reject);
            });
        }

        // Some assets require extra modifications after loading. This method
        // applies those modifications.
        private static wrap(path: string, object: THREE.Object3D): THREE.Object3D {
            switch (path) {
                default:
                    return object;

                case "assets/scenery/dungeon/floor1":
                    object.traverse(child => { child.receiveShadow = true; });
                    return object;

                case "assets/items/potion/potion1":
                case "assets/items/potion/potion2":
                case "assets/items/potion/potion3":
                case "assets/items/key/key1":
                case "assets/items/scroll/scroll1":
                    // TODO: Only the glass bottles need to cast shadows.
                    object.traverse(child => { child.castShadow = true; });
                    return object;

                case "assets/items/orb/orbFire": {
                    const wrapped = new THREE.Group();
                    wrapped.add(object);
                    wrapped.add(new THREE.PointLight(0xffcc33, 0.8));
                    return wrapped;
                }
            }
        }
    }
}
