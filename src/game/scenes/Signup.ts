import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export default class Signup extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    SignupText: Phaser.GameObjects.Text;

    constructor() {
        super("Signup");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xfff);

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        // this.scene.start("MainMenu");
        console.log(this.scene);
    }
}

