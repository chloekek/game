declare namespace THREE {
    class Euler {
        x: number;
        y: number;
        z: number;
    }

    class Vector3 {
        x: number;
        y: number;
        z: number;

        set(x: number, y: number, z: number): this;
    }

    class Object3D {
        readonly rotation: Euler;
        readonly position: Vector3;

        castShadow: boolean;
        receiveShadow: boolean;

        matrixAutoUpdate: boolean;

        clone(): this;

        add(...other: Object3D[]): this;
        remove(...other: Object3D[]): this;
        traverse(callback: (child: Object3D) => void): void;

        lookAt(vector: Vector3): void;
        lookAt(x: number, y: number, z: number): void;

        updateMatrix(): void;
    }

    class Scene extends Object3D {
        fog: FogExp2 | null;
    }

    class Group extends Object3D {
    }

    class Mesh extends Object3D {
    }

    class FogExp2 {
        constructor(color: number, density: number);
    }

    class AmbientLight extends Object3D {
        constructor(color: number, intensity: number);
    }

    class DirectionalLight extends Object3D {
        castShadow: boolean;

        shadow: {
            mapSize: {
                width: number,
                height: number,
            },
        };

        constructor(color: number, intensity: number);
    }

    class PointLight extends Object3D {
        constructor(color: number, intensity: number);
    }

    class PerspectiveCamera extends Object3D {
        zoom: number;

        constructor(fov: number, aspect: number, near: number, far: number);

        updateProjectionMatrix(): void;
    }

    class WebGLRenderer {
        domElement: HTMLCanvasElement;

        shadowMap: {
            enabled: boolean,
        };

        constructor(options: {
            antialias?: boolean,
        });

        setSize(width: number, height: number): void;

        render(scene: Scene, camera: PerspectiveCamera): void;
    }

    class MTLLoader {
        load(
            url:        string,
            onLoad:     (materials: MTLLoader.MaterialCreator) => void,
            onProgress: undefined,
            onError:    (error: any) => void,
        ): void;
    }

    namespace MTLLoader {
        class MaterialCreator {
            preload(): void;
        }
    }

    class OBJLoader {
        setMaterials(materials: MTLLoader.MaterialCreator): void;

        load(
            url:        string,
            onLoad:     (object: THREE.Object3D) => void,
            onProgress: undefined,
            onError:    (error: any) => void,
        ): void;
    }
}
