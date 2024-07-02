// PROJECTILES
export function preloadProjectiles(scene: Phaser.Scene) {
    // ARROW
    scene.load.image("arrow", "weapons/arrow.png");

    // FIREBALL
    scene.load.image("fire-1", "projectiles/fire_0.png");

    scene.load.spritesheet("fire-animation", "projectiles/fire.png", {
        frameWidth: 48,
        frameHeight: 66,
    });
}

