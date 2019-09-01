namespace Game {
    export class Camera {
        // The object that you can translate and rotate.
        readonly object: THREE.Object3D;

        // The actual camera. Only use this for passing it to render.
        readonly camera: THREE.PerspectiveCamera;

        // These are interpolated versions of the corresponding non-display
        // parameters. Pairs of states are needed to provide smooth transitions.
        private displayX: number;
        private displayZ: number;
        private displayZoom: number;
        private displayAngle: number;

        constructor(width: number, height: number) {
            const aspect = width / height;

            // Create a camera and offset it so that it pivots around the
            // target when rotated.
            const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000);
            camera.position.set(-2, 4, -2);
            camera.lookAt(0, 0.25, 0);

            // Wrap the camera in a group that we can translate and rotate.
            const object = new THREE.Group();
            object.add(camera);

            this.camera = camera;
            this.object = object;

            // These will be overwritten on the first frame so we use an
            // arbitrary value for each.
            this.displayX     = 0;
            this.displayZ     = 0;
            this.displayZoom  = 0;
            this.displayAngle = 0;
        }

        adjust(x: number, z: number, angle: number, zoom: number): void {
            // Smoothly transition between parameter changes.
            this.displayX     = Camera.interpolate(x    , this.displayX    );
            this.displayZ     = Camera.interpolate(z    , this.displayZ    );
            this.displayAngle = Camera.interpolate(angle, this.displayAngle);
            this.displayZoom  = Camera.interpolate(zoom , this.displayZoom );

            // Set the parameters of the camera wrapper.
            this.object.position.set(this.displayX, 0, this.displayZ);
            this.object.rotation.y = this.displayAngle;

            // Set the parameters of the camera itself.
            this.camera.zoom = this.displayZoom;
            this.camera.updateProjectionMatrix();
        }

        // Interpolate two numbers, such that an animation always takes the same
        // amount of time regardless of distance.
        private static interpolate(a: number, b: number): number {
            if (Math.abs(a - b) < 0.0001) return a;
            return b + 0.2 * (a - b);
        }
    }
}
