import { GameObjects, Scene } from "phaser";
import { preloadAudio } from "../preloaders/preloadAudio";
import { preloadCaveBg } from "../preloaders/preloadCaveBg";
import { preloadCollectibles } from "../preloaders/preloadCollectibles";
import { preloadForestBg } from "../preloaders/preloadForestBg";
import { preloadLevelMaps } from "../preloaders/preloadLevelMaps";
import { preloadProjectiles } from "../preloaders/preloadProjectiles";
import { preloadSpriteSheets } from "../preloaders/preloadSpriteSheets";
import { preloadTiles } from "../preloaders/preloadTiles";
import { preloadUI } from "../preloaders/preloadUI";

export class BootScene extends Scene {
    background: GameObjects.Image;
    config: any;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    arrow: GameObjects.Image;
    dummy: GameObjects.Image;
    start: number;
    fontFamily: string;
    loadingText: GameObjects.Text;

    constructor(config: any) {
        super("BootScene");
        this.config = config;
        this.fontFamily = "customFont";
        this.start = this.config.width / 10;
    }

    init() {
        this.add
            .image(this.config.width / 2, this.config.height / 2, "logo")
            .setOrigin(0.5)
            .setScale(0.6);

        this.loadingText = this.add
            .text(
                this.config.width / 2,
                this.config.height / 2,
                `Loading Assets and Textures ... (0%)`,
                {
                    fontFamily: this.fontFamily,
                    fontSize: "30px",
                }
            )
            .setOrigin(0.5, 0.5)
            .setColor("#FFF");

        this.dummy = this.add
            .image(
                this.config.width / 1.1 + 50,
                this.config.height / 1.3,
                "dummy"
            )
            .setScale(1);

        this.arrow = this.add
            .image(this.start, this.config.height / 1.6, "arrow")
            .setScale(1.1)
            .setDepth(2);

        this.generateRandomHint();
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("logo", "logo.png");
        this.load.image("github", "github.png");
        this.load.image("linkedin", "linkedin.png");
        this.load.image("gmail", "gmail.png");

        preloadAudio(this);
        preloadCaveBg(this);
        preloadCollectibles(this);
        preloadForestBg(this);
        preloadLevelMaps(this);
        preloadProjectiles(this);
        preloadSpriteSheets(this);
        preloadTiles(this);
        preloadUI(this);

        this.load.on("progress", this.updateLoadingBar, this);
        this.load.on("complete", this.loadingComplete, this);
    }

    updateLoadingBar(progress: number) {
        const end = this.dummy.x - 200; // Set the end position of the loading bar to dummy
        const x = this.start + progress * (end - this.start);
        this.arrow.setX(x);

        this.loadingText.setText(
            `Loading Assets and Textures ... (${Math.round(progress * 100)}%)`
        );
    }

    loadingComplete() {
        console.log("Loading complete");
        this.scene.start("MainMenu");
    }

    generateRandomHint() {
        const messages = [
            "Not all heroes wear capes, some wear hoods..",
            "Hint: Yes, you can double jump!",
            "The Hooded Hero's favorite show is Arrow, who would've guessed right??",
            "Hint: A little birdy said to stay away from Level 3, unless...",
            "Hint: You can spam arrows!",
            "Hint: Sword attacks do double the damage of arrows. You're welcome.",
        ];
        const randomIndex = Math.floor(Math.random() * messages.length);

        this.add
            .text(
                this.config.width / 2,
                this.config.height / 1.1,
                `${messages[randomIndex]}`,
                {
                    fontFamily: this.fontFamily,
                    fontSize: "15px",
                }
            )
            .setOrigin(0.5, 0.5)
            .setColor("#FFF");
    }
}

