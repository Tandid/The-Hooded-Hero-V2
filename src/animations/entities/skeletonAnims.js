let animationsInitialized = false;

export default (anims) => {
    if (!animationsInitialized) {
        anims.create({
            key: "skeleton-run",
            frames: anims.generateFrameNumbers("skeleton", {
                start: 0,
                end: 10,
            }),
            frameRate: 15,
            repeat: -1,
        });

        anims.create({
            key: "skeleton-die",
            frames: anims.generateFrameNumbers("skeleton-death", {
                start: 0,
                end: 5,
            }),
            frameRate: 6,
            repeat: 0,
        });

        animationsInitialized = true;
    }
};

