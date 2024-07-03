// @ts-nocheck
import initAnims from "../../animations";
import Player from "../../entities/Player";
import EventEmitter from "../../events/Emitter";
import Collectables from "../../groups/Collectables";
import Enemies from "../../groups/Enemies";
import Hud from "../../hud";
import BaseScene from "./BaseScene";

class PlayScene extends BaseScene {
    constructor(config) {
        super("PlayScene", config);
        this.config = config;
    }

    init() {
        this.score = 0;
        this.isPaused = false;
    }

    create({ gameStatus }) {
        super.create();
        this.hud = new Hud(this, 0, 0);
        this.playBgMusic();

        const map = this.createMap();
        initAnims(this.anims);

        const layers = this.createLayers(map);
        const playerZones = this.getPlayerZones(layers.playerZones);
        const player = this.createPlayer(playerZones.start);
        this.player = player;
        const enemies = this.createEnemies(
            layers.enemySpawns,
            layers.platformsColliders
        );
        const collectables = this.createCollectables(layers.collectables);

        this.createEnemyColliders(enemies, {
            platformsColliders: layers.platformsColliders,
            player,
        });

        this.createPlayerColliders(player, {
            platformsColliders: layers.platformsColliders,
            projectiles: enemies.getProjectiles(),
            collectables,
            traps: layers.traps,
            enemies,
        });

        this.createBG(map);
        this.createUIButtons();
        this.createEndOfLevel(playerZones.end, player);
        this.setupFollowupCameraOn(player);

        if (gameStatus !== "PLAYER_LOSE") {
            this.createGameEvents();
        }
    }

    playBgMusic() {
        this.sound.stopAll();
        const level = this.getCurrentLevel();

        const bgMusicMap = {
            1: this.forestBGM,
            2: this.caveBGM,
            3: this.bossBGM,
        };

        const bgMusic = bgMusicMap[level];
        if (bgMusic) {
            bgMusic.play();
        }
    }

    createMap() {
        const map = this.make.tilemap({
            key: `level_${this.getCurrentLevel()}`,
        });
        map.addTilesetImage("tileset_1", "forest-tiles");
        map.addTilesetImage("tileset_2", "cave-tiles");
        map.addTilesetImage("environment", "environment-tiles");

        return map;
    }

    createLayers(map) {
        const tileset1 = map.getTileset("tileset_1");
        const tileset2 = map.getTileset("tileset_2");
        const tileset3 = map.getTileset("environment");

        const platformsColliders = map
            .createLayer("platforms_colliders", [tileset1, tileset2, tileset3])
            .setCollisionByProperty({ collides: true })
            .setAlpha(0);

        const environment = map
            .createLayer("environment", [tileset3])
            .setDepth(-4);
        const platforms = map.createLayer("platforms", [
            tileset1,
            tileset2,
            tileset3,
        ]);
        const playerZones = map.getObjectLayer("player_zones");
        const enemySpawns = map.getObjectLayer("enemy_spawns");
        const collectables = map.getObjectLayer("collectables");
        const traps = map
            .createLayer("traps", tileset1)
            .setCollisionByExclusion(-1);

        return {
            environment,
            platforms,
            platformsColliders,
            playerZones,
            enemySpawns,
            collectables,
            traps,
        };
    }

    createBG(map) {
        const bgObject = map.getObjectLayer("distance_bg").objects[0];
        const level = this.getCurrentLevel();

        this.forestBg = [
            { key: "bg-forest-1", y: 300, depth: -10, scale: 1.3 },
            { key: "bg-forest-2", y: 300, depth: -11, scale: 1.3 },
            { key: "bg-forest-3", y: 300, depth: -12, scale: 1 },
            { key: "mountain-bg", y: 200, depth: -13, scale: 1 },
            { key: "sky-bg", y: 0, depth: -14, scale: 1 },
        ];

        this.caveBg = [
            { key: "bg-cave-1", y: 0, depth: -10, scale: 1.7 },
            { key: "bg-cave-2", y: 0, depth: -11, scale: 1.7 },
            { key: "bg-cave-3", y: 0, depth: -12, scale: 1.3 },
            { key: "bg-cave-4", y: 0, depth: -13, scale: 1.3 },
            { key: "bg-cave-5", y: 0, depth: -14, scale: 1 },
        ];

        const bgConfig = {
            1: this.forestBg,
            2: this.caveBg,
            3: this.caveBg,
        };

        const bgLayers = bgConfig[level];
        if (bgLayers) {
            this.bgSprites = [];

            bgLayers.forEach(({ key, y, depth, scale }) => {
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
    }

    createUIButtons() {
        this.settingsButton = this.createButton(
            this.config.rightBottomCorner.x - 50,
            this.config.rightBottomCorner.y - 50,
            "settings-button",
            () => {
                this.scene.pause("PlayScene");
                this.scene.sendToBack("PlayScene");
                this.scene.launch("SettingsScene");
            }
        )
            .setScrollFactor(0)
            .setScale(1.2);

        this.homeButton = this.createButton(
            this.config.rightBottomCorner.x - 50,
            this.config.rightBottomCorner.y - 150,
            "home-btn",
            () => {
                this.selectFx.play();
                this.scene.pause("PlayScene");
                this.scene.sendToBack("PlayScene");
                this.scene.launch("PauseScene");
            }
        )
            .setScrollFactor(0)
            .setScale(1.2);

        this.restartButton = this.createButton(
            this.config.rightBottomCorner.x - 50,
            this.config.rightBottomCorner.y - 250,
            "restart-btn",
            () => {
                this.selectFx.play();
                this.scene.restart();
            }
        )
            .setScrollFactor(0)
            .setScale(1.2);

        this.controlsButton = this.createButton(
            this.config.rightBottomCorner.x - 50,
            this.config.rightBottomCorner.y - 350,
            "controls-btn",
            () => {
                this.scene.pause("PlayScene");
                this.scene.sendToBack("PlayScene");
                this.scene.launch("Controls");
            }
        )
            .setScrollFactor(0)
            .setScale(1);

        this.debugButton = this.createButton(
            this.config.rightBottomCorner.x - 50,
            this.config.rightBottomCorner.y - 450,
            "thunderbolt",
            () => {
                this.config.debug = !this.config.debug;
            }
        )
            .setScrollFactor(0)
            .setScale(1.2);
    }

    createGameEvents() {
        EventEmitter.on("PLAYER_LOSE", () => {
            this.scene.stop("PlayScene");
            this.scene.launch("GameOverScene");
        });
        EventEmitter.on("RESTART_GAME", () => {
            this.scene.restart({ gameStatus: "PLAYER_LOSE" });
        });
    }

    createCollectables(collectableLayer) {
        const collectables = new Collectables(this).setDepth(-1);
        collectables.addFromLayer(collectableLayer);
        collectables.playAnimation("coin-spin");
        return collectables;
    }

    createPlayer(start) {
        return new Player(this, start.x, start.y);
    }

    onCollect(entity, collectable) {
        this.score += collectable.score;
        this.hud.updateScoreboard(this.score);
        this.collectFx.play();
        collectable.disableBody(true, true);
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
            .addCollider(colliders.player, this.onPlayerCollision)
            .addCollider(colliders.player.projectiles, this.onHit)
            .addOverlap(colliders.player.meleeWeapon, this.onHit);
    }

    createPlayerColliders(player, colliders) {
        player
            .addCollider(colliders.platformsColliders)
            .addCollider(colliders.projectiles, this.onHit)
            .addOverlap(colliders.collectables, this.onCollect, this)
            .addOverlap(colliders.enemies, this.onHit);
    }

    setupFollowupCameraOn(player) {
        const { height, width, mapOffset, zoomFactor } = this.config;
        this.physics.world.setBounds(0, 0, width + mapOffset, height * 3);
        this.cameras.main
            .setBounds(0, 0, width + mapOffset, height + 1000)
            .setZoom(zoomFactor)
            .startFollow(player);
    }

    getPlayerZones(playerZonesLayer) {
        const playerZones = playerZonesLayer.objects;
        return {
            start: playerZones.find((zone) => zone.name === "startZone"),
            end: playerZones.find((zone) => zone.name === "endZone"),
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

            this.scene.stop("PlayScene");
            this.scene.launch("VictoryScene", { score: this.score });
        });
    }

    getCurrentLevel() {
        return this.registry.get("level");
    }

    update() {
        const level = this.getCurrentLevel();
        if (this.bgSprites) {
            if (level === 1) {
                this.bgSprites[0].tilePositionX =
                    this.cameras.main.scrollX * 0.3;
                this.bgSprites[1].tilePositionX =
                    this.cameras.main.scrollX * 0.2;
                this.bgSprites[2].tilePositionX =
                    this.cameras.main.scrollX * 0.3;
                this.bgSprites[3].tilePositionX =
                    this.cameras.main.scrollX * 0.2;
                this.bgSprites[4].tilePositionX =
                    this.cameras.main.scrollX * 0.1;
            } else {
                this.bgSprites[0].tilePositionX =
                    this.cameras.main.scrollX * 0.4;
                this.bgSprites[1].tilePositionX =
                    this.cameras.main.scrollX * 0.3;
                this.bgSprites[2].tilePositionX =
                    this.cameras.main.scrollX * 0.3;
                this.bgSprites[3].tilePositionX =
                    this.cameras.main.scrollX * 0.2;
                this.bgSprites[4].tilePositionX =
                    this.cameras.main.scrollX * 0.2;
            }
        }
    }

    checkGameStatus() {
        if (this.isPaused) {
            return;
        }

        // Check if the player's top boundary is beyond the height of the game screen
        if (this.player.getBounds().top > this.config.height) {
            // Emit the PLAYER_LOSE event
            EventEmitter.emit("PLAYER_LOSE");
        }
    }
}

export default PlayScene;

