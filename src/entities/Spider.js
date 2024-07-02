import initAnims from "../animations/entities/spiderAnims";
import Enemy from "./BaseEnemy";

class Spider extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, "spider");
        initAnims(scene.anims);
    }

    init() {
        super.init();
        this.health = 150;
        this.damage = 20;
        this.setSize(120, 90);
        this.setOffset(30, 20);
        this.attackDelay = Phaser.Math.Between(1000, 2000);
        this.timeFromLastAttack = 0;
        this.attackRange = 25;
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
            this.attackPlayer("spider-attack");
            this.timeFromLastAttack = time;
            this.attackDelay = Phaser.Math.Between(1000, 4000);
        }

        if (this.isPlayingAnims("spider-attack")) {
            return;
        }

        if (this.health > 0) {
            this.play("spider-run", true);
        } else {
            this.play("spider-die", true);
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

export default Spider;

