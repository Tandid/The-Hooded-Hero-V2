export default (anims) => {
  anims.create({
    key: "slime-run",
    frames: anims.generateFrameNumbers("slime", { start: 0, end: 11 }),
    frameRate: 15,
    repeat: -1,
  });

  anims.create({
    key: "slime-die",
    frames: anims.generateFrameNumbers("slime-death", { start: 0, end: 12 }),
    frameRate: 10,
    repeat: 0,
  });
};
