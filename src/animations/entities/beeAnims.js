let animationsInitialized = false;

export default (anims) => {
    if (!animationsInitialized) {
        anims.create({
            key: "bee-fly",
            frames: anims.generateFrameNumbers("bee", { start: 0, end: 8 }),
            frameRate: 16,
            repeat: -1,
        });

        anims.create({
            key: "bee-attack",
            frames: anims.generateFrameNumbers("bee-attack", {
                start: 0,
                end: 12,
            }),
            frameRate: 12,
            repeat: 0,
        });

        anims.create({
            key: "bee-die",
            frames: anims.generateFrameNumbers("bee-death", {
                start: 0,
                end: 8,
            }),
            frameRate: 16,
            repeat: 0,
        });

        animationsInitialized = true;
    }
};

