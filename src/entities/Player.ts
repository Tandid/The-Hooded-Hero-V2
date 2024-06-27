// @ts-nocheck

import Phaser from "phaser";
import MeleeWeapon from "../attacks/MeleeWeapon";
import Projectiles from "../attacks/Projectiles";
import EventEmitter from "../events/Emitter";
import HealthBar from "../hud/HealthBar";
import anims from "../mixins/anims";
import collidable from "../mixins/collidable";
import { getTimestamp } from "../utils/functions";
import initAnimations from "./anims/playerAnims";

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "player");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Mixins
        Object.assign(this, collidable);
        Object.assign(this, anims);

        this.init();
        this.initEvents();
    }

    init() {
        this.gravity = 2500;
        this.playerSpeed = 500;
        this.jumpCount = 0;
        this.consecutiveJumps = 1;
        this.hasBeenHit = false;
        this.isSliding = false;
        this.bounceVelocity = 400;
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.jumpSound = this.scene.sound.add("jump", { volume: 0.2 });
        this.takeDamageSound = this.scene.sound.add("damage", { volume: 0.2 });
        this.projectileSound = this.scene.sound.add("projectile-launch", {
            volume: 0.4,
        });
        this.stepSound = this.scene.sound.add("step", { volume: 0.05 });
        this.swipeSound = this.scene.sound.add("swipe", { volume: 0.1 });

        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        this.projectiles = new Projectiles(this.scene, "arrow");
        this.meleeWeapon = new MeleeWeapon(this.scene, 0, 0, "sword-default");
        this.timeFromLastSwing = null;

        this.health = 100;
        this.hp = new HealthBar(
            this.scene,
            this.scene.config.leftTopCorner.x + 150,
            this.scene.config.leftTopCorner.y + 25,
            2,
            this.health
        );

        this.body.setSize(120, 150);
        this.body.setOffset(90, 40);

        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.setOrigin(0, 1);

        initAnimations(this.scene.anims);

        this.handleAttacks();
        // this.handleMovements();

        this.scene.time.addEvent({
            delay: 350,
            repeat: -1,
            callbackScope: this,
            callback: () => {
                if (this.isPlayingAnims("run")) {
                    this.stepSound.play();
                }
            },
        });
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update() {
        if (this.hasBeenHit || !this.body) {
            return;
        }

        // if (this.healthRegen()) {
        //   return;
        // }

        // console.log(this.health);

        if (this.getBounds().top > this.scene.config.height * 2.5) {
            EventEmitter.emit("PLAYER_LOSE");
            return;
        }

        const { left, right, space, shift } = this.cursors;
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
        const onFloor = this.body.onFloor();

        if (left.isDown) {
            this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
            this.setVelocityX(-this.playerSpeed);
            this.setFlipX(true);
        } else if (right.isDown) {
            this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
            this.setVelocityX(this.playerSpeed);
            this.setFlipX(false);
        } else {
            this.setVelocityX(0);
        }

        if (
            isSpaceJustDown &&
            (onFloor || this.jumpCount < this.consecutiveJumps)
        ) {
            this.jumpSound.play();
            this.setVelocityY(-1000);
            this.jumpCount++;
        }

        if (shift.isDown && onFloor) {
            this.playerSpeed = 650;
        } else {
            this.playerSpeed = 500;
        }

        if (onFloor) {
            this.jumpCount = 0;
        }

        if (this.isPlayingAnims("throw")) {
            return;
        }

        if (this.isPlayingAnims("melee")) {
            return;
        }

        onFloor
            ? this.body.velocity.x !== 0
                ? this.play("run", true)
                : this.play("idle", true)
            : this.play("jump", true);
    }

    handleAttacks() {
        this.scene.input.keyboard.on("keydown-Q", () => {
            let delay = 300;
            this.play("throw", true);
            setTimeout(() => this.projectileSound.play(), delay);
            setTimeout(
                () => this.projectiles.fireProjectile(this, "arrow"),
                delay
            );
        });

        this.scene.input.keyboard.on("keydown-E", () => {
            if (
                this.timeFromLastSwing &&
                this.timeFromLastSwing + this.meleeWeapon.attackSpeed >
                    getTimestamp()
            ) {
                return;
            }

            this.swipeSound.play();
            this.play("melee", true);
            this.meleeWeapon.swing(this);
            this.timeFromLastSwing = getTimestamp();
        });
    }

    playDamageTween() {
        return this.scene.tweens.add({
            targets: this,
            duration: 100,
            repeat: -1,
            tint: 0xffffff,
        });
    }

    bounceOff(source) {
        if (source.body) {
            this.body.touching.right
                ? this.setVelocityX(-this.bounceVelocity)
                : this.setVelocityX(this.bounceVelocity);
        } else {
            this.body.blocked.right
                ? this.setVelocityX(-this.bounceVelocity)
                : this.setVelocityX(this.bounceVelocity);
        }

        setTimeout(() => this.setVelocityY(-this.bounceVelocity), 0);
    }

    healthRegen() {
        setTimeout(() => {
            if (!this.hasBeenHit && this.health < 100) {
                this.health += 5;
                this.hp.increase(this.health);
                return;
            }
        }, 5000);
    }

    takesHit(source) {
        this.takeDamageSound.play();
        if (this.hasBeenHit) {
            return;
        }

        this.health -= source.damage || source.properties.damage || 0;

        if (this.health <= 0) {
            // this.play("player-die", true);
            EventEmitter.emit("PLAYER_LOSE");
            return;
        }

        this.hasBeenHit = true;
        this.bounceOff(source);
        const hitAnim = this.playDamageTween();

        this.hp.decrease(this.health);
        source.deliversHit && source.deliversHit(this);

        this.scene.time.delayedCall(500, () => {
            this.hasBeenHit = false;
            hitAnim.stop();
            this.clearTint();
        });
    }
}

export default Player;

