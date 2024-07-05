// @ts-nocheck

import initAnims from "../../../animations";
import OnlinePlayer from "../../../entities/OnlinePlayer";
import EventEmitter from "../../../events/Emitter";
import BaseScene from "../BaseScene";

class MockScene extends BaseScene {
    constructor(config) {
        super("MockScene", config);
        this.config = config;
        this.stageKey = "level_online";
        this.opponents = {};
        this.requiredPlayers = 1;
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

        initAnims(this.anims);

        const map = this.createMap();
        const layers = this.createLayers(map);
        const playerZones = this.getPlayerZones(layers.playerZones);
        const player = this.createPlayer(playerZones.start);

        this.player = player;
        console.log({ Me: this.player });

        this.createBG(map);
        this.setupFollowupCameraOn(player);
        this.createPlayerColliders(player, {
            colliders: {
                platformsColliders: layers.platformsColliders,
            },
        });

        this.createEndOfLevel(playerZones.end, player);
        this.handleCheckpoints(playerZones.checkpoints, player);

        this.usernameText = this.add
            .text(this.player.x, this.player.y, this.username, {
                fontSize: "40px",
                fill: "#fff",
            })
            .setOrigin(0.5, 1)
            .setDepth(2);

        this.setupUI();
        this.createGameEvents();

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

        this.socket.on("playerMoved", ({ playerId, moveState }) => {
            if (this.opponents[playerId]) {
                this.opponents[playerId].updateOtherPlayer(moveState);
                this[`opponents${playerId}`].setX(this.opponents[playerId].x);
                this[`opponents${playerId}`].setY(this.opponents[playerId].y);
            }
        });
    }

    setupUI() {
        this.createHomeButton();
        this.createSettingsButton();
        this.createControlsButton();
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
                this.scene.sendToBack("MockScene");
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
                this.scene.sendToBack("MockScene");
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
                this.scene.sendToBack("MockScene");
                this.scene.launch("Controls");
            }
        )
            .setScrollFactor(0)
            .setScale(1);
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
            .setZoom(0.5)
            .startFollow(player);
    }

    getPlayerZones(playerZonesLayer) {
        const playerZones = playerZonesLayer.objects;
        return {
            start: playerZones.find((zone) => zone.name === "startZone"),
            end: playerZones.find((zone) => zone.name === "endZone"),
            checkpoints: playerZones.filter((zone) =>
                zone.name.startsWith("checkpoint")
            ),
        };
    }

    createEndOfLevel(end, player) {
        const endOfLevel = this.physics.add
            .sprite(end.x, end.y, "end")
            .setAlpha(0)
            .setSize(5, 200)
            .setOrigin(0.5, 1);

        const eolOverlap = this.physics.add.overlap(player, endOfLevel, () => {
            eolOverlap.active = false;

            console.log("Congrats, you reached the end of the level!");
        });
    }

    handleCheckpoints(checkpoints, player) {
        // Checkpoint overlap detection
        checkpoints.forEach((checkpoint) => {
            const checkpointMark = this.physics.add.sprite(
                checkpoint.x,
                checkpoint.y,
                "checkpoint"
            );

            const checkpointOverlap = this.physics.add.overlap(
                player,
                checkpointMark,
                () => {
                    this.lastCheckpoint = checkpoint;
                    console.log(
                        `Player reached checkpoint: ${checkpoint.name}`
                    );
                }
            );
        });
    }

    createGameEvents() {
        EventEmitter.on("RESPAWN", () => {
            if (this.player && this.lastCheckpoint) {
                this.player.setPosition(
                    this.lastCheckpoint.x,
                    this.lastCheckpoint.y
                );
                // Additional logic for resetting player state, animations, etc.
            }
        });
    }

    update() {
        this.displayUsername();
    }

    displayUsername() {
        this.usernameText.setX(this.player.x);
        this.usernameText.setY(this.player.y - 80);
    }
}

export default MockScene;

