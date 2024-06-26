import Phaser from "phaser";
import EventEmitter from "../../../events/Emitter";

class BaseUIScene extends Phaser.Scene {
    config: any;
    cursorOver: any;
    select: any;

    constructor(key: any, config: any) {
        super(key);
        this.config = config;
    }

    create({ gameStatus }: any) {
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.createPage();
        this.addSoundEffects();
    }

    addSoundEffects() {
        this.cursorOver = this.sound.add("cursorOver", { volume: 0.4 });
        this.select = this.sound.add("select", { volume: 0.4 });
    }

    createPage() {
        // This method should be overridden in the derived classes
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
            callback();
            this.game.canvas.classList.remove("custom-cursor");
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

    createHomeButton(x: number, y: number) {
        return this.createButton(x, y, "home-btn-big", () => {
            this.scene.stop("PlayScene");
            this.scene.start("MainMenu");
        });
    }

    createRestartButton(x: number, y: number, sceneKey: string) {
        return this.createButton(x, y, "restart-btn-big", () => {
            this.scene.stop(sceneKey);
            EventEmitter.emit("RESTART_GAME");
        });
    }
}

export default BaseUIScene;

