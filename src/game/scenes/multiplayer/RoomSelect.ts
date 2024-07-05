// @ts-nocheck

import { Socket } from "socket.io-client";
import BaseScene from "../BaseScene";

export default class RoomSelectScene extends BaseScene {
    charSpriteKey: string;
    socket: Socket;

    constructor(config: any) {
        super("RoomSelectScene", { ...config, canGoBack: true });
    }

    init(data: any) {
        this.socket = data.socket;
        this.charSpriteKey = data.charSpriteKey;
        this.username = localStorage.getItem("username");
        console.log({ RoomSelectScene: data });
    }

    create() {
        super.create();
        super.createBackground();

        this.setupUI();

        // IMPORTANT: sends message to start room status communication chain
        this.socket.emit("createStaticRooms");

        // Create room buttons
        this.createNewRoomBtns();
        this.createJoinCustomRoomBtn();
        this.createNewRoomBtn();

        // Interactions with room buttons
        this.createRoomEventListeners();
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

    createNewRoomBtns() {
        // render buttons for rooms in the open lobby
        const rooms = [];
        // when static rooms are created, for each room, create a panel

        this.socket.on("staticRoomsCreated", (staticRooms) => {
            for (let i = 0; i < staticRooms.length; i++) {
                // Create room buttons for each static room
                const panel = this.add
                    .image(
                        this.config.width * 0.7,
                        150 + 75 * (i + 1),
                        "panel-4"
                    )
                    .setScale(1, 0.4);

                const playersPerRoom = this.add
                    .text(
                        this.config.width * 0.8 + 20,
                        150 + 75 * (i + 1),
                        `(${staticRooms[i].numPlayers}/4)`,
                        {
                            fontFamily: "customFont",
                            fontSize: "30px",
                            fill: staticRooms[i].isOpen ? "#15855b" : "#FF0000",
                        }
                    )
                    .setOrigin(0.5);

                rooms[i] = this.add
                    .text(
                        this.config.width * 0.7 - 50,
                        150 + 75 * (i + 1),
                        `Server Room ${i + 1}`,
                        {
                            fontFamily: "customFont",
                            fontSize: "40px",
                            fill: staticRooms[i].isOpen ? "#15855b" : "#FF0000",
                        }
                    )
                    .setOrigin(0.5);

                rooms[i].setInteractive();
                rooms[i].on("pointerover", () => {
                    this.cursorOverFx.play();
                    rooms[i].setFill("#FFF");
                    this.game.canvas.classList.add("custom-cursor");
                });

                rooms[i].on("pointerout", () => {
                    this.game.canvas.classList.remove("custom-cursor");
                    if (staticRooms[i].isOpen) {
                        rooms[i].setFill("#15855b");
                    }
                });

                rooms[i].on("pointerdown", () => {
                    rooms[i].setTint("0xc2c2c2");
                });

                rooms[i].on("pointerup", () => {
                    this.selectFx.play();
                    this.game.canvas.classList.remove("custom-cursor");
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
            this.socket.on("updateRooms", (staticRooms) => {
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
        this.createLongButton(
            "Join Custom Room",
            this.config.width / 3,
            this.config.height / 2 + 75,
            () => {
                this.socket.removeAllListeners();
                this.scene.stop("RoomSelectScene");
                this.scene.start("JoinCustomRoomScene", {
                    socket: this.socket,
                    charSpriteKey: this.charSpriteKey,
                    username: this.username,
                });
            }
        );
    }

    createNewRoomBtn() {
        this.createLongButton(
            "Create New Room",
            this.config.width / 3,
            this.config.height / 2 - 75,
            () => {
                this.socket.emit("createNewRoom");
            }
        );
    }

    createCloseButton() {
        this.createButton(
            this.config.width / 1.1 - 20,
            this.config.height / 7 + 20,
            "close-btn",
            () => {
                this.selectFx.play();
                this.scene.wake("MainMenu");
                this.scene.stop("RoomSelectScene");
            }
        );
    }

    createRoomEventListeners() {
        // Immediately join the custom room that was created
        this.socket.on("newRoomCreated", (code) => {
            this.socket.emit("joinRoom", {
                roomKey: code,
                spriteKey: this.charSpriteKey,
                username: this.username,
            });
        });

        // Feedback if user clicks on closed room
        this.socket.on("roomClosed", () => {
            this.input.enabled = true;
            this.displayFeedbackMessage.call(this, "This room is closed");
        });

        // Feedback if user clicks on full room
        this.socket.on("roomFull", () => {
            this.input.enabled = true;
            this.displayFeedbackMessage.call(this, "This room is full");
        });

        // Player will go to stage scene afer receiving room info from server
        this.socket.on("roomReady", ({ currentRoom, roomKey }) => {
            this.socket.removeAllListeners();
            this.scene.stop("RoomSelectScene");
            this.scene.start("WaitingScene", {
                socket: this.socket,
                currentRoom,
                roomKey,
                charSpriteKey: this.charSpriteKey,
                username: this.username,
            });
        });
    }

    // Helper function to display feedback messages
    displayFeedbackMessage = (message) => {
        const feedbackText = this.add
            .text(this.config.width / 2, this.config.height - 75, message, {
                fontFamily: "customFont",
                fontSize: "40px",
                fill: "#FF0000",
            })
            .setOrigin(0.5);

        const feedbackInterval = setInterval(() => {
            feedbackText.destroy();
            clearInterval(feedbackInterval);
        }, 3000);
    };
}

