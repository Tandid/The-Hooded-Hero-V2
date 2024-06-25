export function preloadLevelMaps(scene: Phaser.Scene) {
    scene.load.tilemapTiledJSON("level_1", "public/assets/level_1.json");
    scene.load.tilemapTiledJSON("level_2", "public/assets/level_2.json");
    scene.load.tilemapTiledJSON("level_3", "public/assets/level_3.json");
    scene.load.tilemapTiledJSON("lobby", "public/assets/waitingScene.json");
}

