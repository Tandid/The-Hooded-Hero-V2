export default (anims) => {
    anims.create({
        key: "idle",
        frames: anims.generateFrameNumbers("player", { start: 0, end: 8 }),
        frameRate: 18,
        repeat: -1,
    });

    anims.create({
        key: "run",
        frames: anims.generateFrameNumbers("player", { start: 9, end: 17 }),
        frameRate: 30,
        repeat: -1,
    });

    anims.create({
        key: "jump",
        frames: anims.generateFrameNumbers("player", { start: 18, end: 20 }),
        frameRate: 1,
        repeat: 0,
    });

    anims.create({
        key: "shoot-arrow",
        frames: anims.generateFrameNumbers("player-shoot-arrow", {
            start: 0,
            end: 15,
        }),
        frameRate: 60,
        repeat: 0,
    });

    anims.create({
        key: "melee",
        frames: anims.generateFrameNumbers("player-melee", {
            start: 0,
            end: 7,
        }),
        frameRate: 30,
        repeat: 0,
    });

    anims.create({
        key: "player-die",
        frames: anims.generateFrameNumbers("player-death", {
            start: 0,
            end: 8,
        }),
        frameRate: 10,
        repeat: 0,
    });
};

