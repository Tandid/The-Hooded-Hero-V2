export default class UsernameSceneConfig {
    constructor(scene, socket) {
        this.scene = scene;
        this.socket = socket;
        this.state = {
            savedText: "",
            inputTextBox: undefined,
            inputTextBoxConfigSettings: undefined,
        };
    }

    runAllTextBoxLogic(x, y, config, sound) {
        const { scene } = this;

        this.saveConfigToState(x, y, config);
        this.state.inputTextBox = this.createNameInputBox(config);
        this.state.inputTextBox.setInteractive();

        const thisConfigContext = this;

        this.state.inputTextBox.on(
            "pointerdown",
            function () {
                const config = {
                    onTextChanged: function (textObject, text) {
                        textObject.text = text;
                    },
                    onClose: function (textObject) {
                        thisConfigContext.state.savedText = textObject.text;
                        thisConfigContext.startConfirmation();
                    },
                    selectAll: true,
                };
                scene.plugins
                    .get("rexTextEdit")
                    .edit(thisConfigContext.state.inputTextBox, config);
            },
            { scene, thisConfigContext }
        );
    }
    // ------------------------------------------- HELPER METHODS-------------------------------------------

    getName() {
        return this.state.savedText;
    }

    saveConfigToState(x, y, config) {
        if (!this.state.inputTextBoxConfigSettings) {
            this.state.inputTextBoxConfigSettings = config;
            this.state.inputTextBoxConfigSettings.x = x;
            this.state.inputTextBoxConfigSettings.y = y;
        }
    }

    createNameInputBox(config) {
        const { scene } = this;
        const { x, y, fixedWidth, fixedHeight } = config;
        return scene.add
            .rexBBCodeText(x, y, "", {
                fontFamily: "customFont",
                fontSize: "50px",
                fixedWidth: 300,
                fixedHeight: 80,
                backgroundColor: "#958761",
                halign: "center",
                valign: "center",
                maxLines: 1,
            })
            .setOrigin(0.5);
    }

    startConfirmation() {
        const { scene } = this;

        this.pageFlip = scene.sound.add("page-flip");
        this.pageFlip.volume = 0.4;
        this.pageFlip.play();

        scene.scene.start("UserConfirmationScene", {
            socket: this.socket,
            username: this.getName(),
        });
    }
}

