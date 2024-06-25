import { Scene } from "phaser";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        // Load essential assets
        this.load.image("logo", "public/assets/logo.png");
        this.load.image("dummy", "public/assets/dummy.png");
        this.load.image("arrow", "public/assets/weapons/arrow.png");

        // Add loading bar, progress text, etc.
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff, // white
            },
        });

        this.load.on("progress", (percent) => {
            loadingBar.fillRect(
                0,
                this.sys.game.config.height / 2,
                this.sys.game.config.width * percent,
                50
            );
        });

        this.load.on("complete", () => {
            this.scene.start("MainMenu");
        });
    }
}

