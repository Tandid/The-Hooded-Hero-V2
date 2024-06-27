export default (anims) => {
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

