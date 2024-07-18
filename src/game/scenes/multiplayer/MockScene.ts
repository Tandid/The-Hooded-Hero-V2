// @ts-nocheck

import initAnims from "../../../animations";
import OnlinePlayer from "../../../entities/OnlinePlayer";
import EventEmitter from "../../../events/Emitter";
import Enemies from "../../../groups/Enemies";
import BaseScene from "../BaseScene";

class MockScene extends BaseScene {
    constructor(config) {
        super("MockScene", config);
        this.config = config;
        this.stageKey = "level_online";
        this.opponents = {};
        this.stageLoaded = false;
        this.stageStart = false;
        this.stagePassed = false;
        this.stageEnded = false;
        this.rankings = [];
    }

    init(data) {
        this.socket = data.socket;
        this.currentRoom = data.currentRoom;
        this.roomKey = data.roomKey;
        this.charSpriteKey = data.charSpriteKey;
        this.username = data.username;
        console.log({ OnlinePlayScene: data });
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.cameras.main.on("camerafadeincomplete", () => {
            this.socket.emit("stageLoaded");
        });

        super.create();

        this.resetStageStatus();

        const map = this.createMap();
        initAnims(this.anims);

        const layers = this.createLayers(map);
        const playerZones = this.getPlayerZones(layers.playerZones);
        const player = this.createPlayer(playerZones.start);

        this.player = player;
        console.log({ Me: this.player });
        this.lastCheckpoint = playerZones.start;
        const enemies = this.createEnemies(
            layers.enemySpawns,
            layers.platformsColliders
        );

        this.createEnemyColliders(enemies, {
            platformsColliders: layers.platformsColliders,
            player,
        });

        this.createPlayerColliders(player, {
            colliders: {
                platformsColliders: layers.platformsColliders,
                projectiles: enemies.getProjectiles(),
                enemies,
            },
        });

        this.playBgMusic();
        this.createBG(map);
        this.createEndOfLevel(playerZones.end, player);

        this.handleCheckpoints(playerZones.checkpoints, player);
        this.setupFollowupCameraOn(player);

        this.usernameText = this.add
            .text(this.player.x, this.player.y, this.username, {
                fontSize: "40px",
                fill: "#fff",
            })
            .setOrigin(0.5, 1)
            .setDepth(2);

        this.setupUI();
        this.createGameEvents();

        // Creates countdown text
        this.playerCountdown = this.add
            .text(
                this.config.width / 2,
                this.config.height / 5 + 200,
                `Waiting for all players...`,
                {
                    fontFamily: "customFont",
                    fontSize: "100px",
                    fill: "#fff",
                }
            )
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0);

        // Creates opponents
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

        // update stage count down timer
        this.socket.on("stageTimerUpdated", (time) => {
            this.playerCountdown.setFontSize("100px");
            this.playerCountdown.setText(`${time}`);
        });

        // all players start the stage at the same time
        this.socket.on("startStage", () => {
            this.playerCountdown.setText("GO!");
            this.stageStart = true;
            this.time.delayedCall(1000, () => this.playerCountdown.destroy());
        });

        // Opponent movements updated
        this.socket.on("playerMoved", ({ playerId, moveState }) => {
            if (this.opponents[playerId]) {
                this.opponents[playerId].updateOtherPlayer(moveState);
                this[`opponents${playerId}`].setX(this.opponents[playerId].x);
                this[`opponents${playerId}`].setY(this.opponents[playerId].y);
            }
        });

        this.socket.on("updateWinners", (numWinners) => {
            this.stageLimitText.setText(
                `Stage Limit: ${numWinners}/${this.stageLimit}`
            );
        });

        // stage ended when num of players reach the stage limit
        this.socket.on("stageEnded", (roomInfo) => {
            this.socket.removeAllListeners();
            this.stageEnded = true;
            const { stageWinners } = roomInfo;

            this.time.addEvent({
                delay: 5000,
                loop: false,
                repeat: 0,
                callback: () => {
                    this.socket.emit("leaveGame");
                    this.socket.on("gameLeft", () => {
                        this.socket.removeAllListeners();
                        this.scene.stop(this.stageKey);
                        this.scene.start("RankingScene", {
                            rankings: stageWinners,
                        });
                    });
                },
            });
        });

        // remove opponent when they leave the room (i.e. disconnected from the server)
        this.socket.on(
            "playerLeft",
            ({ playerId, newStageLimits, numWinners }) => {
                if (this.opponents[playerId]) {
                    this.opponents[playerId].destroy(); // remove opponent's game object
                    delete this.opponents[playerId]; // remove opponent's key-value pair
                    this[`opponents${playerId}`].destroy(); // remove opponent's name
                    this.stageLimit -= 1;
                    this.stageLimitText.setText(
                        `Stage Limit: ${numWinners}/${this.stageLimit}`
                    );
                }
            }
        );
    }

    playBgMusic() {
        this.sound.stopAll();
        this.onlineBGM.play();
    }

    setupUI() {
        this.createHomeButton();
        this.createSettingsButton();
        this.createControlsButton();

        this.setStageLimit();
        this.stageLimitText = this.add
            .text(
                this.config.width / 2,
                this.config.height / 2 - 600,
                `Winners: 0/${this.stageLimit}`,
                {
                    fontFamily: "customFont",
                    fontSize: "50px",
                    fill: "#fff",
                }
            )
            .setScrollFactor(0)
            .setOrigin(0.5, 0.5);
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
        const enemySpawns = map.getObjectLayer("enemy_spawns");

        platformsColliders
            .setCollisionByProperty({ collides: true })
            .setAlpha(0);

        return {
            environment,
            platforms,
            platformsColliders,
            playerZones,
            enemySpawns,
        };
    }

    createBG(map) {
        const bgObject = map.getObjectLayer("distance_bg").objects[0];

        this.forestBg = [
            { key: "bg-forest-1", y: 300, depth: -10, scale: 1.3 },
            { key: "bg-forest-2", y: 300, depth: -11, scale: 1.3 },
            { key: "bg-forest-3", y: 300, depth: -12, scale: 1 },
            { key: "mountain-bg", y: 200, depth: -13, scale: 1 },
            { key: "sky-bg", y: 0, depth: -14, scale: 1 },
        ];

        this.bgSprites = [];

        this.forestBg.forEach(({ key, y, depth, scale }) => {
            const sprite = this.add
                .tileSprite(
                    0,
                    y,
                    this.config.width + 3000,
                    this.config.height + 1000,
                    key
                )
                .setOrigin(0.5, 0)
                .setDepth(depth)
                .setScale(scale)
                .setScrollFactor(0, 1);

            this.bgSprites.push(sprite);
        });
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

    createEnemies(spawnLayer, platformsColliders, player) {
        const enemies = new Enemies(this);
        const enemyTypes = enemies.getTypes();

        spawnLayer.objects.forEach((spawnPoint) => {
            const EnemyType = enemyTypes[spawnPoint.type];
            if (EnemyType) {
                const enemy = new EnemyType(this, spawnPoint.x, spawnPoint.y);
                enemy.setPlatformColliders(platformsColliders);
                enemies.add(enemy);
            }
        });

        return enemies;
    }

    onPlayerCollision(enemy, player) {
        player.takesHit(enemy);
    }

    onHit(entity, source) {
        entity.takesHit(source);
    }

    createEnemyColliders(enemies, colliders) {
        enemies
            .addCollider(colliders.platformsColliders)
            .addCollider(colliders.player, this.onPlayerCollision);
    }

    createPlayerColliders(player, { colliders }) {
        player
            .addCollider(colliders.platformsColliders)
            .addCollider(colliders.projectiles, this.onHit)
            .addOverlap(colliders.enemies, this.onHit);
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
            if (this.stageEnded || this.stagePassed) return;
            console.log("stage passed");
            this.stagePassed = true;
            this.socket.emit("passStage", {
                playerId: this.socket.id,
                username: this.username,
            });
        });
    }

    handleCheckpoints(checkpoints, player) {
        checkpoints.forEach((checkpoint) => {
            const checkpointMark = this.physics.add
                .sprite(checkpoint.x, checkpoint.y, "checkpoint")
                .setAlpha(0)
                .setSize(5, 200)
                .setOrigin(0.5, 1);

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
            }
        });
    }

    update() {
        this.displayUsername();

        if (this.bgSprites) {
            this.bgSprites[0].tilePositionX = this.cameras.main.scrollX * 0.3;
            this.bgSprites[1].tilePositionX = this.cameras.main.scrollX * 0.2;
            this.bgSprites[2].tilePositionX = this.cameras.main.scrollX * 0.3;
            this.bgSprites[3].tilePositionX = this.cameras.main.scrollX * 0.2;
            this.bgSprites[4].tilePositionX = this.cameras.main.scrollX * 0.1;
        }
    }

    displayUsername() {
        this.usernameText.setX(this.player.x);
        this.usernameText.setY(this.player.y - 80);
    }

    resetStageStatus() {
        this.opponents = {};
        this.stageLoaded = false;
        this.stageStart = false;
        this.stagePassed = false;
        this.stageEnded = false;
        // this.hurt = false;
    }

    setStageLimit() {
        this.stageLimit = this.currentRoom.numPlayers;
    }
}

export default MockScene;

