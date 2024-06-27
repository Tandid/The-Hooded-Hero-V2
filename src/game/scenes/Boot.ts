import { Scene } from "phaser";

export default class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        this.load.setPath("assets");

        this.load.scenePlugin(
            "rexuiplugin",
            "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
            "rexUI",
            "rexUI"
        );

        this.load.image("logo", "logo.png");
        this.load.image("dummy", "dummy.png");
        this.load.image("arrow", "weapons/arrow.png");

        this.load.once("complete", () => {
            this.create();
        });
    }

    create() {
        this.scene.start("Preloader");
    }
}

