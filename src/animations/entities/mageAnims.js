let animationsInitialized = false;

export default (anims) => {
    if (!animationsInitialized) {
        anims.create({
            key: "mage-idle",
            frames: anims.generateFrameNumbers("mage", { start: 0, end: 7 }),
            frameRate: 7,
            repeat: -1,
        });

        anims.create({
            key: "mage-attack",
            frames: anims.generateFrameNumbers("mage", { start: 8, end: 19 }),
            frameRate: 60,
            repeat: 0,
        });

        anims.create({
            key: "mage-die",
            frames: anims.generateFrameNumbers("mage-death", {
                start: 0,
                end: 6,
            }),
            frameRate: 12,
            repeat: 0,
        });

        animationsInitialized = true;
    }
};

