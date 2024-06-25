export function preloadTiles(scene: Phaser.Scene) {
    scene.load.image("forest-tiles", "public/assets/tileset_1.png");
    scene.load.image("cave-tiles", "public/assets/tileset_2.png");
    scene.load.image("environment-tiles", "public/assets/environment.png");
    scene.load.image("house-tiles", "public/assets/house_inside_4.png");

    scene.load.image("dummy", "public/assets/dummy.png");

    // scene.load.image("bg-spikes-tileset", "public/assets/bg_spikes_tileset.png");
}

