let animationsInitialized = false;

export default (anims) => {
    if (!animationsInitialized) {
        anims.create({
            key: "crossbow-attack",
            frames: anims.generateFrameNumbers("crossbow-attack", {
                start: 0,
                end: 6,
            }),
            frameRate: 14,
            repeat: 0,
        });

        anims.create({
            key: "crossbow-die",
            frames: anims.generateFrameNumbers("crossbow-death", {
                start: 0,
                end: 8,
            }),
            frameRate: 18,
            repeat: 0,
        });

        animationsInitialized = true;
    }
};

