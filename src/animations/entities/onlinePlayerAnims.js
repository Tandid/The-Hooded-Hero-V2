let animationsInitialized = false;

export default (anims, key) => {
    if (!animationsInitialized) {
        anims.create({
            key: `idle-${key}`,
            frames: anims.generateFrameNumbers(key, { start: 0, end: 8 }),
            frameRate: 18,
            repeat: -1,
        });

        anims.create({
            key: `run-${key}`,
            frames: anims.generateFrameNumbers(key, { start: 9, end: 17 }),
            frameRate: 20,
            repeat: -1,
        });

        anims.create({
            key: `jump-${key}`,
            frames: anims.generateFrameNumbers(key, { start: 18, end: 20 }),
            frameRate: 1.5,
            repeat: -1,
        });

        animationsInitialized = true;
    }
};

