import Phaser from "phaser";
import initAnimations from "../animations/entities/onlinePlayerAnims";
import anims from "../mixins/anims";
import collidable from "../mixins/collidable";

class OnlinePlayer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, spriteKey, username, socket, me) {
        super(scene, x, y, spriteKey);
        this.socket = socket;
        this.spriteKey = spriteKey;
        this.username = username;
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

        this.debugText = this.scene.add
            .text(-300, -300, "", { font: "32px Arial", fill: "#ff0000" })
            .setScrollFactor(0)
            .setDepth(30);

        this.graphics = this.scene.add.graphics().setDepth(30);
    }

    init() {
        this.initProperties();
        this.initSoundEffects();
        this.initKeyboardControls();
        this.initAnimations();
        this.initMovementSound();
    }

    // Method to initialize player-specific properties
    initProperties() {
        this.gravity = 2500;
        this.playerSpeed = 500;
        this.jumpCount = 0;
        this.consecutiveJumps = 1;
        this.hasBeenHit = false;
        this.bounceVelocity = 400;
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        this.body.setSize(120, 150);

        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        // this.setOrigin(0.5, 1);
    }

    // Method to initialize sound effects for player actions
    initSoundEffects() {
        this.jumpFx = this.scene.sound.add("jump", { volume: 0.2 });
        this.takeDamageFx = this.scene.sound.add("damage", { volume: 0.2 });
        this.stepFx = this.scene.sound.add("step", { volume: 0.05 });
    }

    initKeyboardControls() {
        this.keyBindings = this.scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
        });
    }

    // Method to load and set up animations for the player
    initAnimations() {
        initAnimations(this.scene.anims);
    }

    // Method to set up repeating event to play footstep sound effects while the player is running
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

    // Method to create a tint animation when the player takes damage
    playDamageTween() {
        return this.scene.tweens.add({
            targets: this,
            alpha: 50,
            duration: 250,
            ease: "Power1",
            yoyo: true,
            tint: 0x999999,
        });
    }

    // Method to bounce the player off a source (e.g., enemy or obstacle)
    bounceOff(source) {
        // Determine direction to bounce based on collision and set velocities
        if (source.body) {
            this.body.touching.right
                ? this.setVelocityX(-this.bounceVelocity)
                : this.setVelocityX(this.bounceVelocity);
        } else {
            this.body.blocked.right
                ? this.setVelocityX(-this.bounceVelocity)
                : this.setVelocityX(this.bounceVelocity);
        }

        // Apply vertical velocity to bounce upward
        setTimeout(() => this.setVelocityY(-this.bounceVelocity), 0);
    }

    takesHit(source) {
        // Play damage sound effect and check if player has already been hit
        this.takeDamageFx.play();
        if (this.hasBeenHit) {
            return;
        }

        // Apply hit reaction: bounce off, play damage animation
        this.hasBeenHit = true;
        this.bounceOff(source);
        const hitAnim = this.playDamageTween();

        // Trigger hit effect on the source of damage (e.g., enemy or projectile)
        source.deliversHit && source.deliversHit(this);

        // Reset hit state and animation tint after a delay
        this.scene.time.delayedCall(500, () => {
            this.hasBeenHit = false;
            hitAnim.stop();
            this.clearTint();
        });
    }

    update() {
        if (this.hasBeenHit || !this.body) {
            return;
        }

        // Check if the player is out of bounds and handle movement
        this.checkOutOfBounds();
        this.handleMovement();

        this.addDebugger();
    }

    // Method to check if the player is out of bounds and trigger appropriate actions
    checkOutOfBounds() {
        // Emit PLAYER_LOSE event if player's top boundary exceeds a certain threshold
        if (this.getBounds().top > this.scene.config.height * 2.5) {
            EventEmitter.emit("PLAYER_LOSE");
        }
    }

    handleMovement() {
        const { left, right, space, shift } = this.keyBindings;
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
        const onFloor = this.body.onFloor();

        // Handle horizontal movement based on left and right arrow keys
        this.handleHorizontalMovement(left, right);

        // Handle jumping when space key is pressed and player is on the floor
        this.handleJumping(isSpaceJustDown, onFloor);

        // Handle running when shift key is pressed and player is on the floor
        this.handleRunning(shift, onFloor);

        // Update player animation based on current state (running, idle, jumping)
        this.updatePlayerAnimation(onFloor);
    }

    // TODO: Need to fix the player in socket
    // Method to handle horizontal movement of the player
    handleHorizontalMovement(left, right) {
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
    }

    // Method to handle jumping behavior of the player
    handleJumping(isSpaceJustDown, onFloor) {
        if (
            isSpaceJustDown &&
            this.me &&
            (onFloor || this.jumpCount < this.consecutiveJumps)
        ) {
            this.jumpFx.play();
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

        // Reset jump count if player is back on the floor
        if (onFloor) {
            this.jumpCount = 0;
        }
    }

    // Method to handle running (increased speed) when shift key is pressed
    handleRunning(shift, onFloor) {
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
    }

    // Method to update player animation based on current state (running, idle, jumping)
    updatePlayerAnimation(onFloor) {
        // Play appropriate animation based on player's movement and state
        onFloor
            ? this.body.velocity.x !== 0
                ? this.play(`run-${this.spriteKey}`, true)
                : this.play(`idle-${this.spriteKey}`, true)
            : this.play(`jump-${this.spriteKey}`, true);
    }

    updateOtherPlayer(moveState) {
        // opponent moves left
        if (moveState.left) {
            if (!this.facingLeft) {
                this.flipX = !this.flipX;
                this.facingLeft = true;
            }
            this.setVelocityX(-this.playerSpeed);
            console.log(moveState.x, moveState.y);
            this.setPosition(moveState.x, moveState.y);
        }

        // opponent moves right
        if (moveState.right) {
            if (this.facingLeft) {
                this.flipX = !this.flipX;
                this.facingLeft = false;
            }
            this.setVelocityX(this.playerSpeed);
            this.setPosition(moveState.x, moveState.y);
        }

        // neutral (opponent not moving)
        // else {
        //     this.setVelocityX(0);
        //     this.play(`idle-${this.spriteKey}`, true);
        //     this.setPosition(moveState.x, moveState.y);
        // }
    }

    addDebugger() {
        if (this.body) {
            this.debugText.setText(
                `x: ${this.x.toFixed(0)}, y: ${this.y.toFixed(0)}\n` +
                    `velocityX: ${this.body.velocity.x.toFixed(
                        0
                    )}, velocityY: ${this.body.velocity.y.toFixed(0)}\n`
            );

            this.graphics.clear(); // Clear previous drawings
            this.graphics.lineStyle(2, 0xff0000); // Line style: thickness (2 pixels), color (red)
            this.graphics.beginPath();
            this.graphics.moveTo(this.x, this.y);
            this.graphics.lineTo(500, 100); // Fixed point example
            this.graphics.strokePath();
        }
    }
}

export default OnlinePlayer;

