import { GameObjects, Scene } from "phaser";
// import io, { Socket } from "socket.io-client";

export default class BaseScene extends Scene {
    // static socket: Socket;
    config: any;

    // Sound Effects
    cursorOverFx: any;
    selectFx: any;
    pageFlipFx: any;
    fluteFx: any;
    collectFx: any;

    // Music Themes
    menuBGM: any;
    forestBGM: any;
    caveBGM: any;
    bossBGM: any;

    screenCenter: Array<number>;
    fontSize: number;
    fontFamily: string;
    lineHeight: number;

    fontOptions: {};
    leaves: GameObjects.Image[];
    arrows: GameObjects.Image[];

    constructor(key: any, config: any) {
        super(key);
        // if (!BaseScene.socket) {
        //     BaseScene.socket = io("http://localhost:3000");
        // }
        this.config = config;
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

    create() {
        this.addSoundEffects();
        this.addMusicThemes();
    }

    createBackground() {
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

        this.createArrows();
        this.createLeaves();
    }

    addSoundEffects() {
        this.cursorOverFx = this.sound.add("cursorOver", { volume: 0.4 });
        this.selectFx = this.sound.add("select", { volume: 0.4 });
        this.pageFlipFx = this.sound.add("page-flip", { volume: 0.4 });
        this.fluteFx = this.sound.add("flute", { volume: 0.4 });
        this.collectFx = this.sound.add("coin-pickup", { volume: 0.05 });
    }

    addMusicThemes() {
        this.menuBGM = this.sound.add("menu-theme", {
            loop: true,
            volume: 0.04,
        });
        this.forestBGM = this.sound.add("forest-theme", {
            loop: true,
            volume: 0.04,
        });
        this.caveBGM = this.sound.add("cave-theme", {
            loop: true,
            volume: 0.04,
        });
        this.bossBGM = this.sound.add("boss-theme", {
            loop: true,
            volume: 0.04,
        });
    }

    createLeaves() {
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
    }

    createArrows() {
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

            arrow.setData({
                speed: Phaser.Math.Between(5, 10), // Random horizontal speed between 5 and 10
                gravity: Phaser.Math.FloatBetween(0.1, 0.5), // Random gravity value between 0.1 and 0.5
            });

            this.arrows.push(arrow);
        }
    }

    createMenu(menu: any[], setupMenuEvents: any) {
        let lastMenuPositionY = 0;

        menu.forEach((menuItem) => {
            const menuPosition = [
                this.screenCenter[0],
                this.screenCenter[1] + lastMenuPositionY,
            ];
            menuItem.textGO = this.add
                .text(
                    menuPosition[0],
                    menuPosition[1],
                    menuItem.text,
                    this.fontOptions
                )
                .setOrigin(0.5, 1);
            lastMenuPositionY += this.lineHeight;
            setupMenuEvents(menuItem);
        });
    }

    createButton(
        x: number,
        y: number,
        texture: string,
        callback: () => void,
        text?: string
    ) {
        const button = this.add
            .image(0, 0, texture)
            .setOrigin(0.5)
            .setScale(0.7);

        const buttonText = this.add
            .text(0, 0, text || "", {
                fontFamily: "customFont",
                fontSize: "30px",
            })
            .setOrigin(0.5)
            .setColor("#000000");

        const container = this.add.container(x, y, [button, buttonText]);
        container.setSize(button.width * 0.7, button.height * 0.7);
        container.setDepth(2).setInteractive();

        container.on("pointerup", () => {
            this.selectFx.play();
            this.game.canvas.classList.remove("custom-cursor");
            callback();
        });

        container.on("pointerover", () => {
            this.cursorOverFx.play();
            button.setTint(0xc2c2c2);
            this.game.canvas.classList.add("custom-cursor");
        });

        container.on("pointerout", () => {
            button.clearTint();
            this.game.canvas.classList.remove("custom-cursor");
        });

        return container;
    }

    update() {
        this.leaves?.forEach((leaf) => {
            leaf.y += 0.4;
            leaf.x += -0.9;
            if (leaf.x < 0) {
                leaf.x = this.scale.width + 100;
                leaf.y = Math.floor(Math.random() * this.scale.height);
            }
        });

        this.arrows?.forEach((arrow) => {
            const speed = arrow.getData("speed");
            const gravity = arrow.getData("gravity");

            arrow.x += speed;
            arrow.y += gravity * 10; // Apply gravity (multiplied by 10 for smoother effect)

            if (arrow.x > 1600) {
                arrow.x = this.scale.width - 1600;
                arrow.y = Math.floor(Math.random() * this.scale.height);
                arrow.setData("speed", Phaser.Math.Between(5, 10)); // Reset horizontal speed
                arrow.setData("gravity", Phaser.Math.FloatBetween(0.1, 0.5)); // Reset gravity
            }
        });
    }
}

