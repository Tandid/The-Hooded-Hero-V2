import Phaser from "phaser";
import { getTimestamp } from "../utils/functions";
import Projectile from "./Projectile";

class ProjectileManager extends Phaser.Physics.Arcade.Group {
    constructor(scene, key) {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 5,
            active: false,
            visible: false,
            key,
            classType: Projectile,
        });

        this.timeFromLastProjectile = null;
    }

    fireProjectile(entity, anim) {
        const projectile = this.getFirstDead(false);

        if (!projectile) return;

        if (this.isInCooldown(projectile)) return;

        const { centerX, centerY } = this.getProjectilePosition(
            entity,
            projectile
        );

        this.launchProjectile(projectile, centerX, centerY, anim);
        this.timeFromLastProjectile = getTimestamp();
    }

    isInCooldown(projectile) {
        return (
            this.timeFromLastProjectile &&
            this.timeFromLastProjectile + projectile.cooldown > getTimestamp()
        );
    }

    getProjectilePosition(entity, projectile) {
        const entityCenter = entity.getCenter();
        let centerX;

        if (entity.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
            projectile.speed = Math.abs(projectile.speed);
            projectile.setFlipX(false);
            centerX = entityCenter.x + 10;
        } else {
            projectile.speed = -Math.abs(projectile.speed);
            projectile.setFlipX(true);
            centerX = entityCenter.x - 10;
        }

        const centerY = entityCenter.y + entityCenter.y / 20;
        return { centerX, centerY };
    }

    launchProjectile(projectile, x, y, anim) {
        projectile.fire(x, y, anim);
    }
}

export default ProjectileManager;

