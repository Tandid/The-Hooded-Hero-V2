// @ts-nocheck

import PlayerConfig from "../../../utils/PlayerConfig";
import BaseScene from "../BaseScene";

class CharSelectionScene extends BaseScene {
    constructor(config: any) {
        super("CharSelectionScene", { ...config, canGoBack: true });
    }

    create() {
        super.create();
        super.createBackground();

        this.createPage();

        this.createSprite();
    }

    createPage() {
        this.add
            .image(this.config.width / 2, this.config.height / 2, "panel-2")
            .setOrigin(0.5)
            .setScale(1, 0.7);

        this.add
            .image(this.config.width / 2, this.config.height / 6, "header")
            .setOrigin(0.5)
            .setScale(1.5, 0.9);

        this.add
            .text(
                this.config.width / 2,
                this.config.height / 6,
                "CHOOSE A HERO",
                {
                    fontFamily: "customFont",
                    fontSize: "72px",
                }
            )
            .setOrigin(0.5, 0.5)
            .setColor("#D9B48FFF");

        this.createCloseButton();
    }

    createCloseButton() {
        const closeBtn = this.add
            .image(
                this.config.width / 1.1 - 20,
                this.config.height / 7 + 20,
                "close-btn"
            )
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive()
            .setDepth(2);

        closeBtn.on("pointerup", () => {
            this.selectFx.play();
            this.scene.wake("MainMenu");
            this.scene.stop("CharSelectionScene");
        });

        closeBtn.on("pointerover", () => {
            this.cursorOverFx.play();
            closeBtn.setTint(0xff6666);
        });

        closeBtn.on("pointerout", () => {
            closeBtn.clearTint();
        });
    }

    createSprite() {
        const playerConfig = new PlayerConfig(this);
        playerConfig.createPlayerAnimations("player-1");
        playerConfig.createPlayerAnimations("player-2");
        playerConfig.createPlayerAnimations("player-3");
        playerConfig.createPlayerAnimations("player-4");

        const charSpriteArr = ["player-1", "player-2", "player-3", "player-4"];
        charSpriteArr.forEach((key, i) => {
            const bg = this.add
                .image(
                    this.config.width * 0.15 * (i + 1) + 150,
                    this.config.height / 2 + 10,
                    "panel-4"
                )
                .setOrigin(0.5)
                .setScale(0.43, 1.2);

            const player = this.add
                .sprite(
                    this.config.width * 0.15 * (i + 1) + 150,
                    this.config.height / 2,
                    key
                )
                .setScale(1)
                .setInteractive();

            player.play(`idle-${key}`, true);

            player.on("pointerover", () => {
                player.play(`run-${key}`, true);
                this.cursorOverFx.play();
                bg.setTint("0xc2c2c2");
                bg.setScale(0.45, 1.25);
            });
            player.on("pointerout", () => {
                player.play(`idle-${key}`, true);
                this.cursorOverFx.stop();
                bg.clearTint();
                bg.setScale(0.43, 1.2);
            });

            player.on("pointerdown", () => {
                this.selectFx.play();
            });

            player.on("pointerup", () => {
                this.scene.stop("CharSelectionScene");
                this.scene.start("LobbyScene", {
                    charSpriteKey: key,
                });
            });
        });
    }
}

export default CharSelectionScene;

