import { Scene } from "phaser";

export default class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("logo", "logo.png");
        this.load.image("dummy", "dummy.png");
        this.load.image("arrow", "weapons/arrow.png");
    }

    create() {
        this.scene.start("BootScene");
    }
}

