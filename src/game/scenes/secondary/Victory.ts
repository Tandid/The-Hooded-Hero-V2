import EventEmitter from "../../../events/Emitter";
import BaseScene from "../BaseScene";

class VictoryScene extends BaseScene {
    victory: any;
    score: number;

    constructor(config: any) {
        super("VictoryScene", config);
    }

    init(data: any) {
        console.log({ Data: data.score });
        this.score = data.score; // Store the score
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);

        super.create();

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

        // Add empty stars
        this.addStar(
            this.config.width / 2 - 130,
            this.config.height / 2 - 75,
            0,
            0.7
        );
        this.addStar(
            this.config.width / 2,
            this.config.height / 2 - 100,
            5,
            0.7
        );
        this.addStar(
            this.config.width / 2 + 130,
            this.config.height / 2 - 75,
            10,
            0.7
        );

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

        this.add
            .text(
                this.config.width / 2,
                this.config.height / 2 + 50,
                `${this.score}`,
                {
                    fontFamily: "customFont",
                    fontSize: "50px",
                }
            )
            .setOrigin(0, 0.5)
            .setColor("#FFFFFF");

        this.createHomeButton();
        this.createRestartButton();
        this.createPlayButton();
    }

    addStar(x: number, y: number, requiredScore: number, scale: number) {
        const starKey =
            this.score >= requiredScore ? "star-full" : "star-shadow";
        const star = this.add
            .image(x, y, starKey)
            .setOrigin(0.5)
            .setScale(0)
            .setAlpha(0);

        // Animate the star's appearance
        this.tweens.add({
            targets: star,
            scale: scale,
            alpha: 1,
            ease: "Bounce.easeOut",
            duration: 300,
            delay: requiredScore * 100, // Delay based on the required score to make them appear one by one
        });
    }

    createHomeButton() {
        this.createButton(
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
        this.createButton(
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
        this.createButton(
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

