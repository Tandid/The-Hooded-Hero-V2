import Phaser from "phaser";
import EventEmitter from "../../../events/Emitter";

class GameOver extends Phaser.Scene {
    config: any;
    gameOver: any;
    cursorOver: any;
    select: any;

    constructor(config: any) {
        super("GameOver");
        this.config = config;
    }

    create({ gameStatus }: any) {
        console.log(gameStatus);
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.createPage();
        this.addSoundEffects();
    }

    addSoundEffects() {
        this.gameOver = this.sound.add("lose", { volume: 0.1 }).play();

        this.cursorOver = this.sound.add("cursorOver");
        this.cursorOver.volume = 0.4;

        this.select = this.sound.add("select");
        this.select.volume = 0.4;
    }

    createPage() {
        this.add
            .image(this.config.width / 2, this.config.height / 2, "panel-1")
            .setOrigin(0.5)
            .setScale(0.7);

        this.add
            .image(
                this.config.width / 2,
                this.config.height / 6,
                "header-shadow"
            )
            .setOrigin(0.5)
            .setScale(0.7);

        this.add
            .image(this.config.width / 2, this.config.height / 6, "header")
            .setOrigin(0.5)
            .setScale(0.7);

        this.add
            .image(this.config.width / 2, this.config.height / 2 - 50, "skull")
            .setOrigin(0.5)
            .setScale(0.7);

        this.add
            .text(this.config.width / 2, this.config.height / 6, "DEFEAT!", {
                fontFamily: "customFont",
                fontSize: "60px",
            })
            .setOrigin(0.5, 0.5)
            .setColor("#D9B48FFF");

        this.createHomeButton();
        this.createRestartButton();
    }

    createHomeButton() {
        const homeBtn = this.add
            .image(
                this.config.width / 2 - 75,
                this.config.height / 2 + 150,
                "home-btn-big"
            )
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive()
            .setDepth(2);

        homeBtn.on("pointerup", () => {
            this.select.play();
            this.scene.stop("PlayScene");
            this.scene.start("MainMenu");
            this.game.canvas.classList.remove("custom-cursor");
        });

        homeBtn.on("pointerover", () => {
            this.cursorOver.play();
            homeBtn.setTint(0xc2c2c2);
            this.game.canvas.classList.add("custom-cursor");
        });

        homeBtn.on("pointerout", () => {
            homeBtn.clearTint();
            this.game.canvas.classList.remove("custom-cursor");
        });
    }

    createRestartButton() {
        const restartBtn = this.add
            .image(
                this.config.width / 2 + 75,
                this.config.height / 2 + 150,
                "restart-btn-big"
            )
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive()
            .setDepth(2);

        restartBtn.on("pointerup", () => {
            this.select.play();
            this.scene.stop("GameOver");
            EventEmitter.emit("RESTART_GAME");
            this.game.canvas.classList.remove("custom-cursor");
        });

        restartBtn.on("pointerover", () => {
            this.cursorOver.play();
            restartBtn.setTint(0xc2c2c2);
            this.game.canvas.classList.add("custom-cursor");
        });

        restartBtn.on("pointerout", () => {
            restartBtn.clearTint();
            this.game.canvas.classList.remove("custom-cursor");
        });
    }
}

export default GameOver;

