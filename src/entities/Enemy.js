import Phaser from "phaser";

import collidable from "../mixins/collidable";
import anims from "../mixins/anims";

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    this.config = scene.config;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Mixins
    Object.assign(this, collidable);
    Object.assign(this, anims);

    this.init();
    this.initEvents();
  }

  init() {
    this.gravity = 500;
    this.speed = 150;
    this.timeFromLastTurn = 0;
    this.maxPatrolDistance = 1000;
    this.currentPatrolDistance = 0;

    this.health = 100;
    this.damage = 10;
    this.takeDamageSound = this.scene.sound.add("enemy-damage", {
      volume: 0.1,
    });

    this.platformCollidersLayer = null;
    this.rayGraphics = this.scene.add.graphics({
      lineStyle: { width: 2, color: 0xaa00aa },
    });

    this.body.setGravityY(this.gravity);
    this.setCollideWorldBounds(true);
    this.setImmovable(true);
    this.setOrigin(0.5, 1);
    this.setVelocityX(this.speed);
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update(time) {
    if (this.getBounds().bottom > 1500) {
      this.scene.events.removeListener(
        Phaser.Scenes.Events.UPDATE,
        this.update,
        this
      );
      this.setActive(false);
      this.rayGraphics.clear();
      this.destroy();
      return;
    }

    this.patrol(time);
  }

  patrol(time) {
    if (!this.body || !this.body.onFloor()) {
      return;
    }

    this.currentPatrolDistance += Math.abs(this.body.deltaX());

    const { ray, hasHit } = this.raycast(
      this.body,
      this.platformCollidersLayer,
      {
        precision: 1,
        steepnes: 0.2,
      }
    );

    if (
      (!hasHit || this.currentPatrolDistance >= this.maxPatrolDistance) &&
      this.timeFromLastTurn + 100 < time
    ) {
      this.setFlipX(!this.flipX);
      this.setVelocityX((this.speed = -this.speed));
      this.timeFromLastTurn = time;
      this.currentPatrolDistance = 0;
    }

    if (this.config.debug && ray) {
      this.rayGraphics.clear();
      this.rayGraphics.strokeLineShape(ray);
    }
  }

  setPlatformColliders(platformCollidersLayer) {
    this.platformCollidersLayer = platformCollidersLayer;
  }

  // Enemy is source of the damage for the player
  deliversHit() {}

  playDamageTween() {
    return this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: -1,
      tint: 0xffffff,
    });
  }

  takesHit(source) {
    this.takeDamageSound.play();
    if (this.hasBeenHit) {
      return;
    }
    this.hasBeenHit = true;
    source.deliversHit(this);
    const hitAnim = this.playDamageTween();
    this.scene.time.delayedCall(250, () => {
      this.hasBeenHit = false;
      hitAnim.stop();
      this.clearTint();
    });

    this.health -= source.damage;

    if (this.health <= 0) {
      this.setVelocity(50, -50);
      this.body.checkCollision.none = true;
      this.setCollideWorldBounds(false);
      // setTimeout(() => this.destroy(), 1000);
    }
  }
}

export default Enemy;
