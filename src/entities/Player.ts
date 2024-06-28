// @ts-nocheck

import Phaser from "phaser";
import initAnimations from "../animations/entities/playerAnims";
import MeleeWeapon from "../attacks/MeleeWeapon";
import ProjectileManager from "../attacks/ProjectileManager";
import EventEmitter from "../events/Emitter";
import HealthBar from "../hud/Healthbar";
import anims from "../mixins/anims";
import collidable from "../mixins/collidable";
import { getTimestamp } from "../utils/functions";

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "player");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Mixins (Adds methods from other objects to this current instance)
        Object.assign(this, collidable);
        Object.assign(this, anims);

        this.init();
        this.initEvents();
    }

    init() {
        this.initProperties();
        this.initSoundEffects();
        this.initKeyboardControls();
        this.initWeapons();
        this.initHealthBar();
        this.initAnimations();
        this.handlePlayerAttacks();
        this.initMovementSound();
    }

    initProperties() {
        this.gravity = 2500;
        this.playerSpeed = 500;
        this.jumpCount = 0;
        this.consecutiveJumps = 1;
        this.hasBeenHit = false;
        this.isSliding = false;
        this.bounceVelocity = 400;
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        this.timeFromLastSwing = null;

        this.body.setSize(120, 150);
        this.body.setOffset(90, 40);
        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.setOrigin(0, 1);
    }

    initSoundEffects() {
        this.jumpFx = this.scene.sound.add("jump", { volume: 0.2 });
        this.takeDamageFx = this.scene.sound.add("damage", { volume: 0.2 });
        this.arrowFx = this.scene.sound.add("projectile-launch", {
            volume: 1,
        });
        this.stepFx = this.scene.sound.add("step", { volume: 0.05 });
        this.swingSwordFx = this.scene.sound.add("swipe", { volume: 0.1 });
    }

    initKeyboardControls() {
        this.keyBindings = this.scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            keyQ: Phaser.Input.Keyboard.KeyCodes.Q,
            keyE: Phaser.Input.Keyboard.KeyCodes.E,
        });
    }

    initWeapons() {
        this.projectiles = new ProjectileManager(this.scene, "arrow");
        this.meleeWeapon = new MeleeWeapon(this.scene, 0, 0, "sword-default");
    }

    initHealthBar() {
        this.health = 100;
        this.hp = new HealthBar(
            this.scene,
            this.scene.config.leftTopCorner.x + 150,
            this.scene.config.leftTopCorner.y + 25,
            2,
            this.health
        );
    }

    initAnimations() {
        initAnimations(this.scene.anims);
    }

    initMovementSound() {
        this.scene.time.addEvent({
            delay: 350,
            repeat: -1,
            callbackScope: this,
            callback: () => {
                if (this.isPlayingAnims("run")) {
                    this.stepFx.play();
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

        this.checkOutOfBounds();
        this.handleMovement();
    }

    checkOutOfBounds() {
        if (this.getBounds().top > this.scene.config.height * 2.5) {
            EventEmitter.emit("PLAYER_LOSE");
        }
    }

    handleMovement() {
        const { left, right, space, shift } = this.keyBindings;
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
        const onFloor = this.body.onFloor();

        this.handleHorizontalMovement(left, right);
        this.handleJumping(isSpaceJustDown, onFloor);
        this.handleRunning(shift, onFloor);

        // Prevents animations from overlapping
        if (
            this.isPlayingAnims("shoot-arrow") ||
            this.isPlayingAnims("melee")
        ) {
            return;
        }

        this.updatePlayerAnimation(onFloor);
    }

    handleHorizontalMovement(left, right) {
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
    }

    handleJumping(isSpaceJustDown, onFloor) {
        if (
            isSpaceJustDown &&
            (onFloor || this.jumpCount < this.consecutiveJumps)
        ) {
            this.jumpFx.play();
            this.setVelocityY(-1000);
            this.jumpCount++;
        }

        if (onFloor) {
            this.jumpCount = 0;
        }
    }

    handleRunning(shift, onFloor) {
        if (shift.isDown && onFloor) {
            this.playerSpeed = 650;
        } else {
            this.playerSpeed = 500;
        }
    }

    updatePlayerAnimation(onFloor) {
        onFloor
            ? this.body.velocity.x !== 0
                ? this.play("run", true)
                : this.play("idle", true)
            : this.play("jump", true);
    }

    handlePlayerAttacks() {
        const { keyQ, keyE } = this.keyBindings;

        keyQ.on("down", () => {
            this.handleProjectileAttack();
        });

        keyE.on("down", () => {
            this.handleMeleeAttack();
        });
    }

    handleProjectileAttack() {
        const delay = 300;
        this.play("shoot-arrow", true);
        setTimeout(() => this.arrowFx.play(), delay);
        setTimeout(() => this.projectiles.fireProjectile(this, "arrow"), delay);
    }

    handleMeleeAttack() {
        if (
            this.timeFromLastSwing &&
            this.timeFromLastSwing + this.meleeWeapon.attackSpeed >
                getTimestamp()
        ) {
            return;
        }

        this.swingSwordFx.play();
        this.play("melee", true);
        this.meleeWeapon.swing(this);
        this.timeFromLastSwing = getTimestamp();
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
            }
        }, 5000);
    }

    takesHit(source) {
        this.takeDamageFx.play();
        if (this.hasBeenHit) {
            return;
        }

        this.health -= source.damage || source.properties.damage || 0;

        if (this.health <= 0) {
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

