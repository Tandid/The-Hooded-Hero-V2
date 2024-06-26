import Phaser from "phaser";

class BaseUIScene extends Phaser.Scene {
    config: any;
    cursorOver: any;
    select: any;
    pageFlip: any;

    constructor(key: any, config: any) {
        super(key);
        this.config = config;
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.createPage();

        this.addSoundEffects();
    }

    addSoundEffects() {
        this.cursorOver = this.sound.add("cursorOver", { volume: 0.4 });
        this.select = this.sound.add("select", { volume: 0.4 });
        this.pageFlip = this.sound.add("page-flip", { volume: 0.4 });
    }

    createPage() {
        // This gets overriden by Scenes that extend from this one
    }

    createButton(x: number, y: number, texture: string, callback: () => void) {
        const button = this.add
            .image(x, y, texture)
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive()
            .setDepth(2);

        button.on("pointerup", () => {
            this.select.play();
            this.game.canvas.classList.remove("custom-cursor");
            callback();
        });

        button.on("pointerover", () => {
            this.cursorOver.play();
            button.setTint(0xc2c2c2);
            this.game.canvas.classList.add("custom-cursor");
        });

        button.on("pointerout", () => {
            button.clearTint();
            this.game.canvas.classList.remove("custom-cursor");
        });

        return button;
    }
}

export default BaseUIScene;

