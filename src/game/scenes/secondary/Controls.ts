import BaseScene from "../BaseScene";

class Controls extends BaseScene {
    constructor(config: any) {
        super("Controls", { ...config, canGoBack: true });
    }

    create() {
        super.create();
        this.createPage();
    }

    createPage() {
        this.add
            .image(this.config.width / 2, this.config.height / 2, "panel-2")
            .setOrigin(0.5)
            .setScale(0.7);

        this.add
            .image(this.config.width / 3 - 20, 240, "left-key")
            .setOrigin(0.5)
            .setScale(0.5);

        this.add
            .image(this.config.width / 3 + 80, 240, "right-key")
            .setOrigin(0.5)
            .setScale(0.5);

        this.add
            .image(this.config.width / 3 - 20, 330, "q-key")
            .setOrigin(0.5)
            .setScale(0.5);

        this.add
            .image(this.config.width / 3 + 80, 330, "e-key")
            .setOrigin(0.5)
            .setScale(0.5);
        this.add
            .image(this.config.width / 3 + 35, 420, "space-key")
            .setOrigin(0.5)
            .setScale(0.5);
        this.add
            .image(this.config.width / 3 + 40, 510, "shift-key")
            .setOrigin(0.5)
            .setScale(0.5);

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
            .text(this.config.width / 2, this.config.height / 6, "CONTROLS", {
                fontFamily: "customFont",
                fontSize: "72px",
            })
            .setOrigin(0.5, 0.5)
            .setColor("#D9B48FFF");

        this.add
            .text(this.config.width / 1.75, 240, "Move Left/Right", {
                fontFamily: "customFont",
                fontSize: "40px",
            })
            .setOrigin(0.5, 0.5)
            .setColor("0x000");

        this.add
            .text(
                this.config.width / 1.75 + 20,
                330,
                "Projectile/Sword Attack",
                {
                    fontFamily: "customFont",
                    fontSize: "40px",
                }
            )
            .setOrigin(0.5, 0.5)
            .setColor("0x000");

        this.add
            .text(this.config.width / 1.75, 420, "Jump/Double Jump", {
                fontFamily: "customFont",
                fontSize: "40px",
            })
            .setOrigin(0.5, 0.5)
            .setColor("0x000");
        this.add
            .text(this.config.width / 1.75, 510, "Hold to run", {
                fontFamily: "customFont",
                fontSize: "40px",
            })
            .setOrigin(0.5, 0.5)
            .setColor("0x000");

        this.createCloseButton();
    }

    createCloseButton() {
        const closeBtn = this.add
            .image(
                this.config.width * 0.75 + 20,
                this.config.height / 7 + 20,
                "close-btn"
            )
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive()
            .setDepth(2);

        closeBtn.on("pointerup", () => {
            this.select.play();
            this.scene.wake("MainMenu");
            this.scene.stop("Controls");
        });

        closeBtn.on("pointerover", () => {
            this.cursorOver.play();
            closeBtn.setTint(0xff6666);
        });

        closeBtn.on("pointerout", () => {
            closeBtn.clearTint();
        });
    }
}

export default Controls;

