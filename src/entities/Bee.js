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
        this.setSize(120, 140);
        this.canFly = true;
    }

    update(time, delta) {
        super.update(time, delta);

        if (!this.active) {
            return;
        }

        if (this.health > 0) {
            this.play("bee-fly", true);
        } else {
            this.play("bee-die", true);
        }
    }
}

export default Bee;

