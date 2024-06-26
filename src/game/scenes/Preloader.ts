import { GameObjects, Scene } from "phaser";
import { Socket } from "socket.io-client";

// Preloader Assets
import { preloadAudio } from "../preloaders/preloadAudio";
import { preloadCaveBg } from "../preloaders/preloadCaveBg";
import { preloadCollectibles } from "../preloaders/preloadCollectibles";
import { preloadForestBg } from "../preloaders/preloadForestBg";
import { preloadLevelMaps } from "../preloaders/preloadLevelMaps";
import { preloadProjectiles } from "../preloaders/preloadProjectiles";
import { preloadSpriteSheets } from "../preloaders/preloadSpriteSheets";
import { preloadTiles } from "../preloaders/preloadTiles";
import { preloadUI } from "../preloaders/preloadUI";

export default class Preloader extends Scene {
    config: any;
    arrow: GameObjects.Image;
    dummy: GameObjects.Image;
    start: number;
    fontFamily: string;
    loadingText: GameObjects.Text;
    socket: Socket;

    constructor(config: any) {
        super("Preloader");
        this.config = config;
        this.fontFamily = "customFont";
        this.start = this.config.width / 10;
    }

    // Init and create are similar, init starts before preload, while create starts after
    init(data: any) {
        this.socket = data.socket;
        console.log({ Preloader: data });

        this.createPage();
        this.generateRandomHint();
    }

    // Preload all assets here
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

    createPage() {
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
    }

    // Loading bar updates
    updateLoadingBar(progress: number) {
        const end = this.dummy.x - 200; // This is so that the arrow ends where the dummy is
        const x = this.start + progress * (end - this.start);
        this.arrow.setX(x);

        this.loadingText.setText(
            `Loading Assets and Textures ... (${Math.round(progress * 100)}%)`
        );
    }

    loadingComplete() {
        this.scene.start("MainMenu", { socket: this.socket });
    }

    // Random hint generator
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

