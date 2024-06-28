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

        // Initialize damage number properties
        this.damageNumbers = scene.add.group();

        // Initialize blinking properties
        this.blinkTween = null;
    }

    // Initialize properties and settings for the enemy
    init() {
        this.gravity = 500;
        this.speed = 150;
        this.timeFromLastTurn = 0;
        this.maxPatrolDistance = 1000;
        this.currentPatrolDistance = 0;

        this.health = 100;
        this.damage = 10;

        // Sound effect for when the enemy takes damage
        this.takeDamageSound = this.scene.sound.add("enemy-damage", {
            volume: 0.1,
        });

        // Graphics object to visualize raycast for debugging
        this.rayGraphics = this.scene.add.graphics({
            lineStyle: { width: 2, color: 0xaa00aa },
        });

        // Set initial physics properties for the enemy
        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
        this.setOrigin(0.5, 1);
        this.setVelocityX(this.speed);
    }

    // Initialize events, such as the update loop for the enemy
    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    // Update method called automatically by Phaser
    update(time, delta) {
        // Check if the enemy has fallen below a certain point and destroy it if so
        if (this.getBounds().bottom > 1500) {
            this.destroyEnemy();
            return;
        }

        // Perform patrolling behavior
        this.patrol(time);

        // Handle blinking when health is below 40%
        if (this.health < 40) {
            this.startBlinking();
        }
    }

    // Perform patrolling behavior for the enemy
    patrol(time) {
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
            (!hasHit || this.currentPatrolDistance >= this.maxPatrolDistance) &&
            this.timeFromLastTurn + 100 < time
        ) {
            this.turnAround();
        }

        // Display the raycast for debugging purposes if debug mode is enabled
        if (this.config.debug && ray) {
            this.rayGraphics.clear();
            this.rayGraphics.strokeLineShape(ray);
        }
    }

    // Set the platform colliders layer for the enemy
    setPlatformColliders(platformCollidersLayer) {
        this.platformCollidersLayer = platformCollidersLayer;
    }

    // Placeholder method for future implementation where the enemy delivers a hit
    deliversHit() {
        // Currently not implemented
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
        this.destroy();
    }

    // Play a damage animation tween effect
    playDamageTween() {
        return this.scene.tweens.add({
            targets: this,
            duration: 100,
            repeat: -1,
            tint: 0xffffff,
        });
    }

    // Perform actions when the enemy dies
    die() {
        // Disable physics and gravity
        this.body.setEnable(false);
        this.body.setGravityY(0);

        // Move the enemy downwards
        this.setVelocity(0, 100); // Adjust the velocity as needed

        // Optionally, destroy the enemy after a delay
        this.scene.time.delayedCall(1000, () => {
            this.destroy();
        });
    }

    // Perform a turn around action (change direction)
    turnAround() {
        // Flip the enemy sprite horizontally and reverse its movement direction
        this.setFlipX(!this.flipX);
        this.setVelocityX((this.speed = -this.speed));
        this.timeFromLastTurn = this.scene.time.now;
        this.currentPatrolDistance = 0;
    }

    // Start blinking effect when health is below 40%
    startBlinking() {
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

    // Show damage number above the enemy
    showDamageNumber(damage) {
        const damageText = this.scene.add.text(
            this.x,
            this.y - 100,
            `${damage}`,
            {
                fontFamily: "customFont",
                fontSize: 50,
                color: "#ff0000",
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
}

export default Enemy;

