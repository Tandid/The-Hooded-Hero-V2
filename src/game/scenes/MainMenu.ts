import { GameObjects } from "phaser";
import BaseScene from "./BaseScene";

export class MainMenu extends BaseScene {
    background: GameObjects.Image;
    config: any;
    cursorOver: any;
    select: any;
    pageFlip: any;
    flute: any;

    constructor(config: any) {
        super("MainMenu", config);
        this.config = {
            width: 1280,
            height: 720,
        };
        this.menu = [
            { scene: "PlayScene", text: "Story Mode" },
            { scene: "CharSelection", text: "Multiplayer" },
            { scene: "LevelScene", text: "Levels" },
        ];
    }

    init() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.cursorOver = this.sound.add("cursorOver");
        this.cursorOver.volume = 0.4;

        this.select = this.sound.add("select");
        this.select.volume = 0.4;

        this.pageFlip = this.sound.add("page-flip");
        this.pageFlip.volume = 0.4;

        this.flute = this.sound.add("flute");
        this.flute.volume = 0.4;

        this.add
            .image(this.config.width / 2, this.config.height / 2, "panel-1")
            .setOrigin(0.5)
            .setScale(0.8);
        this.add
            .image(this.config.width / 2, this.config.height / 2, "logo")
            .setOrigin(0.5)
            .setScale(0.6);

        this.add
            .image(this.config.width / 8, this.config.height - 30, "textbox")
            .setOrigin(0.5)
            .setScale(1, 0.5)
            .setDepth(1);

        this.add
            .image(this.config.width / 25, this.config.height - 30, "profile")
            .setOrigin(0.5)
            .setScale(0.5)
            .setDepth(2);
    }

    create() {
        super.create(); // This uses the create function from the BaseScene

        // this.add
        //   .text(
        //     this.config.width / 10 - 10,
        //     this.config.height - 45,
        //     `${this.username}`,
        //     {
        //       fontFamily: "customFont",
        //       fontSize: "30px",
        //       fontWeight: "larger",
        //     }
        //   )
        //   .setOrigin(0)
        //   .setColor("#000")
        //   .setDepth(2);

        this.createControlsButton();
        this.createContactsButton();
        this.createSettingsButton();
        this.createMenu(this.menu, this.setupMenuEvents.bind(this));
        this.playBgMusic();
    }

    createSettingsButton() {
        const settingsBtn = this.add
            .image(
                this.config.width - 30,
                this.config.height - 30,
                "settings-button"
            )
            .setOrigin(0.5)
            .setScale(0.5)
            .setInteractive();

        settingsBtn.on("pointerup", () => {
            this.select.play();
            this.scene.launch("SettingsOverlayScene");
        });
        settingsBtn.on("pointerover", () => {
            settingsBtn.setTint(0xc2c2c2);
            this.cursorOver.play();
        });
        settingsBtn.on("pointerout", () => {
            settingsBtn.clearTint();
        });
    }

    createControlsButton() {
        const controlsBtn = this.add
            .image(
                this.config.width - 100,
                this.config.height - 30,
                "controls-btn"
            )
            .setOrigin(0.5)
            .setScale(0.5)
            .setDepth(2)
            .setInteractive();

        controlsBtn.on("pointerup", () => {
            this.pageFlip.play();
            this.scene.sleep("MenuScene");
            this.scene.launch("ControlsScene");
        });

        controlsBtn.on("pointerover", () => {
            controlsBtn.setTint(0xc2c2c2);
            this.cursorOver.play();
        });

        controlsBtn.on("pointerout", () => {
            controlsBtn.clearTint();
        });
    }

    createContactsButton() {
        const contactsBtn = this.add
            .image(this.config.width - 50, this.config.height / 10, "page")
            .setOrigin(0.5)
            .setScale(1)
            .setDepth(2)
            .setInteractive();

        contactsBtn.on("pointerup", () => {
            this.pageFlip.play();
            this.scene.sleep("MenuScene");
            this.scene.launch("ContactScene");
        });

        contactsBtn.on("pointerover", () => {
            contactsBtn.setTint(0xc2c2c2);
            this.cursorOver.play();
        });

        contactsBtn.on("pointerout", () => {
            contactsBtn.clearTint();
        });
    }

    playBgMusic() {
        this.sound.stopAll();

        if (this.sound.get("menu-theme")) {
            this.sound.get("menu-theme", { loop: true, volume: 0.04 }).play();
            return;
        }
        this.sound.add("menu-theme", { loop: true, volume: 0.04 }).play();
    }

    setupMenuEvents(menuItem: any) {
        // if (this.scene.isActive("SettingsOverlayScene") === false) {
        //   return;
        // }
        const textGO = menuItem.textGO;
        textGO.setInteractive();

        textGO.on("pointerover", () => {
            this.scene.is;
            this.cursorOver.play();
            textGO.setStyle({ fill: "#fff" });
        });

        textGO.on("pointerout", () => {
            textGO.setStyle({ fill: "#000" });
        });

        textGO.on("pointerup", () => {
            if (menuItem.text === "Story Mode") {
                this.cameras.main.fadeOut(500, 0, 0, 0);

                setTimeout(() => this.scene.stop("MenuScene"), 500);
                setTimeout(() => this.scene.start("TransitionScene"), 500);
                setTimeout(() => this.scene.stop("TransitionScene"), 4000);

                setTimeout(
                    () => menuItem.scene && this.scene.start(menuItem.scene),
                    4000
                );
                this.flute.play();
            } else {
                this.select.play();
                this.scene.sleep("MenuScene");
                // this.scene.launch(menuItem.scene, {
                //     socket: this.socket,
                //     username: this.username,
                // });
            }
        });
    }
}

