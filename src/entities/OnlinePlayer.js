import Phaser from "phaser";
import EventEmitter from "../events/Emitter";
import anims from "../mixins/anims";
import collidable from "../mixins/collidable";
import initAnimations from "./anims/onlinePlayerAnims";

class OnlinePlayer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, spriteKey, username, socket, me) {
        super(scene, x, y, spriteKey);
        this.spriteKey = spriteKey;
        this.username = username;
        this.socket = socket;
        this.me = me;
        this.moveState = {
            x,
            y,
            left: false,
            right: false,
            space: false,
            shift: false,
        };

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Mixins
        Object.assign(this, collidable);
        Object.assign(this, anims);

        this.init();
        this.initEvents();
    }

    init() {
        console.log(this.spriteKey);
        this.gravity = 2500;
        this.playerSpeed = 500;
        this.jumpCount = 0;
        this.consecutiveJumps = 1;
        this.hasBeenHit = false;
        this.bounceVelocity = 400;
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.jumpSound = this.scene.sound.add("jump", { volume: 0.2 });
        this.takeDamageSound = this.scene.sound.add("damage", { volume: 0.2 });
        this.stepSound = this.scene.sound.add("step", { volume: 0.3 });

        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;

        if (this.spriteKey === "player-1") {
            this.body.setSize(120, 150);
            this.body.setOffset(90, 40);
        } else {
            this.body.setSize(120, 150);
        }

        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.setOrigin(0, 1);

        initAnimations(this.scene.anims, this.spriteKey);

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

        if (this.getBounds().top > this.scene.config.height * 2.5) {
            EventEmitter.emit("PLAYER_LOSE");
            return;
        }

        const { left, right, space, shift } = this.cursors;
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
        const onFloor = this.body.onFloor();

        if (left.isDown && this.me) {
            this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
            this.setVelocityX(-this.playerSpeed);
            this.setFlipX(true);
            if (this.socket) {
                this.moveState.x = this.x;
                this.moveState.y = this.y;
                this.moveState.left = true;
                this.moveState.right = false;
                this.moveState.up = false;
                this.socket.emit("updatePlayer", this.moveState);
            }
        } else if (right.isDown && this.me) {
            this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
            this.setVelocityX(this.playerSpeed);
            this.setFlipX(false);
            if (this.socket) {
                this.moveState.x = this.x;
                this.moveState.y = this.y;
                this.moveState.left = false;
                this.moveState.right = true;
                this.moveState.up = false;
                this.socket.emit("updatePlayer", this.moveState);
            }
        } else {
            this.setVelocityX(0);
            if (this.socket) {
                this.moveState.x = this.x;
                this.moveState.y = this.y;
                this.moveState.left = false;
                this.moveState.right = false;
                this.moveState.up = false;
                this.socket.emit("updatePlayer", this.moveState);
            }
        }

        if (
            isSpaceJustDown &&
            this.me &&
            (onFloor || this.jumpCount < this.consecutiveJumps)
        ) {
            this.jumpSound.play();
            this.setVelocityY(-1000);
            this.jumpCount++;
            if (this.socket) {
                this.moveState.x = this.x;
                this.moveState.y = this.y;
                this.moveState.left = false;
                this.moveState.right = false;
                this.moveState.space = true;
                this.socket.emit("updatePlayer", this.moveState);
            }
        }

        if (shift.isDown && onFloor && this.me) {
            this.playerSpeed = 650;
            if (this.socket) {
                this.moveState.x = this.x;
                this.moveState.y = this.y;
                this.moveState.left = false;
                this.moveState.right = false;
                this.moveState.shift = true;
                this.socket.emit("updatePlayer", this.moveState);
            }
        } else {
            this.playerSpeed = 500;
        }

        if (onFloor) {
            this.jumpCount = 0;
        }

        onFloor
            ? this.body.velocity.x !== 0
                ? this.play(`run-${this.spriteKey}`, true)
                : this.play(`idle-${this.spriteKey}`, true)
            : this.play(`jump-${this.spriteKey}`, true);
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

    takesHit(source) {
        this.takeDamageSound.play();
        if (this.hasBeenHit) {
            return;
        }

        this.hasBeenHit = true;
        this.bounceOff(source);
        const hitAnim = this.playDamageTween();

        source.deliversHit && source.deliversHit(this);

        this.scene.time.delayedCall(500, () => {
            this.hasBeenHit = false;
            hitAnim.stop();
            this.clearTint();
        });
    }

    updateOtherPlayer(moveState) {
        // opponent moves left
        if (moveState.left) {
            if (!this.facingLeft) {
                this.flipX = !this.flipX;
                this.facingLeft = true;
            }
            this.setVelocityX(-this.playerSpeed);
            // this.play(`run-${this.spriteKey}`, true);
            console.log(moveState.x, moveState.y);
            this.setPosition(moveState.x, moveState.y);
        }

        // opponent moves right
        else if (moveState.right) {
            if (this.facingLeft) {
                this.flipX = !this.flipX;
                this.facingLeft = false;
            }
            this.setVelocityX(this.playerSpeed);
            // this.play(`run-${this.spriteKey}`, true);
            this.setPosition(moveState.x, moveState.y);
        }

        // neutral (opponent not moving)
        else {
            this.setVelocityX(0);
            this.play(`idle-${this.spriteKey}`, true);
            this.setPosition(moveState.x, moveState.y);
        }
    }
}

export default OnlinePlayer;

