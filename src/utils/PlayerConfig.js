export default class PlayerConfig {
    constructor(scene) {
        this.scene = scene;
    }
    createPlayerAnimations(key) {
        const { scene } = this;
        scene.anims.create({
            key: `idle-${key}`,
            frames: scene.anims.generateFrameNumbers(key, { start: 0, end: 8 }),
            frameRate: 18,
            repeat: -1,
        });
        scene.anims.create({
            key: `run-${key}`,
            frames: scene.anims.generateFrameNumbers(key, {
                start: 9,
                end: 17,
            }),
            frameRate: 20,
            repeat: -1,
        });

        scene.anims.create({
            key: `jump-${key}`,
            frames: scene.anims.generateFrameNumbers(key, {
                start: 19,
                end: 20,
            }),
            frameRate: 1.5,
            repeat: -1,
        });
    }
}
