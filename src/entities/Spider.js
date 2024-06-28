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
    }

    update(time, delta) {
        super.update(time, delta);

        if (!this.active) {
            return;
        }

        if (this.health > 0) {
            this.play("spider-run", true);
        } else {
            this.play("spider-die", true);
        }
    }
}

export default Spider;

