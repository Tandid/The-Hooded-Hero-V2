// PROJECTILES
export function preloadProjectiles(scene: Phaser.Scene) {
    // ARROW
    scene.load.image("arrow", "weapons/arrow.png");

    // FIREBALL
    scene.load.image("fire-1", "projectiles/fire_0.png");
    scene.load.image("fire-2", "projectiles/fire_1.png");
    scene.load.image("fire-3", "projectiles/fire_2.png");
    scene.load.image("fire-4", "projectiles/fire_3.png");
    scene.load.image("fire-5", "projectiles/fire_4.png");
    scene.load.image("fire-6", "projectiles/fire_5.png");
    scene.load.image("fire-7", "projectiles/fire_6.png");
    scene.load.image("fire-8", "projectiles/fire_7.png");
}

