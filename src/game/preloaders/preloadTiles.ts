export function preloadTiles(scene: Phaser.Scene) {
    scene.load.image("forest-tiles", "tileset_1.png");
    scene.load.image("cave-tiles", "tileset_2.png");
    scene.load.image("environment-tiles", "environment.png");
    scene.load.image("house-tiles", "house_inside_4.png");

    scene.load.image("dummy", "dummy.png");

    // scene.load.image("bg-spikes-tileset", "bg_spikes_tileset.png");
}

