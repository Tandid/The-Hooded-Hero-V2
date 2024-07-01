import initAnims from "../animations/entities/skeletonAnims";
import Enemy from "./BaseEnemy";

class Skeleton extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, "skeleton");
        initAnims(scene.anims);
    }

    init() {
        super.init();
        this.health = 200;
        this.damage = 30;
        this.setSize(120, 170);

        this.attackDelay = Phaser.Math.Between(1000, 2000);
        this.timeFromLastAttack = 0;
        this.attackRange = 25;
        this.maxPatrolDistance = 500;
    }

    update(time, delta) {
        super.update(time, delta);

        if (!this.active) {
            return;
        }

        // Perform attack if player is in range and enough time has passed since last attack
        if (
            this.isInAttackRange() &&
            time > this.timeFromLastAttack + this.attackDelay
        ) {
            this.attackPlayer("skeleton-attack");
            this.timeFromLastAttack = time;
            this.attackDelay = Phaser.Math.Between(1000, 4000);
        }

        if (this.isPlayingAnims("skeleton-attack")) {
            return;
        }

        if (this.health > 0) {
            this.play("skeleton-run", true);
        } else {
            this.play("skeleton-die", true);
        }
    }

    attackPlayer(anim) {
        // Stop all animations and play attack animation
        this.stop();
        this.play(anim);

        // Deal damage to the player (you can customize this part)
        this.scene.player.takesHit({ damage: this.damage });
    }
}

export default Skeleton;

