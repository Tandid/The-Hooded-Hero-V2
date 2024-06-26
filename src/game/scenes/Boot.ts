import { Scene } from "phaser";
import io, { Socket } from "socket.io-client";

export default class Boot extends Scene {
    socket: Socket;

    constructor() {
        super("Boot");
        this.socket = io("http://localhost:3000");
    }

    preload() {
        this.load.scenePlugin(
            "rexuiplugin",
            "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
            "rexUI",
            "rexUI"
        );

        this.load.once("complete", () => {
            this.create();
        });
    }

    create() {
        this.setupWebSocket();
        this.scene.start("Preloader", { socket: this.socket });
    }

    setupWebSocket() {
        this.socket.on("connect", () => {
            console.log("Connected to WebSocket server");
        });

        this.socket.on("disconnect", () => {
            console.log("Disconnected from WebSocket server");
        });

        this.socket.on("message", (data: any) => {
            console.log("Message from server:", data);
        });

        this.socket.emit("client-message", "Hello from client");
    }

    update() {}
}

