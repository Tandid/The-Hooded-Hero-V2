// @ts-nocheck

import { Socket } from "socket.io-client";
import initAnimations from "../../../animations/entities/onlinePlayerAnims";
import BaseScene from "../BaseScene";

class HeroSelectScene extends BaseScene {
    socket: Socket;
    constructor(config: any) {
        super("HeroSelectScene", { ...config, canGoBack: true });
    }

    init(data) {
        // console.log(BaseScene.socket); //!! This is in case I want to test static socket, but this might be bad later down the line
        this.socket = data.socket;
        initAnimations(this.anims);
    }

    create() {
        super.create();
        super.createBackground();

        this.setupUI();

        this.createSprite();
    }

    setupUI() {
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
        this.createButton(
            this.config.width / 1.1 - 20,
            this.config.height / 7 + 20,
            "close-btn",
            () => {
                this.selectFx.play();
                this.scene.wake("MainMenu");
                this.scene.stop("HeroSelectScene");
            }
        );
    }

    createSprite() {
        const charSpriteArr = ["player-1", "player-2", "player-3", "player-4"];

        charSpriteArr.forEach((key, i) => {
            const bg = this.add
                .image(
                    this.config.width * 0.15 * (i + 1) + 150,
                    this.config.height / 2 + 10,
                    "panel-4"
                )
                .setScale(0.43, 1.2);

            const player = this.add
                .sprite(
                    this.config.width * 0.15 * (i + 1) + 150,
                    this.config.height / 2,
                    key
                )
                .setInteractive();

            player.play(`idle-${key}`, true);

            player.on("pointerover", () => {
                this.game.canvas.classList.add("custom-cursor");
                player.play(`run-${key}`, true);
                this.cursorOverFx.play();
                bg.setTint("0xc2c2c2");
                bg.setScale(0.45, 1.25);
            });
            player.on("pointerout", () => {
                this.game.canvas.classList.remove("custom-cursor");
                player.play(`idle-${key}`, true);
                this.cursorOverFx.stop();
                bg.clearTint();
                bg.setScale(0.43, 1.2);
            });

            player.on("pointerdown", () => {
                this.selectFx.play();
            });

            player.on("pointerup", () => {
                this.game.canvas.classList.remove("custom-cursor");
                this.scene.stop("HeroSelectScene");
                this.scene.start("RoomSelectScene", {
                    socket: this.socket,
                    charSpriteKey: key,
                });
            });
        });
    }
}

export default HeroSelectScene;

