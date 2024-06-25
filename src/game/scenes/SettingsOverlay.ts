// @ts-nocheck

import { Scene } from "phaser";

export class SettingsOverlay extends Scene {
    menu: any[];

    constructor(config) {
        super("SettingsOverlay", { ...config, canGoBack: false });
        this.config = { width: 1280, height: 720 };
    }

    init() {
        this.currentMusicBars = Math.ceil(this.sound.volume * 10);
        this.maxVolumeBars = 10;
        this.minVolumeBars = 0;
    }

    create() {
        this.createPage();
        this.addSoundEffects();
        this.createCloseButton();

        this.createMusicControl();
        this.createMuteButton();
        this.createMusicBars();
    }

    createPage() {
        console.log(this.sound.volume);
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
        const muteBtn = this.add
            .image(
                this.config.width / 2 + 50,
                this.config.height / 2 + 150,
                "switch-off-bg"
            )
            .setOrigin(0.5)
            .setScale(1.3, 0.9)
            .setInteractive();

        if (this.toggleMute === false) {
            const switchOn = this.add
                .image(
                    this.config.width / 2 + 100,
                    this.config.height / 2 + 150,
                    "switch-on"
                )
                .setOrigin(0.5)
                .setScale(0.8);
        } else {
            const switchOn = this.add
                .image(
                    this.config.width / 2 + 100,
                    this.config.height / 2 + 150,
                    "switch-off"
                )
                .setOrigin(0.5)
                .setScale(0.8);
        }

        muteBtn.on("pointerup", () => {
            this.select.play();
            this.toggleMute();
            // this.toggleMute(!this.toggleMute);
        });
        muteBtn.on("pointerover", () => {
            muteBtn.setTint(0xc2c2c2);
            this.cursorOver.play();
        });
        muteBtn.on("pointerout", () => {
            muteBtn.clearTint();
        });
    }

    createMusicControl() {
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
            if (this.currentMusicBars > this.minVolumeBars) {
                this.currentMusicBars -= 1;
            }
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
        let barWidth = 25;

        const volumeUpBtn = this.add
            .image(width, height, "next-btn")
            .setOrigin(0.5)
            .setScale(0.5)
            .setInteractive();

        volumeUpBtn.on("pointerup", () => {
            this.select.play();
            this.increaseVolume();
            if (this.currentMusicBars < this.maxVolumeBars) {
                this.currentMusicBars += 1;
            }
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
        const barWidth = 25;
        let width = this.config.width / 2 - 65;
        let height = this.config.height / 2 - 50;
        for (let i = 0; i < this.currentMusicBars; i++) {
            this.createVolumeBar(width, height);
            width += barWidth;
        }
    }

    createVolumeBar(width, height) {
        this.add
            .image(width, height, "yellow-bar")
            .setOrigin(0.5)
            .setScale(0.7);
    }

    // Volume control methods
    increaseVolume() {
        this.sound.volume = Phaser.Math.Clamp(this.sound.volume + 0.1, 0, 1);
        console.log("Volume increased to:", this.sound.volume);
    }

    decreaseVolume() {
        this.sound.volume = Phaser.Math.Clamp(this.sound.volume - 0.1, 0, 1);
        console.log("Volume decreased to:", this.sound.volume);
    }

    toggleMute() {
        this.sound.mute = !this.sound.mute;
        console.log(
            "Mute toggled. Current state:",
            this.sound.mute ? "Muted" : "Unmuted"
        );
    }

    update() {
        this.createMusicBars();
    }
}

