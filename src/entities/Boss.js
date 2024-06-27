import EnemyBoss from "./EnemyBoss";
import initAnims from "./anims/bossAnims.js";
import BossMeleeWeapon from "../attacks/BossMeleeWeapon";

class Boss extends EnemyBoss {
  constructor(scene, x, y) {
    super(scene, x, y, "boss");
    initAnims(scene.anims);
  }

  init() {
    super.init();
    this.health = 700;

    this.damage = 50;
    this.setScale(1.3);
    this.setSize(250, 250);
    this.setOffset(280, 200);
    this.maxPatrolDistance = 600;
    this.timeFromLastAttack = 0;
    this.attackDelay = this.getAttackDelay();
    this.meleeWeapon = new BossMeleeWeapon(this.scene, 500, 500, "axe-default");
  }

  getAttackDelay() {
    return Phaser.Math.Between(2500, 3000);
  }

  update(time, delta) {
    super.update(time, delta);

    if (!this.active) {
      return;
    }

    if (this.timeFromLastAttack + this.attackDelay <= time) {
      this.play("boss-melee", true);
      // this.meleeWeapon.swing(this);
      if (this.flipX === true) {
        setTimeout(() => this.setSize(500, 250), 700);
        setTimeout(() => this.setOffset(100, 200), 700);
      } else {
        setTimeout(() => this.setSize(500, 250), 700);
        setTimeout(() => this.setOffset(300, 200), 700);
      }

      // this.projectiles.fireProjectile(this, "fire");

      this.timeFromLastAttack = time;
      this.attackDelay = this.getAttackDelay();
    }

    if (this.isPlayingAnims("boss-melee")) {
      setTimeout(() => this.setSize(250, 250), 800);
      setTimeout(() => this.setOffset(280, 200), 800);
      return;
    }

    if (this.health > 0) {
      this.play("boss-run", true);
    } else {
      this.play("boss-die", true);
    }
  }
}

export default Boss;
