// @ts-nocheck

import RexUIConfig from "../../../utils/RexUIConfig";
import BaseScene from "../BaseScene";

class JoinCustomRoomScene extends BaseScene {
    constructor(config) {
        super("JoinCustomRoomScene", { ...config, canGoBack: true });
        this.config = config;
    }

    init(data) {
        this.socket = data.socket;
        this.charSpriteKey = data.charSpriteKey;
        this.username = data.username;
    }

    create() {
        super.create();

        this.cursorOver = this.sound.add("cursorOver");
        this.cursorOver.volume = 0.4;

        this.select = this.sound.add("select");
        this.select.volume = 0.4;

        this.flute = this.sound.add("flute");
        this.flute.volume = 0.4;

        this.createCloseButton();

        this.add
            .image(this.config.width / 2, this.config.height / 2, "panel-2")
            .setOrigin(0.5)
            .setScale(0.7);

        this.add
            .text(
                this.config.width / 2,
                this.scale.height / 2 - 150,
                "Enter Room Code",
                {
                    fontFamily: "customFont",
                    fontSize: "72px",
                    color: "#000",
                }
            )
            .setOrigin(0.5);

        const rexUIConfig = new RexUIConfig(this);
        rexUIConfig.createTextBox(
            this.config.width / 2,
            this.config.height / 2 - 25,
            {
                fontFamily: "customFont",
                textColor: 0xffffff,
                fontSize: "40px",
                fixedWidth: 300,
                fixedHeight: 80,
            }
        );

        const joinButton = this.add
            .text(
                this.config.width / 2,
                this.config.height / 2 + 100,
                "Join Room",
                {
                    fontFamily: "customFont",
                    fontSize: "60px",
                    fill: "#000",
                }
            )
            .setOrigin(0.5);

        joinButton.setInteractive();
        joinButton.on("pointerover", () => {
            joinButton.setFill("#fff");
            this.cursorOver.play();
        });
        joinButton.on("pointerout", () => {
            joinButton.setFill("#000");
            this.cursorOver.stop();
        });
        joinButton.on("pointerdown", () => {
            this.select.play();
        });
        joinButton.on("pointerup", () => {
            this.input.enabled = false;
            const textbox = rexUIConfig.scene.input.displayList.list.find(
                (e) => e.type === "rexBBCodeText"
            );
            this.socket.emit("joinRoom", {
                roomKey: textbox._text.toUpperCase(),
                spriteKey: this.charSpriteKey,
                username: this.username,
            });
        });

        this.socket.on("roomDoesNotExist", () => {
            this.input.enabled = true;
            const roomDNE = this.add
                .text(
                    this.config.width / 2,
                    this.config.height / 2 + 300,
                    "This room does not exist",
                    {
                        fontFamily: "customFont",
                        fontSize: "30px",
                        fill: "#ff6666",
                    }
                )
                .setOrigin(0.5);
            const roomDNEInterval = setInterval(() => {
                roomDNE.destroy();
                clearInterval(roomDNEInterval);
            }, 3000);
        });

        this.socket.on("roomClosed", () => {
            this.input.enabled = true;
            const roomClosedText = this.add
                .text(
                    this.config.width / 2,
                    this.config.height / 2 + 300,
                    "This room is closed",
                    {
                        fontFamily: "customFont",
                        fontSize: "30px",
                        fill: "#ff6666",
                    }
                )
                .setOrigin(0.5);
            const roomClosedInterval = setInterval(() => {
                roomClosedText.destroy();
                clearInterval(roomClosedInterval);
            }, 3000);
        });

        this.socket.on("roomFull", () => {
            this.input.enabled = true;
            const roomFullText = this.add.text(
                this.config.width / 2,
                this.config.height / 2 + 300,
                "This room is full",
                {
                    fontFamily: "customFont",
                    fontSize: "30px",
                    fill: "#ff6666",
                }
            );
            const roomFullInterval = setInterval(() => {
                roomFullText.destroy();
                clearInterval(roomFullInterval);
            }, 3000);
        });

        this.socket.on("roomInfo", ({ roomInfo, roomKey }) => {
            this.socket.removeAllListeners();
            //   this.game.music.stopAll();
            this.scene.stop("JoinCustomRoomScene");
            this.scene.start("WaitingScene", {
                socket: this.socket,
                roomInfo,
                roomKey,
                charSpriteKey: this.charSpriteKey,
                username: this.username,
            });
        });
    }

    createCloseButton() {
        const closeBtn = this.add
            .image(
                this.config.width / 1.25 - 30,
                this.config.height / 7 + 20,
                "close-btn"
            )
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive()
            .setDepth(2);

        closeBtn.on("pointerup", () => {
            this.select.play();
            this.scene.wake("MenuScene");
            this.scene.stop("JoinCustomRoomScene");
        });

        closeBtn.on("pointerover", () => {
            this.cursorOver.play();
            closeBtn.setTint(0xff6666);
        });

        closeBtn.on("pointerout", () => {
            closeBtn.clearTint();
        });
    }
}

export default JoinCustomRoomScene;

