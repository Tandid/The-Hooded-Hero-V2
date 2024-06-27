export default (anims) => {
  anims.create({
    key: "spider-run",
    frames: anims.generateFrameNumbers("spider", { start: 0, end: 15 }),
    frameRate: 15,
    repeat: -1,
  });

  anims.create({
    key: "spider-die",
    frames: anims.generateFrameNumbers("spider-death", { start: 0, end: 10 }),
    frameRate: 10,
    repeat: 0,
  });
};
