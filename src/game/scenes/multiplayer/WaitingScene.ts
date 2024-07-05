// @ts-nocheck

import initAnims from "../../../animations";
import OnlinePlayer from "../../../entities/OnlinePlayer";
import BaseScene from "../BaseScene";
// import EventEmitter from "../events/Emitter";

class WaitingScene extends BaseScene {
    constructor(config) {
        super("WaitingScene", config);
        this.config = config;
        this.stageKey = "lobby";
        this.opponents = {};
        this.requiredPlayers = 4;
    }

    init(data) {
        this.socket = data.socket;
        this.currentRoom = data.currentRoom;
        this.roomKey = data.roomKey;
        this.charSpriteKey = data.charSpriteKey;
        this.username = data.username;
        console.log({ Waiting: data });
    }

    create() {
        super.create();

        const map = this.createMap();
        initAnims(this.anims);

        const layers = this.createLayers(map);
        const playerZones = this.getPlayerZones(layers.playerZones);
        const player = this.createPlayer(playerZones.start);
        this.player = player;
        console.log({ Me: this.player });

        this.createBG(map);

        this.usernameText = this.add
            .text(this.player.x, this.player.y, this.username, {
                fontSize: "40px",
                fill: "#fff",
            })
            .setOrigin(0.5, 1)
            .setDepth(2);

        this.createPlayerColliders(player, {
            colliders: {
                platformsColliders: layers.platformsColliders,
            },
        });

        this.setupUI();

        this.setupFollowupCameraOn(player);
        this.createRoomKey();

        const countdown = this.add
            .text(1200, this.config.height / 5 + 200, `5`, {
                fontFamily: "customFont",
                fontSize: "0px",
                fill: "#fff",
            })
            .setOrigin(0.5)
            .setDepth(2);

        Object.keys(this.currentRoom.players).forEach((playerId) => {
            if (playerId !== this.socket.id) {
                const { spriteKey, username } =
                    this.currentRoom.players[playerId];
                this.opponents[playerId] = new OnlinePlayer(
                    this,
                    playerZones.start.x,
                    playerZones.start.y,
                    spriteKey,
                    username,
                    this.socket,
                    false
                );
                this.opponents[playerId].body.setAllowGravity(false);

                this[`opponents${playerId}`] = this.add
                    .text(
                        this.opponents[playerId].x + 90,
                        this.opponents[playerId].y - 160,
                        username,
                        {
                            fontSize: "40px",
                            fill: "#fff",
                        }
                    )
                    .setOrigin(0.5, 1);
            }
        });

        this.socket.on("newPlayerJoined", ({ playerId, playerInfo }) => {
            if (!this.currentRoom.players[playerId]) {
                this.currentRoom.numPlayers += 1;
                this.currentRoom.players[playerId] = playerInfo; // { username, spriteKey }
                this.opponents[playerId] = new OnlinePlayer(
                    this,
                    playerZones.start.x,
                    playerZones.start.y,
                    this.currentRoom.players[playerId].spriteKey,
                    this.currentRoom.players[playerId].username,
                    this.socket,
                    false
                );
                this.opponents[playerId].body.setAllowGravity(false);
            }

            console.log({ Opponent: this.opponents[playerId] });

            if (this.currentRoom.numPlayers === this.requiredPlayers) {
                this.waitingForPlayers.setFontSize("0px");
                this.startButton.setText("Start");
            }

            this.waitingForPlayers.setText(
                `Waiting for ${
                    this.requiredPlayers - this.currentRoom.numPlayers
                } player(s)`
            );

            this.playerCounter.setText(
                `${this.currentRoom.numPlayers} player(s) in lobby`
            );

            this[`opponents${playerId}`] = this.add
                .text(
                    this.opponents[playerId].x,
                    this.opponents[playerId].y,
                    this.currentRoom.players[playerId].username,
                    {
                        fontSize: "40px",
                        fill: "#fff",
                    }
                )
                .setOrigin(0.5, 1);
        });

        this.socket.on("playerLeft", ({ playerId }) => {
            // remove opponent from opponent list
            if (this.opponents[playerId]) {
                this.opponents[playerId].destroy(); // remove opponent's game object
                delete this.opponents[playerId]; // remove opponent's key-value pair
                this[`opponents${playerId}`].destroy(); // remove opponent's name
            }

            // remove opponent from player list
            if (this.currentRoom.players[playerId]) {
                delete this.currentRoom.players[playerId];
                this.currentRoom.numPlayers -= 1;

                // show waiting message if player num becomes lower than required num for starting game
                if (this.currentRoom.numPlayers < this.requiredPlayers) {
                    this.waitingForPlayers.setText(
                        `Waiting for ${
                            this.requiredPlayers - this.currentRoom.numPlayers
                        } player(s)`
                    );
                    this.waitingForPlayers.setFontSize("100px");
                    this.startButton.setText("");
                }
            }

            // update display for player num in the room
            this.playerCounter.setText(
                `${this.currentRoom.numPlayers} player(s) in lobby`
            );
        });

        this.socket.on("playerMoved", ({ playerId, moveState }) => {
            if (this.opponents[playerId]) {
                this.opponents[playerId].updateOtherPlayer(moveState);
                this[`opponents${playerId}`].setX(this.opponents[playerId].x);
                this[`opponents${playerId}`].setY(this.opponents[playerId].y);
            }
        });

        this.socket.on("updateCountdown", (timeLeft) => {
            if (this.startButton) {
                this.startButton.destroy();
            }
            countdown.setFontSize("100px");
            countdown.setText(`${timeLeft}`);
        });

        this.socket.on("loadLevel", (roomData) => {
            this.socket.removeAllListeners();
            this.cameras.main.fadeOut(500, 0, 0, 0);

            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    const nextStageKey = "lobby";
                    this.scene.stop("WaitingScene");
                    this.scene.start(nextStageKey, {
                        socket: this.socket,
                        roomData,
                        charSpriteKey: this.charSpriteKey,
                        username: this.username,
                    });
                },
            });
        });
    }

    setupUI() {
        this.createHomeButton();
        this.createSettingsButton();
        this.createControlsButton();
        this.setupPlayerCounter();
        this.createStartButton();
    }

    createStartButton() {
        this.startButton = this.add
            .text(1200, this.config.height / 5 + 200, "", {
                fontFamily: "customFont",
                fontSize: "200px",
                fill: "#000",
            })
            .setOrigin(0.5)
            .setDepth(2);

        this.startButton.setInteractive();
        this.startButton.on("pointerover", () => {
            this.startButton.setFill("#fff");
        });
        this.startButton.on("pointerout", () => {
            this.startButton.setFill("#000");
        });
        this.startButton.on("pointerup", () => {
            this.input.enabled = false;
            this.socket.emit("startCountdown");
            this.startButton.destroy();
        });

        // renders start button when there are 4 or more players in lobby;
        if (this.currentRoom.numPlayers >= this.requiredPlayers) {
            this.startButton.setText("Start");
        }
    }

    setupPlayerCounter() {
        this.playerCounter = this.add
            .text(
                1200,
                this.config.height / 5,
                `${this.currentRoom.numPlayers} player(s) in lobby`,
                {
                    fontFamily: "customFont",
                    fontSize: "100px",
                    fill: "#000",
                }
            )
            .setOrigin(0.5)
            .setDepth(2);

        this.waitingForPlayers = this.add
            .text(
                1200,
                this.config.height / 5 + 100,
                `Waiting for ${
                    this.requiredPlayers - this.currentRoom.numPlayers
                } player(s)`,
                {
                    fontFamily: "customFont",
                    fontSize: "0px",
                    fill: "#fff",
                }
            )
            .setOrigin(0.5);

        if (this.currentRoom.numPlayers < this.requiredPlayers) {
            this.waitingForPlayers.setFontSize("100px");
        }
    }

    createMap() {
        const map = this.make.tilemap({ key: this.stageKey });
        map.addTilesetImage("tileset_1", "forest-tiles");
        map.addTilesetImage("tileset_2", "cave-tiles");
        map.addTilesetImage("environment", "environment-tiles");
        map.addTilesetImage("house_inside_4", "house-tiles");

        return map;
    }

    createLayers(map) {
        const tileset1 = map.getTileset("tileset_1");
        const tileset2 = map.getTileset("tileset_2");
        const tileset3 = map.getTileset("environment");
        const tileset4 = map.getTileset("house_inside_4");

        const platformsColliders = map.createLayer("platforms_colliders", [
            tileset1,
            tileset2,
            tileset3,
        ]);

        const environment = map
            .createLayer("environment", [tileset3, tileset4])
            .setDepth(-4);

        const platforms = map.createLayer("platforms", [
            tileset1,
            tileset2,
            tileset3,
            tileset4,
        ]);
        const playerZones = map.getObjectLayer("player_zones");

        platformsColliders
            .setCollisionByProperty({ collides: true })
            .setAlpha(0);

        return {
            environment,
            platforms,
            platformsColliders,
            playerZones,
        };
    }

    createBG(map) {
        const bgObject = map.getObjectLayer("distance_bg").objects[0];

        this.forestImageOne = this.add
            .tileSprite(
                bgObject.x,
                bgObject.y,
                this.config.width * 3,
                bgObject.height * 1.75,
                "bg-forest-1"
            )
            .setOrigin(0.5)
            .setDepth(-10)
            .setScale(1)
            .setScrollFactor(0, 1);

        this.forestImageTwo = this.add
            .tileSprite(
                0,
                300,
                this.config.width + 3000,
                this.config.height + 800,
                "bg-forest-2"
            )
            .setOrigin(0.5, 0)
            .setDepth(-11)
            .setScale(1)
            .setScrollFactor(0, 1);

        this.forestImageThree = this.add
            .tileSprite(
                0,
                300,
                this.config.width + 3000,
                this.config.height + 800,
                "bg-forest-3"
            )
            .setOrigin(0.5, 0)
            .setDepth(-12)
            .setScale(1)
            .setScrollFactor(0, 1);

        this.mountainImage = this.add
            .tileSprite(
                0,
                200,
                this.config.width + 3000,
                this.config.height + 800,
                "mountain-bg"
            )
            .setOrigin(0.5, 0)
            .setDepth(-13)
            .setScale(1)
            .setScrollFactor(0, 1);

        this.skyImage = this.add
            .tileSprite(
                0,
                0,
                this.config.width + 3000,
                this.config.height + 800,
                "sky-bg"
            )
            .setOrigin(0.5, 0)
            .setDepth(-14)
            .setScale(1)
            .setScrollFactor(0, 1);
    }

    createSettingsButton() {
        this.settingsButton = this.createButton(
            this.config.rightBottomCorner.x - 50,
            this.config.rightBottomCorner.y - 50,
            "settings-button",
            () => {
                this.scene.sendToBack("WaitingScene");
                this.scene.launch("SettingsScene");
            }
        )
            .setScrollFactor(0)
            .setScale(1.2);
    }

    createHomeButton() {
        this.homeButton = this.createButton(
            this.config.rightBottomCorner.x - 50,
            this.config.rightBottomCorner.y - 150,
            "home-btn",
            () => {
                this.selectFx.play();
                this.scene.sendToBack("WaitingScene");
                this.scene.launch("PauseScene");
            }
        )
            .setScrollFactor(0)
            .setScale(1.2);
    }

    createControlsButton() {
        this.controlsButton = this.createButton(
            this.config.rightBottomCorner.x - 50,
            this.config.rightBottomCorner.y - 250,
            "controls-btn",
            () => {
                this.scene.sendToBack("WaitingScene");
                this.scene.launch("Controls");
            }
        )
            .setScrollFactor(0)
            .setScale(1);
    }

    createRoomKey() {
        if (this.roomKey.length === 4) {
            this.add
                .text(
                    100,
                    this.config.height + 600,
                    `Room Code: ${this.roomKey}`,
                    {
                        fontFamily: "customFont",
                        fontSize: "80px",
                        fill: "#fff",
                    }
                )
                .setDepth(2);
        }
    }

    createPlayer(start) {
        return new OnlinePlayer(
            this,
            start.x,
            start.y,
            this.charSpriteKey,
            this.username,
            this.socket,
            true
        );
    }

    createPlayerColliders(player, { colliders }) {
        player.addCollider(colliders.platformsColliders);
    }

    setupFollowupCameraOn(player) {
        const { height, width, mapOffset } = this.config;
        this.physics.world.setBounds(0, 0, width + mapOffset, height * 3);
        this.cameras.main
            .setBounds(0, 0, width + mapOffset, height + 1000)
            .setZoom(0.5);
    }

    getPlayerZones(playerZonesLayer) {
        const playerZones = playerZonesLayer.objects;
        return {
            start: playerZones.find((zone) => zone.name === "startZone"),
            end: playerZones.find((zone) => zone.name === "endZone"),
        };
    }

    update() {
        this.displayUsername();
    }

    displayUsername() {
        this.usernameText.setX(this.player.x);
        this.usernameText.setY(this.player.y - 80);
    }
}

export default WaitingScene;

