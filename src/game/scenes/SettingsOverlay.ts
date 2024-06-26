// @ts-nocheck

import { Scene } from "phaser";

export default class SettingsOverlay extends Scene {
    currentMusicBars: number;
    maxVolumeBars: number;
    minVolumeBars: number;
    volumeBars: Phaser.GameObjects.Image[];
    inputBlock: Phaser.GameObjects.Rectangle;
    config: any;
    muteBtn: Phaser.GameObjects.Image;
    muteStateImage: Phaser.GameObjects.Image;

    constructor(config) {
        super("SettingsOverlay", { ...config, canGoBack: false });
        this.config = config;
        this.volumeBars = [];
    }

    init() {
        this.currentMusicBars = Math.ceil(this.sound.volume * 10);
        this.maxVolumeBars = 10;
        this.minVolumeBars = 0;
    }

    create() {
        this.createInputBlock(); // Prevents click events behind the overlay from happening

        this.addSoundEffects();

        this.createPage();

        this.createMusicController();
        this.createMuteButton();
        this.createMusicBars();
    }

    createInputBlock() {
        this.inputBlock = this.add
            .rectangle(
                this.config.width / 2,
                this.config.height / 2,
                this.config.width,
                this.config.height,
                0x000000,
                50 // fully transparent
            )
            .setOrigin(0.5)
            .setInteractive()
            .setDepth(-1);

        this.inputBlock.on("pointerdown", (pointer, localX, localY, event) => {
            event.stopPropagation();
        });
    }

    createPage() {
        this.add
            .image(this.config.width / 2, this.config.height / 2, "panel-2")
            .setOrigin(0.5)
            .setScale(0.7);

        this.add
            .image(
                this.config.width / 2,
                this.config.height / 2 - 50,
                "panel-4"
            )
            .setOrigin(0.5)
            .setScale(1.3, 0.5);

        this.add
            .image(
                this.config.width / 2,
                this.config.height / 2 + 50,
                "panel-4"
            )
            .setOrigin(0.5)
            .setScale(1.3, 0.5);

        this.add
            .image(
                this.config.width / 2,
                this.config.height / 2 + 150,
                "panel-4"
            )
            .setOrigin(0.5)
            .setScale(0.75, 0.5);

        this.add
            .image(
                this.config.width / 2,
                this.config.height / 6,
                "header-shadow"
            )
            .setOrigin(0.5)
            .setScale(0.9);

        this.add
            .image(this.config.width / 2, this.config.height / 6, "header")
            .setOrigin(0.5)
            .setScale(0.9);

        this.add
            .text(this.config.width / 2, this.config.height / 6, "SETTINGS", {
                fontFamily: "customFont",
                fontSize: "72px",
            })
            .setOrigin(0.5, 0.5)
            .setColor("#D9B48FFF");

        this.add
            .image(
                this.config.width / 3 + 50,
                this.config.height / 2 - 50,
                "music-btn-on"
            )
            .setOrigin(0.5)
            .setScale(0.8);
        this.add
            .image(
                this.config.width / 3 + 50,
                this.config.height / 2 + 50,
                "sound-btn-on"
            )
            .setOrigin(0.5)
            .setScale(0.8);

        this.add
            .image(
                this.config.width / 2 - 100,
                this.config.height / 2 + 150,
                "mute-btn-on"
            )
            .setOrigin(0.5)
            .setScale(0.8);

        this.createCloseButton();
    }

    addSoundEffects() {
        this.cursorOver = this.sound.add("cursorOver");
        this.cursorOver.volume = 0.4;

        this.select = this.sound.add("select");
        this.select.volume = 0.4;

        this.pageFlip = this.sound.add("page-flip");
        this.pageFlip.volume = 0.4;
    }

    createCloseButton() {
        const closeBtn = this.add
            .image(
                this.config.width * 0.75 + 20,
                this.config.height / 7 + 20,
                "close-btn"
            )
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive()
            .setDepth(2);

        closeBtn.on("pointerup", () => {
            console.log(this.scene.isActive("MainMenu"));
            console.log(this.scene.isActive("SettingsOverlay"));

            this.select.play();
            this.scene.stop("SettingsOverlay");
            this.scene.isPaused("PlayScene") === true
                ? this.scene.resume("PlayScene")
                : "";
        });

        closeBtn.on("pointerover", () => {
            this.cursorOver.play();
            closeBtn.setTint(0xff6666);
        });

        closeBtn.on("pointerout", () => {
            closeBtn.clearTint();
        });
    }

    createMuteButton() {
        this.muteBtn = this.add
            .image(
                this.config.width / 2 + 50,
                this.config.height / 2 + 150,
                "switch-off-bg"
            )
            .setOrigin(0.5)
            .setScale(1.3, 0.9)
            .setInteractive();

        this.updateMuteStateImage();

        this.muteBtn.on("pointerup", () => {
            this.select.play();
            this.toggleMute();
        });
        this.muteBtn.on("pointerover", () => {
            this.muteBtn.setTint(0xc2c2c2);
            this.cursorOver.play();
        });
        this.muteBtn.on("pointerout", () => {
            this.muteBtn.clearTint();
        });
    }

    updateMuteStateImage() {
        if (this.muteStateImage) {
            this.muteStateImage.destroy();
        }

        const imageKey = this.sound.mute ? "switch-off" : "switch-on";
        if (imageKey === "switch-off") {
            this.muteStateImage = this.add
                .image(
                    this.config.width / 2,
                    this.config.height / 2 + 150,
                    imageKey
                )
                .setOrigin(0.5)
                .setScale(0.8);
        } else {
            this.muteStateImage = this.add
                .image(
                    this.config.width / 2 + 100,
                    this.config.height / 2 + 150,
                    imageKey
                )
                .setOrigin(0.5)
                .setScale(0.8);
        }
    }

    createMusicController() {
        this.createIncrementBtn(
            this.config.width / 2 + 200,
            this.config.height / 2 - 50
        );
        this.createDecrementBtn(
            this.config.width / 2 - 100,
            this.config.height / 2 - 50
        );
    }

    createDecrementBtn(width, height) {
        const volumeDownBtn = this.add
            .image(width, height, "prev-btn")
            .setOrigin(0.5)
            .setScale(0.5)
            .setInteractive();

        volumeDownBtn.on("pointerup", () => {
            this.select.play();
            this.decreaseVolume();
        });
        volumeDownBtn.on("pointerover", () => {
            volumeDownBtn.setTintFill(0xc2c2c2);
            this.cursorOver.play();
        });
        volumeDownBtn.on("pointerout", () => {
            volumeDownBtn.clearTint();
        });
    }

    createIncrementBtn(width, height) {
        const volumeUpBtn = this.add
            .image(width, height, "next-btn")
            .setOrigin(0.5)
            .setScale(0.5)
            .setInteractive();

        volumeUpBtn.on("pointerup", () => {
            this.select.play();
            this.increaseVolume();
        });

        volumeUpBtn.on("pointerover", () => {
            volumeUpBtn.setTintFill(0xc2c2c2);
            this.cursorOver.play();
        });

        volumeUpBtn.on("pointerout", () => {
            volumeUpBtn.clearTint();
        });
    }

    // Volume bar creation
    createMusicBars() {
        // Clear existing bars
        this.volumeBars.forEach((bar) => bar.destroy());
        this.volumeBars = [];

        const barWidth = 25;
        let width = this.config.width / 2 - 65;
        let height = this.config.height / 2 - 50;
        for (let i = 0; i < this.currentMusicBars; i++) {
            this.volumeBars.push(this.createVolumeBar(width, height));
            width += barWidth;
        }
    }

    createVolumeBar(width, height) {
        return this.add
            .image(width, height, "yellow-bar")
            .setOrigin(0.5)
            .setScale(0.7);
    }

    // Volume control methods
    increaseVolume() {
        if (this.currentMusicBars < this.maxVolumeBars) {
            this.currentMusicBars += 1;
            this.sound.volume = Phaser.Math.Clamp(
                this.sound.volume + 0.1,
                0,
                1
            );
            this.createMusicBars();
        }
    }

    decreaseVolume() {
        if (this.currentMusicBars > this.minVolumeBars) {
            this.currentMusicBars -= 1;
            this.sound.volume = Phaser.Math.Clamp(
                this.sound.volume - 0.1,
                0,
                1
            );
            this.createMusicBars();
        }
    }

    toggleMute() {
        this.sound.mute = !this.sound.mute;
        this.updateMuteStateImage();
    }
}

