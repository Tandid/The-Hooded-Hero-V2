let animationsInitialized = false;

export default (anims) => {
    if (!animationsInitialized) {
        anims.create({
            key: "archer-run",
            frames: anims.generateFrameNumbers("archer", { start: 0, end: 10 }),
            frameRate: 15,
            repeat: -1,
        });

        anims.create({
            key: "archer-attack",
            frames: anims.generateFrameNumbers("archer", {
                start: 13,
                end: 25,
            }),
            frameRate: 60,
            repeat: 0,
        });

        anims.create({
            key: "archer-die",
            frames: anims.generateFrameNumbers("archer-death", {
                start: 0,
                end: 5,
            }),
            frameRate: 6,
            repeat: 0,
        });

        animationsInitialized = true;
    }
};

