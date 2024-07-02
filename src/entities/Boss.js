import initAnims from "../animations/entities/bossAnims.js";
import BossMeleeWeapon from "../attacks/BossMeleeWeapon";
import Enemy from "./BaseEnemy.js";

class Boss extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, "boss");
        initAnims(scene.anims);
    }

    init() {
        super.init();
        this.health = 700;

        this.damage = 50;
        this.setScale(1.3);
        this.setSize(180, 200);
        this.setOffset(300, 250);
        this.timeFromLastAttack = 0;
        this.attackDelay = this.getAttackDelay();
        this.meleeWeapon = new BossMeleeWeapon(
            this.scene,
            500,
            500,
            "axe-default"
        );

        this.attackRange = 500;

        this.detectionRadius = 1000;
        this.verticalDistance = 300;
        this.isAttacking = false;
    }

    getAttackDelay() {
        return Phaser.Math.Between(2500, 3000);
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

        if (
            this.isInAttackRange() &&
            time > this.timeFromLastAttack + this.attackDelay
        ) {
            this.attackPlayer("boss-melee");

            this.timeFromLastAttack = time;
            this.attackDelay = Phaser.Math.Between(1000, 3000);
        }

        if (this.isPlayingAnims("boss-melee")) {
            return;
        }

        if (this.health > 0) {
            this.play("boss-run", true);
        } else {
            this.play("boss-die", true);
        }
    }

    attackPlayer(anim) {
        this.isAttacking = true; // Set attacking flag to true

        // Stop all animations and play attack animation
        this.stop();
        this.play(anim, true);

        // Add an event listener for the specific frame (frame 8 in this example)
        this.on("animationupdate", this.onAttackFrame, this);
        this.once("animationcomplete", this.onAttackComplete, this);
    }

    onAttackFrame(animation, frame) {
        // Check if the animation is the boss-melee and it's frame 8
        if (animation.key === "boss-melee" && frame.index === 13) {
            // Deal damage to the player (you can customize this part)
            if (this.isInAttackRange()) {
                this.scene.player.takesHit({ damage: this.damage });
            }
        }
    }

    onAttackComplete(animation, frame) {
        if (animation.key === "boss-melee") {
            this.isAttacking = false; // Reset attacking flag
            this.off("animationupdate", this.onAttackFrame, this); // Remove frame listener
            this.off("animationcomplete", this.onAttackComplete, this); // Remove complete listener
        }
    }
}

export default Boss;

