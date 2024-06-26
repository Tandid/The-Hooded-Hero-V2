import EventEmitter from "../../../events/Emitter";
import BaseUIScene from "./BaseUIScene";

class VictoryScene extends BaseUIScene {
    victory: any;

    constructor(config: any) {
        super("VictoryScene", config);
    }

    create({ gameStatus }: any) {
        super.create({ gameStatus });

        this.victory = this.sound.add("win", { volume: 0.1 }).play();

        this.createPage();
    }

    createPage() {
        this.add
            .image(this.config.width / 2, this.config.height / 2, "panel-1")
            .setOrigin(0.5)
            .setScale(1, 0.7);

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
            .image(
                this.config.width / 2 - 100,
                this.config.height / 2 - 60,
                "star"
            )
            .setOrigin(0.5)
            .setScale(1.1);
        this.add
            .image(
                this.config.width / 2 + 100,
                this.config.height / 2 - 60,
                "star"
            )
            .setOrigin(0.5)
            .setScale(1.1);
        this.add
            .image(this.config.width / 2, this.config.height / 2 - 85, "star")
            .setOrigin(0.5)
            .setScale(1.1);
        this.add
            .image(
                this.config.width / 2,
                this.config.height / 2 + 50,
                "panel-4"
            )
            .setOrigin(0.5)
            .setScale(0.5);
        this.add
            .image(
                this.config.width / 2 - 50,
                this.config.height / 2 + 50,
                "coin"
            )
            .setOrigin(0.5)
            .setScale(0.7);

        this.add
            .text(this.config.width / 2, this.config.height / 6, "You Win!", {
                fontFamily: "customFont",
                fontSize: "60px",
            })
            .setOrigin(0.5, 0.5)
            .setColor("#D9B48FFF");

        this.createHomeButton();
        this.createRestartButton();
        this.createPlayButton();
    }

    createHomeButton() {
        return this.createButton(
            this.config.width / 2 - 150,
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
            this.config.width / 2,
            this.config.height / 2 + 150,
            "restart-btn-big",
            () => {
                this.scene.stop("VictoryScene");
                EventEmitter.emit("RESTART_GAME");
            }
        );
    }

    createPlayButton() {
        return this.createButton(
            this.config.width / 2 + 150,
            this.config.height / 2 + 150,
            "play-btn",
            () => {
                this.scene.stop("VictoryScene");
                this.registry.inc("level", 1);
                this.registry.inc("unlocked-levels", 1);
                EventEmitter.emit("RESTART_GAME");
            }
        );
    }
}

export default VictoryScene;

