// @ts-nocheck

import Phaser from "phaser";
import Player from "../../entities/Player";
import EventEmitter from "../../events/Emitter";
import Collectables from "../../groups/Collectables";
import Enemies from "../../groups/Enemies";
import Hud from "../../hud";

import initAnims from "../../anims";

class PlayScene extends Phaser.Scene {
    constructor(config) {
        super("PlayScene");
        this.config = config;
    }

    create({ gameStatus }) {
        this.cursorOver = this.sound.add("cursorOver");
        this.cursorOver.volume = 0.4;

        this.select = this.sound.add("select");
        this.select.volume = 0.4;

        this.pageFlip = this.sound.add("page-flip");
        this.pageFlip.volume = 0.4;

        this.score = 0;
        this.hud = new Hud(this, 0, 0);
        this.isPaused = false;

        this.playBgMusic();
        this.collectSound = this.sound.add("coin-pickup", { volume: 0.2 });

        this.add
            .image(
                this.config.leftTopCorner.x + 100,
                this.config.leftTopCorner.y + 100,
                "portrait"
            )
            .setOrigin(0.5)
            .setScale(1)
            .setDepth(1)
            .setScrollFactor(0);

        this.add
            .image(
                this.config.leftTopCorner.x + 100,
                this.config.leftTopCorner.y + 100,
                "player-icon"
            )
            .setOrigin(0.5)
            .setScale(1.1)
            .setDepth(2)
            .setScrollFactor(0);

        const map = this.createMap();

        initAnims(this.anims);

        const layers = this.createLayers(map);
        const playerZones = this.getPlayerZones(layers.playerZones);
        const player = this.createPlayer(playerZones.start);
        const enemies = this.createEnemies(
            layers.enemySpawns,
            layers.platformsColliders
        );
        const collectables = this.createCollectables(layers.collectables);

        this.createEnemyColliders(enemies, {
            colliders: {
                platformsColliders: layers.platformsColliders,
                player,
            },
        });

        this.createPlayerColliders(player, {
            colliders: {
                platformsColliders: layers.platformsColliders,
                projectiles: enemies.getProjectiles(),
                collectables,
                traps: layers.traps,
                enemies,
            },
        });

        this.createBG(map);
        this.createRestartButton();
        this.createHomeButton();
        this.createSettingsButton();
        this.createEndOfLevel(playerZones.end, player);
        this.setupFollowupCameraOn(player);

        if (gameStatus === "PLAYER_LOSE") {
            return;
        }

        this.createGameEvents();
    }

    playBgMusic() {
        const level = this.getCurrentLevel();
        this.sound.stopAll();

        const forestBg = this.sound.add("forest-theme", {
            loop: true,
            volume: 0.04,
        });
        const caveBg = this.sound.add("cave-theme", {
            loop: true,
            volume: 0.04,
        });
        const bossBg = this.sound.add("boss-theme", {
            loop: true,
            volume: 0.04,
        });

        if (level === 1) {
            forestBg.play();
        }

        if (level === 2) {
            caveBg.play();
        }

        if (level === 3) {
            bossBg.play();
        }
    }

    createMap() {
        const map = this.make.tilemap({
            key: `level_${this.getCurrentLevel()}`,
        });
        map.addTilesetImage("tileset_1", "forest-tiles");
        map.addTilesetImage("tileset_2", "cave-tiles");
        map.addTilesetImage("environment", "environment-tiles");
        // map.addTilesetImage("bg_spikes_tileset", "bg-spikes-tileset");

        return map;
    }

    createLayers(map) {
        const tileset1 = map.getTileset("tileset_1");
        const tileset2 = map.getTileset("tileset_2");
        const tileset3 = map.getTileset("environment");
        // const tilesetBg = map.getTileset("bg_spikes_tileset");

        // map.createLayer("distance", tilesetBg).setDepth(-12);

        const platformsColliders = map.createLayer("platforms_colliders", [
            tileset1,
            tileset2,
            tileset3,
        ]);

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
        const traps = map.createLayer("traps", tileset1);

        platformsColliders
            .setCollisionByProperty({ collides: true })
            .setAlpha(0);
        traps.setCollisionByExclusion(-1);

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

        if (level === 1) {
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

        if (level > 1) {
            this.caveImageOne = this.add
                .tileSprite(
                    bgObject.x,
                    bgObject.y,
                    this.config.width + 3000,
                    bgObject.height + 800,
                    "bg-cave-1"
                )
                .setOrigin(0.5)
                .setDepth(-10)
                .setScale(1.6)
                .setScrollFactor(0, 1);

            this.caveImageTwo = this.add
                .tileSprite(
                    0,
                    0,
                    this.config.width + 3000,
                    this.config.height + 800,
                    "bg-cave-2"
                )
                .setOrigin(0.5, 0)
                .setDepth(-11)
                .setScale(1.5)
                .setScrollFactor(0, 1);

            this.caveImageThree = this.add
                .tileSprite(
                    0,
                    0,
                    this.config.width + 3000,
                    this.config.height + 800,
                    "bg-cave-3"
                )
                .setOrigin(0.5, 0)
                .setDepth(-12)
                .setScale(1.5)
                .setScrollFactor(0, 1);

            this.caveImageFour = this.add
                .tileSprite(
                    0,
                    0,
                    this.config.width + 3000,
                    this.config.height + 800,
                    "bg-cave-4"
                )
                .setOrigin(0.5, 0)
                .setDepth(-13)
                .setScale(1.5)
                .setScrollFactor(0, 1);

            this.caveImageFive = this.add
                .tileSprite(
                    0,
                    0,
                    this.config.width + 3000,
                    this.config.height + 800,
                    "bg-cave-5"
                )
                .setOrigin(0.5, 0)
                .setDepth(-14)
                .setScale(1.5)
                .setScrollFactor(0, 1);
        }
    }

    createSettingsButton() {
        const settingsBtn = this.add
            .image(
                this.config.rightBottomCorner.x - 15,
                this.config.rightBottomCorner.y - 10,
                "settings-button"
            )
            .setOrigin(1)
            .setScrollFactor(0)
            .setScale(1)
            .setInteractive();

        settingsBtn.on("pointerup", () => {
            this.scene.pause("PlayScene");
            this.scene.sendToBack("PlayScene");
            this.scene.launch("SettingsOverlay");
        });

        settingsBtn.on("pointerover", () => {
            settingsBtn.setTint(0xc2c2c2);
            this.cursorOver.play();
        });
        settingsBtn.on("pointerout", () => {
            settingsBtn.clearTint();
        });
    }

    createPlayerIcon() {
        this.add
            .image(
                this.config.rightBottomCorner.x - 15,
                this.config.rightBottomCorner.y - 115,
                "player-icon"
            )
            .setOrigin(1)
            .setScrollFactor(0)
            .setScale(0.9)
            .setInteractive()
            .setDepth(2);
    }

    createHomeButton() {
        const homeBtn = this.add
            .image(
                this.config.rightBottomCorner.x - 15,
                this.config.rightBottomCorner.y - 115,
                "home-btn"
            )
            .setOrigin(1)
            .setScrollFactor(0)
            .setScale(0.9)
            .setInteractive()
            .setDepth(2);

        homeBtn.on("pointerup", () => {
            this.select.play();
            this.scene.pause("PlayScene");
            // this.scene.sendToBack("PlayScene");
            this.scene.launch("PauseScene");
        });
        homeBtn.on("pointerover", () => {
            homeBtn.setTint(0xc2c2c2);
            this.cursorOver.play();
        });
        homeBtn.on("pointerout", () => {
            homeBtn.clearTint();
        });
    }

    createRestartButton() {
        const restartBtn = this.add
            .image(
                this.config.rightBottomCorner.x - 15,
                this.config.rightBottomCorner.y - 210,
                "restart-btn"
            )
            .setOrigin(1)
            .setScrollFactor(0)
            .setScale(0.9)
            .setInteractive()
            .setDepth(2);

        restartBtn.on("pointerup", () => {
            this.select.play();
            this.scene.restart();
        });
        restartBtn.on("pointerover", () => {
            restartBtn.setTint(0xc2c2c2);
            this.cursorOver.play();
        });
        restartBtn.on("pointerout", () => {
            restartBtn.clearTint();
        });
    }

    createGameEvents() {
        EventEmitter.on("PLAYER_LOSE", () => {
            this.scene.pause("PlayScene");
            this.scene.launch("LoseScene");
            // this.scene.restart({ gameStatus: "PLAYER_LOSE" });
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
        this.collectSound.play();
        collectable.disableBody(true, true);
    }

    createEnemies(spawnLayer, platformsColliders) {
        const enemies = new Enemies(this);
        const enemyTypes = enemies.getTypes();

        spawnLayer.objects.forEach((spawnPoint, i) => {
            // if (i === 1) { return; }
            const enemy = new enemyTypes[spawnPoint.type](
                this,
                spawnPoint.x,
                spawnPoint.y
            );
            enemy.setPlatformColliders(platformsColliders);
            enemies.add(enemy);
        });

        return enemies;
    }

    onPlayerCollision(enemy, player) {
        player.takesHit(enemy);
    }

    onHit(entity, source) {
        entity.takesHit(source);
    }

    createEnemyColliders(enemies, { colliders }) {
        enemies
            .addCollider(colliders.platformsColliders)
            .addCollider(colliders.player, this.onPlayerCollision)
            .addCollider(colliders.player.projectiles, this.onHit)
            .addOverlap(colliders.player.meleeWeapon, this.onHit);
    }

    createPlayerColliders(player, { colliders }) {
        player
            .addCollider(colliders.platformsColliders)
            .addCollider(colliders.projectiles, this.onHit)
            // .addCollider(colliders.traps, this.onHit)
            .addOverlap(colliders.collectables, this.onCollect, this)
            .addOverlap(colliders.enemies, this.onHit);
    }

    setupFollowupCameraOn(player) {
        const { height, width, mapOffset, zoomFactor } = this.config;
        this.physics.world.setBounds(0, 0, width + mapOffset, height * 3);
        this.cameras.main
            .setBounds(0, 0, width + mapOffset, height + 1000)
            .setZoom(zoomFactor);
        this.cameras.main.startFollow(player);
    }

    getPlayerZones(playerZonesLayer) {
        const playerZones = playerZonesLayer.objects;
        return {
            start: playerZones.find((zone) => zone.name === "startZone"),
            end: playerZones.find((zone) => zone.name === "endZone"),
        };
    }

    getCurrentLevel() {
        return this.registry.get("level") || 1;
    }

    createEndOfLevel(end, player) {
        const endOfLevel = this.physics.add
            .sprite(end.x, end.y, "end")
            .setAlpha(0)
            .setSize(5, this.config.height)
            .setOrigin(0.5, 1);

        const eolOverlap = this.physics.add.overlap(player, endOfLevel, () => {
            eolOverlap.active = false;

            if (this.registry.get("level") === this.config.lastLevel) {
                this.scene.start("CreditsScene");
                return;
            }

            this.scene.sleep("PlayScene");
            this.scene.launch("WinScene");
        });
    }

    update() {
        const level = this.getCurrentLevel();
        if (level === 1) {
            if (this.caveImageOne) {
                this.forestImageOne.tilePositionX =
                    this.cameras.main.scrollX * 0.3;
                this.forestImageTwo.tilePositionX =
                    this.cameras.main.scrollX * 0.2;
                this.forestImageThree.tilePositionX =
                    this.cameras.main.scrollX * 0.3;
                this.mountainImage.tilePositionX =
                    this.cameras.main.scrollX * 0.2;
                this.skyImage.tilePositionX = this.cameras.main.scrollX * 0.1;
            }
        } else {
            if (this.caveImageOne) {
                this.caveImageOne.tilePositionX =
                    this.cameras.main.scrollX * 0.4;
                this.caveImageTwo.tilePositionX =
                    this.cameras.main.scrollX * 0.3;
                this.caveImageThree.tilePositionX =
                    this.cameras.main.scrollX * 0.3;
                this.caveImageFour.tilePositionX =
                    this.cameras.main.scrollX * 0.2;
                this.caveImageFive.tilePositionX =
                    this.cameras.main.scrollX * 0.2;
            }
        }
    }
}

export default PlayScene;

