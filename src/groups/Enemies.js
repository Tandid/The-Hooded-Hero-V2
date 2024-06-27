import Phaser from "phaser";
import Archer from "../entities/Archer";
import Bee from "../entities/Bee";
import Boss from "../entities/Boss";
import Mage from "../entities/Mage";
import Skeleton from "../entities/Skeleton";
import Slime from "../entities/Slime";
import Spider from "../entities/Spider";
import collidable from "../mixins/collidable";

const ENEMY_TYPES = {
    Skeleton,
    Archer,
    Mage,
    Slime,
    Bee,
    Spider,
    Boss,
};

class Enemies extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);

        Object.assign(this, collidable);
    }

    getProjectiles() {
        const projectiles = new Phaser.GameObjects.Group();

        this.getChildren().forEach((enemy) => {
            enemy.projectiles &&
                projectiles.addMultiple(enemy.projectiles.getChildren());
        });

        return projectiles;
    }

    getTypes() {
        return ENEMY_TYPES;
    }
}

export default Enemies;

