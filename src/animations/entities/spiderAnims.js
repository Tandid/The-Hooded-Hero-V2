let animationsInitialized = false;

export default (anims) => {
    if (!animationsInitialized) {
        anims.create({
            key: "spider-run",
            frames: anims.generateFrameNumbers("spider", { start: 0, end: 10 }),
            frameRate: 20,
            repeat: -1,
        });

        anims.create({
            key: "spider-die",
            frames: anims.generateFrameNumbers("spider-death", {
                start: 0,
                end: 9,
            }),
            frameRate: 18,
            repeat: 0,
        });

        animationsInitialized = true;
    }
};

