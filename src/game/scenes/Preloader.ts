import { Scene } from "phaser";
import { Socket } from "socket.io-client";

export default class Preloader extends Scene {
    socket: Socket;

    constructor() {
        super("Preloader");
    }

    init(data: any) {
        this.socket = data.socket;
        console.log("Initialized", this.socket);
        console.log({ Loading: data });
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

