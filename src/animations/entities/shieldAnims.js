let animationsInitialized = false;

export default (anims) => {
    if (!animationsInitialized) {
        anims.create({
            key: "shield-run",
            frames: anims.generateFrameNumbers("shield-run", {
                start: 0,
                end: 9,
            }),
            frameRate: 20,
            repeat: -1,
        });

        anims.create({
            key: "shield-attack",
            frames: anims.generateFrameNumbers("shield-attack", {
                start: 0,
                end: 12,
            }),
            frameRate: 26,
            repeat: 0,
        });

        anims.create({
            key: "shield-die",
            frames: anims.generateFrameNumbers("shield-death", {
                start: 0,
                end: 6,
            }),
            frameRate: 14,
            repeat: 0,
        });

        animationsInitialized = true;
    }
};

