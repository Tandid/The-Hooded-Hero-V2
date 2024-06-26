import BaseUIScene from "./BaseUIScene";

class GameOverScene extends BaseUIScene {
    gameOver: any;

    constructor(config: any) {
        super("GameOverScene", config);
    }

    create({ gameStatus }: any) {
        this.gameOver = this.sound.add("lose", { volume: 0.1 }).play();
        super.create({ gameStatus });
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

        this.createHomeButton(
            this.config.width / 2 - 75,
            this.config.height / 2 + 150
        );

        this.createRestartButton(
            this.config.width / 2 + 75,
            this.config.height / 2 + 150,
            "GameOverScene"
        );
    }
}

export default GameOverScene;

