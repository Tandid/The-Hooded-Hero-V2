// @ts-nocheck

import { Socket } from "socket.io-client";
import BaseScene from "../BaseScene";

export default class LobbyScene extends BaseScene {
    charSpriteKey: string;
    socket: Socket;

    constructor(config: any) {
        super("LobbyScene", { ...config, canGoBack: true });
    }

    init(data: any) {
        this.socket = data.socket;
        this.charSpriteKey = data.charSpriteKey;
        this.username = localStorage.getItem("username");
        console.log({ LobbyScene: data });
    }

    create() {
        super.create();
        super.createBackground();

        this.createPage();

        // IMPORTANT: sends message to start room status communication chain
        this.socket.emit("createStaticRooms");

        // Create room buttons
        this.createRoomBtns();
        this.createJoinCustomRoomBtn();
        this.createNewRoomBtn();

        // Interactions with room buttons
        this.createRoomEventListeners();
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
                "CHOOSE A ROOM",
                {
                    fontFamily: "customFont",
                    fontSize: "72px",
                }
            )
            .setOrigin(0.5, 0.5)
            .setColor("#D9B48FFF");

        this.createCloseButton();
    }

    createRoomBtns() {
        // render buttons for rooms in the open lobby
        const rooms = [];
        // when static rooms are created, for each room, create a panel
        this.socket.on("staticRoomsCreated", (staticRooms) => {
            for (let i = 0; i < staticRooms.length; i++) {
                this.add
                    .image(
                        this.config.width * 0.7,
                        150 + 75 * (i + 1),
                        "panel-4"
                    )
                    .setOrigin(0.5)
                    .setScale(0.6, 0.4);

                // render open lobbies with green font, and red if closed
                if (staticRooms[i].isOpen) {
                    rooms[i] = this.add
                        .text(
                            this.config.width * 0.7,
                            150 + 75 * (i + 1),
                            `Server Room ${i + 1}`,
                            {
                                fontFamily: "customFont",
                                fontSize: "40px",
                                fill: "#15855b",
                            }
                        )
                        .setOrigin(0.5);
                } else {
                    rooms[i] = this.add
                        .text(
                            this.config.width * 0.7,
                            150 + 75 * (i + 1),
                            `Room ${i + 1}`,
                            {
                                fontFamily: "customFont",
                                fontSize: "40px",
                                fill: "#FF0000",
                            }
                        )
                        .setOrigin(0.5);
                }

                rooms[i].setInteractive();
                rooms[i].on("pointerover", () => {
                    this.cursorOverFx.play();
                    rooms[i].setFill("#FFF");
                });
                rooms[i].on("pointerout", () => {
                    if (staticRooms[i].isOpen) {
                        rooms[i].setFill("#15855b");
                    }
                });
                rooms[i].on("pointerdown", () => {
                    rooms[i].setTint("0xc2c2c2");
                });
                rooms[i].on("pointerup", () => {
                    this.selectFx.play();
                    this.input.enabled = false;
                    rooms[i].clearTint();
                    if (staticRooms[i].isOpen) {
                        rooms[i].setFill("#15855b");
                    }
                    this.socket.emit("joinRoom", {
                        roomKey: `room${i + 1}`,
                        spriteKey: this.charSpriteKey,
                        username: this.username,
                    });
                });
            }

            // whenever a room closes/opens, the color of the button will update
            this.socket.on("updatedRooms", (staticRooms) => {
                for (let i = 0; i < staticRooms.length; ++i) {
                    // render open lobbies with green font, and red if closed
                    if (rooms[i]) {
                        if (staticRooms[i].isOpen) {
                            rooms[i].setFill("#15855b");
                        } else {
                            rooms[i].setFill("#FF0000");
                        }
                    }
                }
            });
        });
    }

    createJoinCustomRoomBtn() {
        this.add
            .image(
                this.config.width / 3,
                this.config.height / 2 + 75,
                "panel-4"
            )
            .setOrigin(0.5)
            .setScale(1, 0.5)
            .setDepth(2);

        const joinCustomRoom = this.add
            .text(
                this.config.width / 3,
                this.config.height / 2 + 75,
                "Join a Custom Room",
                {
                    fontFamily: "customFont",
                    fontSize: "40px",
                    fill: "#000",
                }
            )
            .setDepth(2)
            .setOrigin(0.5);

        joinCustomRoom.setInteractive();
        joinCustomRoom.on("pointerover", () => {
            this.cursorOverFx.play();
            joinCustomRoom.setFill("#fff", 2);
        });
        joinCustomRoom.on("pointerout", () => {
            joinCustomRoom.setFill("#000", 0);
        });
        joinCustomRoom.on("pointerdown", () => {});
        joinCustomRoom.on("pointerup", () => {
            this.selectFx.play();
            this.input.enabled = false;
            this.socket.removeAllListeners();
            this.scene.stop("LobbyScene");
            this.scene.start("JoinCustomRoomScene", {
                socket: this.socket,
                charSpriteKey: this.charSpriteKey,
                username: this.username,
            });
        });
    }

    createNewRoomBtn() {
        this.add
            .image(
                this.config.width / 3,
                this.config.height / 2 - 75,
                "panel-4"
            )
            .setOrigin(0.5)
            .setScale(1, 0.5)
            .setDepth(2);

        const createRoomButton = this.add
            .text(
                this.config.width / 3,
                this.config.height / 2 - 75,
                "Create New Room",
                {
                    fontFamily: "customFont",
                    fontSize: "40px",
                    fill: "#000",
                }
            )
            .setDepth(2)
            .setOrigin(0.5);

        createRoomButton.setInteractive();
        createRoomButton.on("pointerover", () => {
            this.cursorOverFx.play();
            createRoomButton.setFill("#fff", 2);
        });
        createRoomButton.on("pointerout", () => {
            createRoomButton.setFill("#000", 0);
        });
        createRoomButton.on("pointerdown", () => {});
        createRoomButton.on("pointerup", () => {
            this.selectFx.play();
            this.input.enabled = false;
            this.socket.emit("createRoom");
        });
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
            this.scene.stop("LobbyScene");
        });

        closeBtn.on("pointerover", () => {
            this.cursorOverFx.play();
            closeBtn.setTint(0xff6666);
        });

        closeBtn.on("pointerout", () => {
            closeBtn.clearTint();
        });
    }

    createRoomEventListeners() {
        // Immediately join the custom room that was created
        this.socket.on("roomCreated", (code) => {
            this.socket.emit("joinRoom", {
                roomKey: code,
                spriteKey: this.charSpriteKey,
                username: this.username,
            });
        });

        // Feedback if user clicks on closed room
        this.socket.on("roomClosed", () => {
            this.input.enabled = true;
            const roomClosedText = this.add.text(
                350,
                40,
                "This room is closed",
                {
                    fontFamily: "customFont",
                    fontSize: "40px",
                    fill: "#fff",
                }
            );
            const roomClosedInterval = setInterval(() => {
                roomClosedText.destroy();
                clearInterval(roomClosedInterval);
            }, 3000);
        });

        // Feedback if user clicks on full room
        this.socket.on("roomFull", () => {
            this.input.enabled = true;
            const roomFullText = this.add.text(350, 40, "This room is full", {
                fontFamily: "customFont",
                fontSize: "40px",
                fill: "#fff",
            });
            const roomFullInterval = setInterval(() => {
                roomFullText.destroy();
                clearInterval(roomFullInterval);
            }, 3000);
        });

        // Player will go to stage scene afer receiving room info from server
        this.socket.on("roomInfo", ({ roomInfo, roomKey }) => {
            this.socket.removeAllListeners();
            this.scene.stop("LobbyScene");
            this.scene.start("WaitingScene", {
                socket: this.socket,
                roomInfo,
                roomKey,
                charSpriteKey: this.charSpriteKey,
                username: this.username,
            });
        });
    }
}

