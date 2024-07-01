import initAnims from "../animations/entities/beeAnims";
import Enemy from "./BaseEnemy";

class Bee extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, "bee");
        initAnims(scene.anims);
    }

    init() {
        super.init();
        this.health = 120;
        this.damage = 20;
        this.setSize(100, 120);
        this.canFly = true;
        this.attackDelay = Phaser.Math.Between(1000, 2000);
        this.timeFromLastAttack = 0;
        this.attackRange = 75;
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
            this.attackPlayer("bee-attack");
            this.timeFromLastAttack = time;
            this.attackDelay = Phaser.Math.Between(1000, 4000);
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
        // Stop all animations and play attack animation
        this.stop();
        this.play(anim);

        // Deal damage to the player (you can customize this part)
        this.scene.player.takesHit({ damage: this.damage });
    }
}

export default Bee;

