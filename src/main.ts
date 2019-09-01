namespace Game {
    export function main(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const scene = new THREE.Scene();

        const camera = new Camera(width, height);
        scene.add(camera.object);

        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;

        installAmbient(scene);

        let items: any[] = [];

        Assets.loadAll().then(assets => {
            const chunkFactory = () => new Level.RChunk(assets, new Level.PChunk());

            const level = new Level.RLevel(new Level.PLevel());
            scene.add(level.group);

            const generator = new Level.Generator(Math, chunkFactory, level);
            generator.generateDungeon();

            level.group.traverse(o => {
                o.matrixAutoUpdate = false;
                o.updateMatrix();
            });

            let item: any;

            item = assets.items_potion_potion1.clone();
            item.position.x = 1;
            item.position.y = 0.25;
            item.position.z = 1;
            scene.add(item);
            items.push(item);

            item = assets.items_potion_potion2.clone();
            item.position.x = 1;
            item.position.y = 0.25;
            item.position.z = 2;
            scene.add(item);
            items.push(item);

            item = assets.items_potion_potion3.clone();
            item.position.x = 1;
            item.position.y = 0.25;
            item.position.z = 3;
            scene.add(item);
            items.push(item);

            item = assets.items_orb_orbFire.clone();
            item.position.x = 2;
            item.position.y = 0.25;
            item.position.z = 1;
            scene.add(item);
            items.push(item);

            item = assets.items_key_key1.clone();
            item.position.x = 2;
            item.position.y = 0.25;
            item.position.z = 2;
            scene.add(item);
            items.push(item);

            item = assets.items_scroll_scroll1.clone();
            item.position.x = 2;
            item.position.y = 0.25;
            item.position.z = 3;
            scene.add(item);
            items.push(item);
        });

        let x = 0, z = 0, angle = 0 * Math.PI / 180, zoom = 0.5;

        addEventListener("keydown", ev => {
            console.log(ev.key);

            if (ev.key === "q") { x -= 1;         }
            if (ev.key === "w") { x -= 1; z -= 1; }
            if (ev.key === "e") {         z -= 1; }
            if (ev.key === "a") { x -= 1; z += 1; }
            if (ev.key === "s") { x += 1; z += 1; }
            if (ev.key === "d") { x += 1; z -= 1; }
            if (ev.key === "z") {         z += 1; }
            if (ev.key === "x") { x += 1;         }

            if (ev.key === "ArrowLeft" ) { angle -= 45 * Math.PI / 180; }
            if (ev.key === "ArrowRight") { angle += 45 * Math.PI / 180; }

            if (ev.key === "ArrowUp"   ) { zoom *= 2; }
            if (ev.key === "ArrowDown" ) { zoom /= 2; }
        });

        const stats = new Stats();
        stats.showPanel(0);

        document.body.appendChild(renderer.domElement);
        document.body.appendChild(stats.dom);

        function animate() {
            requestAnimationFrame(animate);

            stats.begin();

            camera.adjust(x, z, angle, zoom);

            for (let item of items) {
                item.rotation.x += 0.007;
                item.rotation.z += 0.007;
            }

            renderer.render(scene, camera.camera);

            stats.end();
        }

        animate();
    }
}
