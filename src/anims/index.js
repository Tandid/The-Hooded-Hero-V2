export default (anims) => {
    anims.create({
        key: "hit-effect",
        frames: anims.generateFrameNumbers("hit-sheet", { start: 0, end: 4 }),
        frameRate: 30,
        repeat: 0,
    });

    anims.create({
        key: "sword-default-swing",
        frames: anims.generateFrameNumbers("sword-default", {
            start: 0,
            end: 7,
        }),
        frameRate: 60,
        repeat: 0,
    });

    anims.create({
        key: "axe-default-swing",
        frames: anims.generateFrameNumbers("boss-default", {
            start: 0,
            end: 20,
        }),
        frameRate: 20,
        repeat: 0,
    });

    anims.create({
        key: "fire",
        frames: [
            { key: "fire-1" },
            { key: "fire-2" },
            { key: "fire-3" },
            { key: "fire-4" },
            { key: "fire-5" },
            { key: "fire-6" },
            { key: "fire-7" },
        ],
        frameRate: 8,
        repeat: -1,
    });

    anims.create({
        key: "coin-spin",
        frames: [
            { key: "coin-1" },
            { key: "coin-2" },
            { key: "coin-3" },
            { key: "coin-4" },
            { key: "coin-5" },
            { key: "coin-6" },
            { key: "coin-7" },
            { key: "coin-8" },
        ],
        frameRate: 8,
        repeat: -1,
    });
};

