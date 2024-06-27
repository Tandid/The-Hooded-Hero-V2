import EventEmitter from "../../../events/Emitter";
import BaseScene from "../BaseScene";

class GameOverScene extends BaseScene {
    gameOver: any;

    constructor(config: any) {
        super("GameOverScene", config);
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);

        super.create();

        this.gameOver = this.sound.add("lose", { volume: 0.1 }).play();

        this.createPage();
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
        return this.createButton(
            this.config.width / 2 - 75,
            this.config.height / 2 + 150,
            "home-btn-big",
            () => {
                this.scene.stop("PlayScene");
                this.scene.start("MainMenu");
            }
        );
    }

    createRestartButton() {
        return this.createButton(
            this.config.width / 2 + 75,
            this.config.height / 2 + 150,
            "restart-btn-big",
            () => {
                this.scene.stop("GameOverScene");
                EventEmitter.emit("RESTART_GAME");
            }
        );
    }
}

export default GameOverScene;

