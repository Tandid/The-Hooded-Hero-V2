export function preloadLevelMaps(scene: Phaser.Scene) {
    scene.load.tilemapTiledJSON("level_1", "level_1.json");
    scene.load.tilemapTiledJSON("level_2", "level_2.json");
    scene.load.tilemapTiledJSON("level_3", "level_3.json");
    scene.load.tilemapTiledJSON("lobby", "waitingScene.json");
}

