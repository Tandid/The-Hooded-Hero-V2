// @ts-nocheck

import { Socket } from "socket.io-client";
import BaseScene from "./BaseScene";

class UsernameScene extends BaseScene {
    state: {
        savedText: string;
    };
    socket: Socket;
    pageFlip: any;
    confirmBtn: any;
    noBtn: any;

    constructor(config: any) {
        super("UsernameScene", config);
        this.state = {
            savedText: "",
        };
    }

    init(data: any) {
        this.socket = data.socket;
        console.log({ UsernameScene: data });
    }

    create() {
        super.create();
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.createPage();
        this.createInputBox();
        this.createConfirmButton();
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
                "Enter Your Name!",
                {
                    fontFamily: "customFont",
                    fontSize: "60px",
                    fontWeight: "larger",
                }
            )
            .setOrigin(0.5, 0.5)
            .setColor("#000");
    }

    createInputBox() {
        const inputTextBox = this.add
            .rexBBCodeText(this.config.width / 2, this.config.height / 2, "", {
                fontFamily: "customFont",
                fontSize: "50px",
                fixedWidth: 300,
                fixedHeight: 80,
                backgroundColor: "#958761",
                halign: "center",
                valign: "center",
                maxLines: 1,
            })
            .setOrigin(0.5)
            .setInteractive();

        inputTextBox.on("pointerdown", () => {
            const config = {
                onTextChanged: (textObject, text) => {
                    textObject.text = text;
                    this.state.savedText = text;
                    this.updateButtonVisibility();
                },
                onClose: (textObject) => {
                    this.state.savedText = textObject.text;
                    this.updateButtonVisibility();
                },
                selectAll: true,
            };
            this.plugins.get("rexTextEdit").edit(inputTextBox, config);
        });
    }

    createConfirmButton() {
        this.confirmBtn = this.createButton(
            this.config.width / 2,
            this.config.height / 2 + 125,
            "yes-btn",
            () => {
                this.confirmName();
            }
        ).setVisible(false);

        return this.confirmBtn;
    }

    updateButtonVisibility() {
        const isTextNotEmpty = this.state.savedText.trim().length > 0;
        this.confirmBtn.setVisible(isTextNotEmpty);
    }

    confirmName() {
        this.pageFlip?.play();

        this.scene.start("MainMenu", {
            socket: this.socket,
            username: this.state.savedText,
        });
    }
}

export default UsernameScene;

