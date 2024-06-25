// @ts-nocheck

import { GameObjects, Scene } from "phaser";

class BaseScene extends Scene {
    config: any;
    screenCenter: Array<number>;
    fontSize: number;
    fontFamily: string;
    lineHeight: number;
    fontOptions: Object;
    leaves: GameObjects.Image[];
    arrows: GameObjects.Image[];

    constructor(key: any, config: any) {
        super(key);
        this.config = {
            width: 1280,
            height: 720,
        };
        this.screenCenter = [this.config.width / 2, this.config.height / 2];
        this.fontSize = 60;
        this.fontFamily = "customFont";

        this.lineHeight = 75;
        this.fontOptions = {
            fontFamily: `${this.fontFamily}`,
            fontSize: `${this.fontSize}px`,
            fill: "#000",
            fontWeight: "larger",
        };
    }

    // init(data) {
    //     this.socket = data.socket;
    //     this.username = data.username;
    // }

    create() {
        console.log("Hello");
        this.add.image(0, 0, "sky-bg").setOrigin(0).setScale(1).setDepth(-1);
        this.add
            .image(0, 0, "mountain-bg")
            .setOrigin(0)
            .setScale(1)
            .setDepth(-1);

        this.add
            .image(this.config.width / 30, this.config.height - 400, "tree-1")
            .setOrigin(0.5)
            .setScale(2)
            .setDepth(-1);

        const totalLeavesNum = 20;
        this.leaves = [];
        for (let i = 0; i < totalLeavesNum; i++) {
            const x = Math.floor(Math.random() * this.scale.width);
            const y = Math.floor(Math.random() * this.scale.height);
            const angle = Math.floor(Math.random() * -10);
            const leaf = this.add
                .image(x, y, "leaf")
                .setScale(1.5)
                .setAngle(angle)
                .setDepth(-1);
            this.tweens.add({
                targets: leaf,
                delay: i * 100,
                repeat: -1,
                yoyo: true,
            });
            this.leaves.push(leaf);
        }

        const totalArrowsNum = 5;
        this.arrows = [];
        for (let i = 0; i < totalArrowsNum; i++) {
            const x = Math.floor(Math.random() * this.scale.width);
            const y = Math.floor(Math.random() * this.scale.height);
            const angle = Math.floor(Math.random() * -10);
            const arrow = this.add
                .image(x, y, "arrow")
                .setScale(1.5)
                .setAngle(angle)
                .setDepth(-1);
            this.tweens.add({
                targets: arrow,
                delay: i * 100,
                repeat: -1,
                yoyo: true,
            });
            this.arrows.push(arrow);
        }
    }

    createMenu(menu, setupMenuEvents) {
        let lastMenuPositionY = 0;

        menu.forEach((menuItem) => {
            const menuPosition = [
                this.screenCenter[0],
                this.screenCenter[1] + lastMenuPositionY,
            ];
            menuItem.textGO = this.add
                .text(...menuPosition, menuItem.text, this.fontOptions)
                .setOrigin(0.5, 1);
            lastMenuPositionY += this.lineHeight;
            setupMenuEvents(menuItem);
        });
    }

    update() {
        this.leaves.forEach((leaf) => {
            leaf.y += 0.4;
            leaf.x += -0.9;
            if (leaf.x < 0) {
                leaf.x = this.scale.width + 100;
                leaf.y = Math.floor(Math.random() * this.scale.height);
            }
        });

        this.arrows.forEach((arrow) => {
            arrow.x += 5;
            if (arrow.x > 1600) {
                arrow.x = this.scale.width - 1600;
                arrow.y = Math.floor(Math.random() * this.scale.height);
            }
        });
    }
}

export default BaseScene;

