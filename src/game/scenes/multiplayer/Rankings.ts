// @ts-nocheck

import BaseScene from "../BaseScene";

class RankingScene extends BaseScene {
    constructor(config: any) {
        super("RankingScene", { ...config, canGoBack: true });
    }

    init(data) {
        this.ranking = data.rankings;
    }

    create() {
        super.create();

        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.setupUI();
    }

    setupUI() {
        this.add
            .image(this.config.width / 2, this.config.height / 2, "panel-2")
            .setOrigin(0.5)
            .setScale(1, 0.7);

        this.add
            .image(
                this.config.width / 2,
                this.config.height / 6,
                "header-shadow"
            )
            .setOrigin(0.5)
            .setScale(0.9);

        this.add
            .image(this.config.width / 2, this.config.height / 6, "header")
            .setOrigin(0.5)
            .setScale(0.9);

        this.add
            .text(this.config.width / 2, this.config.height / 6, "RANKINGS", {
                fontFamily: "customFont",
                fontSize: "72px",
            })
            .setOrigin(0.5, 0.5)
            .setColor("#D9B48FFF");

        this.add
            .image(this.config.width / 4, this.config.height / 2, "trophy")
            .setOrigin(0.5)
            .setScale(0.3);

        this.displayRankings();
        this.createCloseButton();
    }

    displayRankings() {
        const startY = this.config.height / 3;
        const lineHeight = 50;

        this.ranking.forEach((player, index) => {
            if (index === 0) {
                this.add
                    .text(
                        this.config.width / 2,
                        startY + index * lineHeight,
                        `#${index + 1} ${player.username}`,
                        {
                            fontFamily: "customFont",
                            fontSize: "48px",
                        }
                    )
                    .setOrigin(0.5, 0.5)
                    .setColor("#000");
            } else {
                this.add
                    .text(
                        (this.config.width / 4) * 3,
                        startY + (index - 1) * lineHeight,
                        `#${index + 1} ${player.username}`,
                        {
                            fontFamily: "customFont",
                            fontSize: "30px",
                        }
                    )
                    .setOrigin(0.5, 0.5)
                    .setColor("#000");
            }
        });
    }

    createCloseButton() {
        const closeBtn = this.add
            .image(
                this.config.width / 1.1 - 20,
                this.config.height / 7 + 20,
                "close-btn"
            )
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive()
            .setDepth(2);

        closeBtn.on("pointerup", () => {
            this.selectFx.play();
            this.scene.stop("RankingScene");
            this.scene.start("MainMenu");
            this.game.canvas.classList.remove("custom-cursor");
        });

        closeBtn.on("pointerover", () => {
            this.cursorOverFx.play();
            closeBtn.setTint(0xff6666);
            this.game.canvas.classList.add("custom-cursor");
        });

        closeBtn.on("pointerout", () => {
            closeBtn.clearTint();
            this.game.canvas.classList.remove("custom-cursor");
        });
    }
}

export default RankingScene;

