import Phaser from "phaser";

class Pause extends Phaser.Scene {
    config: any;
    cursorOver: any;
    select: any;

    constructor(config: any) {
        super("Pause");
        this.config = config;
    }

    create() {
        this.createPage();
        this.addSoundEffects();
    }

    addSoundEffects() {
        this.cursorOver = this.sound.add("cursorOver", { volume: 0.4 });
        this.select = this.sound.add("select", { volume: 0.4 });
    }

    createPage() {
        this.add
            .image(this.config.width / 2, this.config.height / 2, "panel-3")
            .setOrigin(0.5)
            .setScale(0.7);

        this.add
            .text(
                this.config.width / 2,
                this.config.height / 2 - 50,
                "Return to Menu?",
                {
                    fontFamily: "customFont",
                    fontSize: "50px",
                }
            )
            .setOrigin(0.5, 0.5)
            .setColor("#000");

        this.createYesButton();
        this.createNoButton();
    }

    createYesButton() {
        const yesBtn = this.add
            .image(
                this.config.width / 2 - 75,
                this.config.height / 2 + 50,
                "yes-btn"
            )
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive()
            .setDepth(2);

        yesBtn.on("pointerup", () => {
            this.select.play();
            this.scene.stop("PlayScene");
            this.scene.stop("WaitingScene");
            this.scene.start("MainMenu");
            this.game.canvas.classList.remove("custom-cursor");
        });

        yesBtn.on("pointerover", () => {
            this.cursorOver.play();
            yesBtn.setTint(0x3fbf3f);
            this.game.canvas.classList.add("custom-cursor");
        });

        yesBtn.on("pointerout", () => {
            yesBtn.clearTint();
            this.game.canvas.classList.remove("custom-cursor");
        });
    }

    createNoButton() {
        const noBtn = this.add
            .image(
                this.config.width / 2 + 75,
                this.config.height / 2 + 50,
                "no-btn"
            )
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive()
            .setDepth(2);

        noBtn.on("pointerup", () => {
            this.select.play();
            this.scene.stop("Pause");
            this.scene.isPaused("PlayScene") === true
                ? this.scene.resume("PlayScene")
                : "";
            this.scene.isPaused("WaitingScene") === true
                ? this.scene.resume("WaitingScene")
                : "";
            this.game.canvas.classList.remove("custom-cursor");
        });

        noBtn.on("pointerover", () => {
            this.cursorOver.play();
            noBtn.setTint(0xff6666);
            this.game.canvas.classList.add("custom-cursor");
        });

        noBtn.on("pointerout", () => {
            noBtn.clearTint();
            this.game.canvas.classList.remove("custom-cursor");
        });
    }
}

export default Pause;

