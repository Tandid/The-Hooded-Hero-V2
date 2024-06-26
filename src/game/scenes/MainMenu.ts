// @ts-nocheck

import { GameObjects } from "phaser";
import { Socket } from "socket.io-client";
import { EventBus } from "../EventBus";
import BaseScene from "./BaseScene";

export default class MainMenu extends BaseScene {
    background: GameObjects.Image;
    config: any;
    cursorOver: any;
    select: any;
    pageFlip: any;
    flute: any;
    socket: Socket;

    constructor(config: any) {
        super("MainMenu", config);
        this.config = config;
        this.menu = [
            { scene: "PlayScene", text: "Story Mode" },
            { scene: "CharSelection", text: "Multiplayer" },
            { scene: "LevelScene", text: "Levels" },
        ];
    }

    init(data: any) {
        this.socket = data.socket;
        console.log({ MainMenu: data });
    }

    create() {
        super.create(); // This uses the create function from the BaseScene

        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.playBgMusic();

        this.createPage();
        this.createControlsButton();
        this.createContactsButton();
        this.createSettingsButton();
        this.createMenu(this.menu, this.setupMenuEvents.bind(this));

        EventBus.emit("current-scene-ready", this); // Essential for changing scenes
    }

    createPage() {
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

        this.tooltipText = this.add
            .text(0, 0, "", {
                fontFamily: "customFont",
                fontSize: "16px",

                padding: {
                    x: 8,
                    y: 6,
                },
                alpha: 0, // Initially invisible
                wordWrap: { width: 100, useAdvancedWrap: true },
            })
            .setOrigin(0.5)
            .setDepth(3)
            .setVisible(false); // Initially hidden
    }

    playBgMusic() {
        this.sound.stopAll();

        if (this.sound.get("menu-theme")) {
            this.sound.get("menu-theme", { loop: true, volume: 0.04 }).play();
            return;
        }
        this.sound.add("menu-theme", { loop: true, volume: 0.04 }).play();
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
            this.scene.launch("SettingsOverlay");
        });
        settingsBtn.on("pointerover", () => {
            settingsBtn.setTint(0xc2c2c2);
            this.cursorOver.play();
            this.showTooltip(settingsBtn.x, settingsBtn.y - 50, "Settings");
        });
        settingsBtn.on("pointerout", () => {
            settingsBtn.clearTint();
            this.hideTooltip();
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
            this.showTooltip(
                controlsBtn.x,
                controlsBtn.y - 50,
                "Keyboard Controls"
            );
        });

        controlsBtn.on("pointerout", () => {
            controlsBtn.clearTint();
            this.hideTooltip();
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
            this.showTooltip(contactsBtn.x, contactsBtn.y + 50, "Contact");
        });

        contactsBtn.on("pointerout", () => {
            contactsBtn.clearTint();
            this.hideTooltip();
        });
    }

    setupMenuEvents(menuItem: any) {
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

                setTimeout(() => this.scene.stop("MainMenu"), 500);
                setTimeout(() => this.scene.start("TransitionScene"), 500);
                setTimeout(() => this.scene.stop("TransitionScene"), 4000);

                setTimeout(
                    () => menuItem.scene && this.scene.start(menuItem.scene),
                    4000
                );
                this.flute.play();
            } else {
                this.select.play();
                this.scene.sleep("MainMenu");
                this.scene.launch(menuItem.scene, {
                    socket: this.socket,
                    username: "Player",
                });
            }
        });
    }

    showTooltip(x, y, text) {
        this.tooltipText.setText(text);
        this.tooltipText.setPosition(x, y); // Adjust position as needed
        this.tooltipText.setAlpha(1);
        this.tooltipText.setVisible(true);
    }

    hideTooltip() {
        this.tooltipText.setVisible(false);
        this.tooltipText.setAlpha(0);
    }

    changeScene() {
        this.scene.start("Signup");
    }
}

