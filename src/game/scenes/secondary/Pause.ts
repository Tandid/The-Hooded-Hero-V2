import BaseScene from "../BaseScene";

class PauseScene extends BaseScene {
    constructor(config: any) {
        super("PauseScene", config);
    }

    create() {
        super.create();
        this.createPage();
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
        this.createButton(
            this.config.width / 2 - 75,
            this.config.height / 2 + 50,
            "yes-btn",
            () => {
                this.scene.stop("PlayScene");
                // this.scene.stop("WaitingScene");
                this.scene.start("MainMenu");
            }
        );
    }

    createNoButton() {
        this.createButton(
            this.config.width / 2 + 75,
            this.config.height / 2 + 50,
            "no-btn",
            () => {
                this.scene.stop("PauseScene");
                this.scene.isPaused("PlayScene") === true
                    ? this.scene.resume("PlayScene")
                    : "";
                // this.scene.isPaused("WaitingScene") === true
                //     ? this.scene.resume("WaitingScene")
                //     : "";
            }
        );
    }
}

export default PauseScene;

