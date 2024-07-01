// Import Phaser library if not already imported
import Phaser from "phaser";

// Import mixins for additional functionality
import anims from "../mixins/anims";
import collidable from "../mixins/collidable";

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        // Store scene configuration for access throughout the class
        this.config = scene.config;

        // Add the enemy to the scene and enable physics for it
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Mix in additional methods from collidable and anims mixins
        Object.assign(this, collidable);
        Object.assign(this, anims);

        // Initialize enemy properties and setup
        this.init();
        this.initEvents();
    }

    // Initialize properties and settings for the enemy
    init() {
        this.gravity = 500;
        this.speed = 200;
        this.maxPatrolDistance = null;
        this.currentPatrolDistance = 0;

        this.health = 100;
        this.damage = 10;

        this.detectionRadius = 500; // Radius to detect the player
        this.attackRange = 50; // Range to attack the player
        this.isFollowingPlayer = false; // Flag to indicate if the enemy is following the player

        // Sound effect for when the enemy takes damage
        this.takeDamageSound = this.scene.sound.add("enemy-damage", {
            volume: 0.1,
        });

        // Set initial physics properties for the enemy
        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
        this.setOrigin(0.5, 1);
        this.setVelocityX(this.speed);

        // Initialize damage number properties
        this.damageNumbers = this.scene.add.group();

        // Initialize blinking properties
        this.blinkTween = null;

        this.player = this.scene.player;
        this.canFly = false;

        // Graphics object to visualize raycast and detection radius for debugging
        this.rayGraphics = this.scene.add.graphics({
            lineStyle: { width: 2, color: 0xaa00aa },
        });

        this.detectionGraphics = this.scene.add.graphics({
            lineStyle: { width: 2, color: 0xff0000 },
        });
    }

    // Initialize events, such as the update loop for the enemy
    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    // Set the platform colliders layer for the enemy
    setPlatformColliders(platformCollidersLayer) {
        this.platformCollidersLayer = platformCollidersLayer;
    }

    // Update method called automatically by Phaser
    update() {
        if (!this.active) {
            return;
        }

        // Check if the enemy has fallen below a certain point and destroy it if so
        if (this.getBounds().bottom > 1500) {
            this.destroyEnemy();
            return;
        }

        if (this.player) {
            // Detect the player
            this.detectPlayer();

            // If following the player, move towards the player
            if (this.isFollowingPlayer) {
                this.followPlayer();
            } else {
                this.patrol();
            }
        }

        // Handle blinking when health is below 40%
        if (this.health < 40) {
            this.playLowHealthTween();
        }
    }

    // Detect if the player is within the detection radius
    detectPlayer() {
        const distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.player.x,
            this.player.y
        );

        let verticalDistanceFromPlayer = Math.abs(
            Math.floor(this.player.y - this.y)
        );

        // Check if the player is within the detection radius
        if (this.canFly && distance <= this.detectionRadius) {
            this.isFollowingPlayer = true;
        } else if (
            !this.canFly &&
            distance <= this.detectionRadius &&
            verticalDistanceFromPlayer <= 100
        ) {
            this.isFollowingPlayer = true;
        } else {
            this.isFollowingPlayer = false;
        }
    }

    // Move towards the player when detected
    followPlayer() {
        if (this.canFly) {
            this.scene.physics.moveToObject(this, this.player, 350);
            this.setFlipX(this.player.x < this.x);
        } else {
            if (this.player.x < this.x) {
                this.setVelocityX(-300);
                this.setFlipX(true);
            } else {
                this.setVelocityX(300);
                this.setFlipX(false);
            }
        }
    }

    // Perform patrolling behavior for the enemy
    patrol() {
        // Skip patrolling if the enemy is not on the floor
        if (!this.body || !this.body.onFloor()) {
            return;
        }

        // Track the distance traveled during patrolling
        this.currentPatrolDistance += Math.abs(this.body.deltaX());

        // Perform a raycast to detect obstacles in front of the enemy
        const { ray, hasHit } = this.raycast(
            this.body,
            this.platformCollidersLayer,
            {
                precision: 1,
                steepnes: 0.2,
            }
        );

        // Change direction if no obstacles are ahead or maximum distance is reached
        if (
            !hasHit ||
            this.currentPatrolDistance >=
                (this.maxPatrolDistance || this.platformCollidersLayer.width)
        ) {
            this.turnAround();
        }

        // Check if the enemy is stationary
        if (this.body.velocity.x === 0) {
            this.turnAround();
        }

        // Display the raycast for debugging purposes if debug mode is enabled
        if (this.config.debug && ray) {
            // Draw raycast
            this.drawRayCast(ray);

            // Draw detection radius for debugging
            this.drawDetectionRadius();
        }
    }

    // Check if the player is within attack range
    isInAttackRange() {
        if (!this.player) {
            return false;
        }
        const distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.player.x,
            this.player.y
        );
        return distance <= this.attackRange;
    }

    // Play a damage animation and effects when the enemy takes a hit
    takesHit(source) {
        // Play the damage sound effect
        this.takeDamageSound.play();

        // Prevent taking multiple hits simultaneously
        if (this.hasBeenHit) {
            return;
        }

        // Mark the enemy as hit and trigger hit effects
        this.hasBeenHit = true;
        source.deliversHit(this);
        const hitAnim = this.playDamageTween();

        // Reset hit state and effects after a delay
        this.scene.time.delayedCall(250, () => {
            this.hasBeenHit = false;
            hitAnim.stop();
            this.clearTint();
        });

        // Reduce enemy health and handle death if health drops to zero
        this.health -= source.damage;
        if (this.health <= 0) {
            this.die();
        } else {
            // Show damage number above the enemy
            this.showDamageNumber(source.damage);
        }
    }

    // Perform actions when the enemy dies
    die() {
        // Disable physics and gravity
        this.body.setEnable(false);
        this.body.setGravityY(0);

        // Move the enemy downwards
        this.setVelocity(0, 100); // Adjust the velocity as needed

        // Optionally, destroy the enemy after a delay
        this.scene.time.delayedCall(500, () => {
            this.destroy();
        });
    }

    // Destroy the enemy instance
    destroyEnemy() {
        // Remove update event listener, deactivate enemy, clear raycast graphics, and destroy
        this.scene.events.removeListener(
            Phaser.Scenes.Events.UPDATE,
            this.update,
            this
        );
        this.setActive(false);
        this.rayGraphics.clear();
        this.detectionGraphics.clear();
        this.destroy();
    }

    // Perform a turn around action (change direction)
    turnAround() {
        // Reverse its movement direction
        this.setVelocityX((this.speed = -this.speed));
        this.setFlipX(this.body.velocity.x < 0);
        this.currentPatrolDistance = 0;
    }

    // Start blinking effect when health is below 40%
    playLowHealthTween() {
        if (!this.blinkTween) {
            this.blinkTween = this.scene.tweens.add({
                targets: this,
                alpha: 50,
                duration: 250,
                ease: "Power1",
                yoyo: true,
                repeat: -1,
                tint: 0xff0000,
            });
        }
    }

    // Play a damage animation tween effect
    playDamageTween() {
        return this.scene.tweens.add({
            targets: this,
            alpha: 50,
            duration: 250,
            ease: "Power1",
            yoyo: true,
            tint: 0x222222,
        });
    }

    // Show damage number above the enemy
    showDamageNumber(damage) {
        const damageText = this.scene.add.text(
            this.x,
            this.y - 100,
            `${damage}`,
            {
                fontFamily: "customFont",
                fontSize: 75,
                color: "#ffff00",
            }
        );

        damageText.setOrigin(0.5, 0.5);
        damageText.setDepth(1);

        this.damageNumbers.add(damageText);

        this.scene.tweens.add({
            targets: damageText,
            y: damageText.y - 50,
            alpha: 0,
            duration: 1000,
            ease: "Cubic.Out",
            onComplete: () => {
                damageText.destroy();
            },
        });
    }

    drawRayCast(ray) {
        this.rayGraphics.clear();
        this.rayGraphics.strokeLineShape(ray);
    }

    // Draw the detection radius for debugging purposes
    drawDetectionRadius() {
        this.detectionGraphics.clear();
        this.detectionGraphics.strokeCircle(
            this.x,
            this.y,
            this.detectionRadius
        );
    }
}

export default Enemy;

