namespace Game {
    // Install ambient lighting.
    export function installAmbient(scene: THREE.Scene): void {
        // Ambient lighting ensures everything is visible.
        const ambient = new THREE.AmbientLight(0xffffff, 0.15);
        scene.add(ambient);

        // Add a directional light as well, so we get shadows and speculars.
        const directional = new THREE.DirectionalLight(0xffffff, 0.5);
        directional.position.set(0, 1, 0);
        directional.castShadow = true;
        directional.shadow.mapSize.width = 128;
        directional.shadow.mapSize.height = 128;
        scene.add(directional);

        // Add fog so the player cannot see the entire scene.
        scene.fog = new THREE.FogExp2(0xffffff, 0.025);
    }
}
