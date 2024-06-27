// @ts-nocheck

import { Socket } from "socket.io-client";
import BaseScene from "./BaseScene";

class SignupScene extends BaseScene {
    state: {
        savedText: string;
    };
    socket: Socket;
    pageFlip: any;
    confirmBtn: any;
    noBtn: any;

    constructor(config: any) {
        super("SignupScene", config);
        this.state = {
            savedText: "",
        };
    }

    init(data: any) {
        this.socket = data.socket;
        console.log({ SignupScene: data });
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
                "Enter Your Name",
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
            "green-long-button",
            () => {
                this.confirmName();
            },
            "Confirm"
        )
            .setVisible(false)
            .setScale(1.5);

        return this.confirmBtn;
    }

    updateButtonVisibility() {
        const isTextNotEmpty = this.state.savedText.trim().length > 0;
        this.confirmBtn.setVisible(isTextNotEmpty);
    }

    confirmName() {
        if (this.state.savedText.trim().length <= 10) {
            this.pageFlip?.play();
            this.scene.start("MainMenu", {
                socket: this.socket,
                username: this.state.savedText,
            });
        } else {
            const feedbackText = this.add
                .text(
                    this.config.width / 2,
                    this.config.height / 3 + 50,
                    "Name can't exceed more than 10 characters!",
                    {
                        fontFamily: "customFont",
                        fontSize: "24px",
                        color: "#ff0000",
                    }
                )
                .setOrigin(0.5);

            this.time.delayedCall(3000, () => {
                feedbackText.destroy();
            });
        }
    }
}

export default SignupScene;

