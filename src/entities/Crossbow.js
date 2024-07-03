import initAnims from "../animations/entities/crossbowAnims";
import ProjectileManager from "../attacks/ProjectileManager";
import Enemy from "./BaseEnemy";

class Crossbow extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, "crossbow");
        initAnims(scene.anims);
    }

    init() {
        super.init();
        this.speed = 10;
        this.health = 200;
        this.damage = 20;
        this.maxPatrolDistance = 0;
        this.isStationary = true;

        this.projectiles = new ProjectileManager(this.scene, "arrow");
        this.timeFromLastAttack = 0;
        this.attackDelay = this.getAttackDelay();
        this.lastDirection = null;
        this.setFlipX(!this.flipX);

        this.setSize(120, 170);
    }

    update(time, delta) {
        super.update(time, delta);

        if (!this.active) {
            return;
        }

        if (this.timeFromLastAttack + this.attackDelay <= time) {
            this.play("crossbow-attack", true);
            this.projectiles.fireProjectile(this, "arrow");

            this.timeFromLastAttack = time;
            this.attackDelay = this.getAttackDelay();
        }

        if (this.isPlayingAnims("crossbow-attack")) {
            return;
        }

        if (this.health > 0) {
            this.play("crossbow-idle", true);
        } else {
            this.play("crossbow-die", true);
        }
    }

    getAttackDelay() {
        return Phaser.Math.Between(1000, 3500);
    }

    patrol() {
        if (!this.body || !this.body.onFloor()) {
            return;
        }

        const { ray, hasHit } = this.raycast(
            this.body,
            this.platformCollidersLayer,
            {
                precision: 1,
                steepnes: 0.2,
            }
        );

        // if (!hasHit) {
        //   this.setVelocityX((this.speed = 0));
        // }

        if (this.config.debug && ray) {
            this.rayGraphics.clear();
            this.rayGraphics.strokeLineShape(ray);
        }
    }
}

export default Crossbow;

