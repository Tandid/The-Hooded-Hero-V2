// @ts-nocheck

import { Socket } from "socket.io-client";
import UsernameConfig from "../../utils/SigninConfig";
import BaseScene from "./BaseScene";

class UsernameScene extends BaseScene {
    state: { titleText: string };
    socket: Socket;

    constructor(config: any) {
        super("UsernameScene", config);
        this.state = {
            titleText: "Enter your name!",
        };
    }

    init(data: any) {
        this.socket = data.socket;
        console.log({ UsernameScene: data });
    }

    create() {
        super.create();
        const usernameConfig = new UsernameConfig(this, this.socket);
        this.cameras.main.fadeIn(500, 0, 0, 0);

        usernameConfig.runAllTextBoxLogic(
            this.config.width / 2,
            this.config.height / 2,
            {
                fontFamily: "customFont",
                textColor: 0xffffff,
                fontSize: "20px",
                fixedWidth: 500,
                fixedHeight: 60,
            }
        );
    }

    createPage() {
        this.add
            .image(this.config.width / 2, this.config.height / 2, "panel-2")
            .setOrigin(0.5)
            .setScale(0.6);

        this.add
            .text(
                this.config.width / 2,
                this.config.height / 3,
                `${this.state.titleText}`,
                {
                    fontFamily: "customFont",
                    fontSize: "60px",
                    fontWeight: "larger",
                }
            )
            .setOrigin(0.5, 0.5)
            .setColor("#000");
    }
}

export default UsernameScene;

