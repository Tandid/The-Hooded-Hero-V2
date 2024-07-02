import Phaser from "phaser";
import initAnims from "../animations/entities/beeAnims";
import Enemy from "./BaseEnemy";

class Bee extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, "bee");
        initAnims(scene.anims);
        this.position = new Phaser.Math.Vector2(x, y); // Store position as a vector
    }

    init() {
        super.init();
        this.health = 120;
        this.damage = 20;
        this.setSize(60, 120);
        this.canFly = true;

        this.attackDelay = Phaser.Math.Between(1000, 2000);
        this.timeFromLastAttack = 0;
        this.isAttacking = false;
    }

    update(time, delta) {
        super.update(time, delta);

        if (!this.active) {
            return;
        }

        if (this.isAttacking) {
            // Stop moving if attacking
            this.setVelocity(0, 0);
            return;
        }

        // Perform attack if player is in range and enough time has passed since last attack
        if (
            this.isInAttackRange(100, 300) &&
            time > this.timeFromLastAttack + this.attackDelay
        ) {
            this.attackPlayer("bee-attack");
            this.timeFromLastAttack = time;
            this.attackDelay = Phaser.Math.Between(1000, 3000);
        }

        if (this.isPlayingAnims("bee-attack")) {
            return;
        }

        if (this.health > 0) {
            this.play("bee-fly", true);
        } else {
            this.play("bee-die", true);
        }
    }

    attackPlayer(anim) {
        this.isAttacking = true; // Set attacking flag to true

        // Stop all animations and play attack animation
        this.stop();
        this.play(anim);

        // Add an event listener for the animation complete event
        this.on("animationcomplete", this.onAttackComplete, this);
    }

    onAttackComplete(animation, frame) {
        if (animation.key === "bee-attack") {
            // Deal damage to the player (you can customize this part)
            if (this.isInAttackRange(25, 250)) {
                this.scene.player.takesHit({ damage: this.damage });
            }

            this.isAttacking = false; // Reset attacking flag
            this.off("animationcomplete", this.onAttackComplete, this); // Remove the event listener
        }
    }
}

export default Bee;

